/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview 前端加载脚本
 * @date 20150902
 */
(function(win, doc, undef) {

  var scripts = doc.getElementsByTagName('script'),
    scriptsLen = scripts.length,
    currentScript = scripts[scriptsLen - 1],
    confSrc = currentScript.getAttribute('data-conf');

  //helpers
  function parseDebug() {
    var path = location.pathname,
      match = path.match('debug=(.*?)(&|$)');
    if (match && match[1]) {
      return match[1];
    }
    return null;
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

})(window, document);
