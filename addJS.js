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
    timestamp = parseInt(Date.now() / (parseInt(Cache, 10) * 60 * 1000),10);

  function parseDebug() {
    return (/debug/).test(location.search);
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
    doc.write('<script src="' + src + '"></script>');
  }

  function writeStyle(href) {
    doc.write('<link href="' + href + '" rel="stylesheet">');
  }

  function getConfig(cb) {
    writeScript(configScript + '?t=' + timestamp);
    addjs.cbs.push(cb);
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
