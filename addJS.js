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
    timestamp = Date.now() / (parseInt(Cache, 10) * 60 * 1000);

  function parseDebug() {
    var path = location.pathname,
      match = path.match('debug=(.*?)(&|$)');
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }

  function switchFile(path) {
    var config = addjs.config,
      debug = parseDebug();
    if (debug && config.debugMap && config.debugMap[path]) {
      return config.debugServer + config.debugMap[path];
    } else {
      return path;
    }
  }

  function writeScript(src) {
    document.write('<script src="' + src + '"></script>');
  }

  function writeStyle(href) {
    document.write('<link href="' + href + '" rel="stylesheet">');
  }

  function getConfig(cb) {
    writeScript(configScript + '?t=' + timestamp);
    if (addjs.config) {
      cb(addjs.config);
    }
  }

  function addFile(path, func) {
    getConfig(function(config) {
      path = switchFile(path);
      func(path + '?v=' + config.version);
    });
  }

  var addjs = {
    _debug: false,
    _configLoaded: false,
    css: function(path) {
      addFile(path, writeStyle);
    },
    js: function(path) {
      addFile(path, writeScript);
    },
    setConfig: function(options) {
      if (!options.version) {
        throw new Error('must have a version');
      }
      if (!options.debugServer) {
        options.debugServer = 'http://127.0.0.1:7575/combine?filename=';
      }
      this.config = options;
    }
  };

  win.addjs = addjs;

})(window, document);
