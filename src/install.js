var fs = require('fs');
var path = require('path');
var configTemp = path.resolve(__dirname,'./config.temp.json');
var LOCALPATH = process.env.HOME || process.env.USERPROFILE;
var addjsConfig = path.join(LOCALPATH, '.addjs/config.json');

if(!fs.existsSync(addjsConfig)){
  var dirname = path.dirname(addjsConfig);
  if(!fs.existsSync(dirname)){
    fs.mkdirSync(dirname); 
  }
  fs.writeFileSync(addjsConfig,fs.readFileSync(configTemp));
}
