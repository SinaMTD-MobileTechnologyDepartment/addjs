/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview remove comments by transform stream
 */
var strip = require('strip-comments');
var through2 = require('through2');

var removeComments = through2(function(file, enc, cb) {
  var code = strip(file.toString());
  cb(null,code);
});

module.exports = removeComments;
