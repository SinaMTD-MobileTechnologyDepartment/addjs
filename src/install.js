var fs = require('fs-extra');
var path = require('path');
var configTemp = path.resolve(__dirname,'./config.temp.json');
var LOCALPATH = process.env.HOME || process.env.USERPROFILE;
var addjsConfig = path.join(LOCALPATH, '.addjs/config.json');

if(!fs.existsSync(addjsConfig)){
  fs.copySync(configTemp,addjsConfig);
}
