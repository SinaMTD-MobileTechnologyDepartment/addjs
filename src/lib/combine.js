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
var cssbeautify = require('cssbeautify');
var babel = require('babel-core');

var sourceMap = {};

function combine(svninfo) {
  this.svninfo = svninfo;
  this.deps = [];
}

function sassOrEsOrEs66(ext, es6, toSass) {
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
      console.log('beautify css...');
      var css = cssbeautify(this.source);
      if (toSass) {
        console.log('compile css for sass...');
        sass.compile(css, function(result) {
          if (result.text) {
            self.push(result.text);
            cb();
          } else {
            cb(result);
          }
        });
      } else {
        this.push(css);
        cb();
      }
    };
  } else if (ext === '.js') {
    transformEnd = function(cb) {
      if (es6) {
        console.log('babel js for es6...');
        var js = babel.transform(this.source, {
          blacklist: ["useStrict"],
          sourceMaps: true,
          compact: false
        });
        sourceMap.babel = js.map;
        this.push(js.code);
      } else {
        this.push(this.source);
      }
      cb();
    };
  }
  return through2(transform, transformEnd);
}

utils.definePublicPros(combine.prototype, {
  concat: function(filepath, keyword, ext, es6, toSass) {
    var line = new byline();
    this.deps = [];
    var stream = fs.createReadStream(filepath, {
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
      .pipe(sassOrEsOrEs66(ext, es6, toSass)).on('error', function(e) {
        console.error(e);
      });
    return stream;
  }
});

combine.build = function(filepath, config, output, beautify, es6, toSass) {
  var ext = path.extname(filepath),
    target;
  var filestream = new combine({
    username: config.svninfo.username,
    password: config.svninfo.password,
    command: config.svninfo.command
  }).concat(filepath, config.keywords[ext], ext, es6, toSass);
  if (beautify) {
    target = path.resolve(cwd, beautify);
    filestream.pipe(fs.createWriteStream(target)).on('finish', function() {
      console.info('beautify success: ' + target);
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
        console.log('minify js by uglify...');
        var uglifyOptions = {
          fromString: true,
          outSourceMap: path.basename(filepath) + '.map'
        };
        if (sourceMap.babel) {
          uglifyOptions.inSourceMap = sourceMap.babel;
        }
        var js = uglify.minify(this.code, uglifyOptions);
        result = js.code;
        fs.writeFileSync(filepath + '.map', js.map);
      } else if (ext === '.css') {
        console.log('min css by cssmin...');
        result = cssmin(this.code);
      }
      this.push(result);
      cb();
    })).pipe(fs.createWriteStream(target)).on('finish', function() {
      console.info('build output: ' + target);
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
      var ext = params.ext;
      if (ext === '.js') {
        this.file = '\r\ntry{' + this.file + '}catch(e){throw new Error(e+" ' + params.errorFile + '");}\r\n';
      } else if (ext === '.css') {
        this.file = this.file + '/*' + params.errorFile + '*/ \r\n';
      }
      console.log('finish dispose ' + params.errorFile + '...');
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
  console.log('start get ' + params.filepath + '...');
  if (params.type === 'local') {
    pipeFile(fs.createReadStream(params.filepath, {
      encoding: 'utf-8'
    }), params);
  } else if (params.type === 'http') {
    pipeFile(request(params.filepath).on('response', function(res) {
      console.log(params.filepath + ' response code: ' + res.statusCode);
    }), params);
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
              errorFile: requireName,
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
