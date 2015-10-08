/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview combine file
 */
var utils = require('./utils');
var path = require('path');
var fs = require('fs');
var cssmin = require('cssmin');
var byline = require('byline').LineStream;
var request = require('request');
var combineTarget = require('./combineTarget');
var svn = require('svn-interface');
var through2 = require('through2');
var Readable = require('stream').Readable;
var uglify = require('uglify-js');
var cwd = process.cwd();
var sass = require('sass.js');
var babel = require('babel-core');

var sourceMap = {};

function combine(svninfo) {
  this.svninfo = svninfo;
  this.deps = [];
}

function sassOrEs6(ext) {
  function transform(chunk, enc, cb) {
    if (!this.source) {
      this.source = '';
    }
    this.source += chunk;
    cb();
  }
  var transformEnd;
  if (ext === '.css') {
    transformEnd = function(cb) {
      var self = this;
      sass.compile(this.source, function(result) {
        self.push(result.text);
        cb();
      });
    };
  } else if (ext === '.js') {
    transformEnd = function(cb) {
      var js = babel.transform(this.source, {
        blacklist: ["useStrict"],
        compact:false,
        sourceMaps: true
      });
      sourceMap.babel = js.map;
      this.push(js.code);
      cb();
    };
  }
  return through2(transform, transformEnd);
}

utils.definePublicPros(combine.prototype, {
  concat: function(filepath, keyword, ext) {
    var line = new byline();
    this.deps = [];
    return fs.createReadStream(filepath, {
        encoding: 'utf-8'
      })
      .pipe(line)
      .pipe(combineStream({
        svninfo: this.svninfo,
        deps: this.deps,
        keyword: keyword,
        ext: ext,
        filepath: filepath
      }))
      .pipe(sassOrEs6(ext));
  }
});

combine.build = function(filepath, config, output, beautify) {
  var ext = path.extname(filepath),
    target;
  var filestream = new combine({
    username: config.svninfo.username,
    password: config.svninfo.password,
    command: config.svninfo.command
  }).concat(filepath, config.keywords[ext], ext);
  if (beautify) {
    target = path.resolve(cwd, beautify);
    filestream.pipe(fs.createWriteStream(target)).on('finish',function(){
      console.log('beautify success: '+target); 
    });
  }
  if (output) {
    target = path.resolve(cwd, output);
    filestream.pipe(through2(function(chunk, enc, cb) {
      if (!this.code) {
        this.code = '';
      }
      this.code += chunk;
      cb();
    }, function(cb) {
      var result;
      if (ext === '.js') {
        var js = uglify.minify(this.code, {
          fromString: true,
          inSourceMap: sourceMap.babel,
          outSourceMap: path.basename(filepath) + '.map'
        });
        result = js.code;
        sourceMap.uglify = JSON.parse(js.map);
        fs.writeFileSync(filepath + '.map', JSON.stringify(sourceMap.uglify));
      } else if (ext === '.css') {
        result = cssmin(this.code);
      }
      this.push(result);
      cb();
    })).pipe(fs.createWriteStream(target)).on('finish',function(){
      console.log('build output: '+target); 
    });
  }
};

function pipeFile(file, params) {
  var line = new byline(),
    target = new combineTarget();
  file.pipe(line)
    .pipe(combineStream(params))
    .pipe(target)
    .on('finish', function() {
      this.file = '\r\ntry{' + this.file + '}catch(e){throw new Error(e+" ' + params.errorFile + '");}\r\n';
      params.cb(null, this.file);
    });
}

function getRs(result) {
  var rs = new Readable;
  rs.push(result);
  rs.push(null);
  return rs;
}

function getRequireString(params) {
  if (params.type === 'local') {
    pipeFile(fs.createReadStream(params.filepath, {
      encoding: 'utf-8'
    }), params);
  } else if (params.type === 'http') {
    pipeFile(request(params.filepath), params);
  } else if (params.type === 'svn') {
    svn._setCommand(params.svninfo.command || 'svn');
    var filepath = params.filepath.replace(/^svn\:/, '');
    svn.cat(filepath, {
      username: params.svninfo.username,
      password: params.svninfo.password
    }, function(err, result) {
      if (err) {
        throw new Error(err);
      }
      var rs = getRs(result);
      pipeFile(rs, params);
    });
  }
}

function combineStream(params) {
  return through2(function(line, enc, cb) {
    var reg = new RegExp('^\\s*' + params.keyword + '\\s*\\(\\s*([\'|\"])([\\w\\-\\.\\/\\_\:]*)\\1\\s*\\)\\s*;?', 'gi');
    line = line.toString() + '\r\n';
    var matches = reg.exec(line);
    if (matches && matches[2]) {
      var requireName = matches[2];
      var extname = path.extname(requireName);
      if (extname === params.ext) {
        //先放入堆栈，有重复的不放，忽略，算循环引用，结束之后剔除堆栈
        var type = utils.getRquireType(requireName);
        if (type === 'local' || type === 'svn' || type === 'http') {
          if (params.deps.indexOf(requireName) === -1) {
            params.deps.push(requireName);
            getRequireString({
              svninfo: params.svninfo,
              deps: params.deps,
              keyword: params.keyword,
              ext: params.ext,
              type: type,
              filepath: type === 'local' ? path.resolve(path.dirname(params.filepath), requireName) : requireName,
              errorFile:requireName,
              cb: cb
            });
          } else {
            cb();
          }
        } else {
          cb(new Error('type is illegal ' + type + ' , ' + requireName));
        }
      } else {
        cb(new Error('extname is illegal ' + requireName));
      }
    } else {
      cb(null, line);
    }
  });
}

module.exports = combine;
