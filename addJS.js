/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview 前端加载脚本,更新时间戳，切换debug,加载css
 * @date 20150902
 */
(function(win, doc) {

  var scripts = doc.getElementsByTagName('script'),
    scriptsLen = scripts.length,
    currentScript = scripts[scriptsLen - 1],
    configScript = currentScript.getAttribute('data-config'),
    Cache = currentScript.getAttribute('data-config-cache'),
    timestamp = parseInt(Date.now() / (parseInt(Cache, 10) * 60 * 1000), 10);

  function parseUrl(reg) {
    return (reg).test(location.search);
  }

  function parseDebug() {
    return parseUrl(/debug/);
  }

  function parseSass() {
    return parseUrl(/sass/);
  }

  function parseES6() {
    return parseUrl(/es6/);
  }

  function switchFile(path) {
    var config = addjs.config,
      debug = parseDebug();
    if (debug && config.debugMap && config.debugMap[path]) {
      var debugPath = config.debugServer + config.debugMap[path];
      debugPath = parseSass() ? debugPath + '&sass=1' : debugPath;
      debugPath = parseES6() ? debugPath + '&es6=1' : debugPath;
      return debugPath;
    } else {
      return path;
    }
  }

  function writeScript(src) {
    doc.write('<script src="' + src + '"></script>');
  }

  function writeStyle(href) {
    doc.write('<link href="' + href + '" rel="stylesheet">');
  }

  function getConfig(cb) {
    if (addjs.config) {
      cb(addjs.config);
    } else {
      writeScript(configScript + '?t=' + timestamp);
      addjs.cbs.push(cb);
    }
  }

  function addFile(path, func) {
    getConfig(function(config) {
      path = switchFile(path);
      path = parseDebug() ? path : path + '?v=' + config.version;
      func(path);
    });
  }

  var addjs = {
    _debug: false,
    _configLoaded: false,
    cbs: [],
    css: function(path) {
      addFile(path, writeStyle);
    },
    js: function(path) {
      addFile(path, writeScript);
    },
    setConfig: function(options) {
      var self = this;
      if (!options.version) {
        throw new Error('must have a version');
      }
      if (!options.debugServer) {
        options.debugServer = 'http://127.0.0.1:7575/combine?filename=';
      }
      this.config = options;
      this.cbs.forEach(function(func) {
        if (!func.exec) {
          func(self.config);
          func.exec = true;
        }
      });
    }
  };

  win.addjs = addjs;

})(window, document);
