/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview 前端加载脚本,更新时间戳，切换debug,加载css
 * @date 20150902
 */
(function(win, doc, undef) {

  var scripts = doc.getElementsByTagName('script'),
    scriptsLen = scripts.length,
    currentScript = scripts[scriptsLen - 1],
    loadType = currentScript.getAttribute('data-type'),
    configScript = currentScript.getAttribute('data-config'),
    confSrc = currentScript.getAttribute('data-conf'),
    addjs = {
      config: {},
      debug: {
        host: 'http://127.0.0.1',
        port: '7575'
      }
    },
    timestamp = Date.now() / 100;

  //helpers
  function parseDebug() {
    var path = location.pathname,
      match = path.match('debug=(.*?)(&|$)');
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }

  function loadStyle(css) {
    var node = document.createElement("link");
    node.setAttribute("rel", "stylesheet");
    node.setAttribute("type", "text/css");
    node.setAttribute("href", css);
    doc.querySelector('head').appendChild(node);
  }

  function loadScript(url, callback, charset) {
    var node = doc.createElement('script');
    node.onload = node.onerror = node.onreadystatechange = function() {
      if ((/loaded|complete|undefined/).test(node.readyState)) {
        node.onload = node.onerror = node.onreadystatechange = null;
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
        node = undef;
        if (callback) {
          callback();
        }
      }
    };
    node.async = 'async';
    charset = charset || 'utf-8';
    node.charset = charset;
    node.src = url;
    doc.querySelector('head').appendChild(node);
  }

  function runScript() {
    var debug = parseDebug();
    if (debug) {
      loadScript(addjs.debug.host + ':' + addjs.debug.port + '/combine?file=' + debug);
    } Else {
       var ver = addjs.config.timestamp ? '?t=' + addjs.config.timestamp : '';
       loadScript(confSrc + ver);
    }
  }

  runScript();

  win.addjs = addjs;
  win.addjs.loadStyle = loadStyle;

})(window, document);
