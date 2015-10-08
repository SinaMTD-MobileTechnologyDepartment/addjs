/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview debug addjs server
 */
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var combine = require('./combine');

var ContentType = {
  '.js': 'text/javascript',
  '.css': 'text/css'
};

var KEYWORDS = {
  '.js': '@require',
  '.css': '@require'
};

function startServer(dir, options) {
  options = options || {};
  var defaultOptions = {
    host: options.host || '127.0.0.1',
    port: options.port || 7575,
    apiPath: options.apiPath || '/combine',
    apiParam: options.apiParam || 'filename',
    svninfo: options.svninfo
  };
  var keywords = options.keywords ? options.keywords : KEYWORDS;
  app.get(defaultOptions.apiPath, function(req, res, next) {
    if (req.query.hasOwnProperty(defaultOptions.apiParam)) {
      var filepath = req.query[defaultOptions.apiParam];
      filepath = path.resolve(dir, filepath).replace(/\?.*$/g, '');
      var ext = path.extname(filepath);
      if (fs.existsSync(filepath) && (ext === '.js' || ext === '.css')) {
        var es6 = req.query.es6 ? true : false;
        var sass = req.query.sass ? true : false;
        var combineFile = new combine(defaultOptions.svninfo).concat(filepath, keywords[ext], ext, es6, sass);
        res.header('Content-Type', ContentType[ext]);
        combineFile.pipe(res);
      } else {
        next();
      }
    } else {
      next();
    }
  });
  app.use(function(req, res) {
    res.send('Illegal request');
  });
  app.listen(defaultOptions.port, defaultOptions.host, function() {
    console.info('server start ' + defaultOptions.host + ':' + defaultOptions.port);
    console.info('debug basepath: ' + dir);
  });
}

startServer.start = function(dir, config, port) {
  config.port = port ? port : config.port;
  startServer(dir, {
    port: config.port,
    svninfo: config.svninfo,
    keywords: config.keywords
  });
};

module.exports = startServer;
