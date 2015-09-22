var stream = require('stream');
var util = require('util');

function combineTarget(){
  stream.Writable.call(this);
  this.file = '';
}
util.inherits(combineTarget,stream.Writable);

combineTarget.prototype._write = function(chunk,encoding,callback){
  this.file += chunk.toString();
  callback();
};

module.exports = combineTarget;
