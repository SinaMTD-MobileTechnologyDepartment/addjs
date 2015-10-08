/**
 * @author xiaojue[designsor@gmail.com]
 * @fileover lib index
 */
var combine = require('./lib/combine');
var server = require('./lib/server');
var config = require('./lib/config');
var consoleStamp = require("console-stamp");
var os = require('os');

function convertMB(bytes) {
  return parseInt(bytes / 1024 / 1024, 10);
}

consoleStamp(console, {
  metadata: function() {
    return ("[" + convertMB(process.memoryUsage().heapUsed) + "/" + convertMB(os.totalmem()) + " MB]");
  },
  colors: {
    stamp: "yellow",
    label: "white",
    metadata: "green"
  }
});

module.exports = {
  combine: combine,
  server: server,
  config: config
};
