/**
 * @author xiaojue[designsor@gmail.com]
 */
module.exports = {
  definePublicPros: function(source, pros) {
    for (var i in pros) {
      if (pros.hasOwnProperty(i)) {
        Object.defineProperty(source, i, {
          value: pros[i],
          configurable: true,
          enumerable: true,
          writable: true
        });
      }
    }
    return source;
  },
  definePrivatePros: function(source, pros) {
    for (var i in pros) {
      if (pros.hasOwnProperty(i)) {
        Object.defineProperty(source, i, {
          value: pros[i],
          configurable: false,
          enumerable: false,
          writable: false
        });
      }
    }
    return source;
  },
  getRquireType: function(name) {
    if ((/^http:\/\//).test(name)) {
      return 'http';
    } else if ((/^svn:https:\/\//).test(name)) {
      return 'svn';
    } else {
      return 'local';
    }
  },
  uniq: function(ar) {
    var m, n = [],
      o = {};
    for (var i = 0;
      (m = ar[i]) !== undefined; i++) {
      if (!o[m]) {
        n.push(m);
        o[m] = true;
      }
    }
    return n;
  }
};
