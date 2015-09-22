/**
 * @author xiaojue[designsor@gmail.com]
 * @fileoverview config management
 */
var path = require('path');
var jsonfile = require('jsonfile');
var LOCALPATH = process.env.HOME || process.env.USERPROFILE;
var addjsConfig = path.join(LOCALPATH, '.addjs/config.json');

module.exports = {
  setSvn: function(username,pwd,command) {
    var config =jsonfile.readFileSync(addjsConfig);
    config.svninfo = config.svninfo || {};
    config.svninfo.username = username;
    config.svninfo.password = pwd;
    config.svninfo.command = command || 'svn';
    jsonfile.writeFileSync(addjsConfig,config);
    this.info();
  },
  info: function() {
    console.dir(jsonfile.readFileSync(addjsConfig));
  }
};
