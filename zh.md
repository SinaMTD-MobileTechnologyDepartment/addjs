# addjs

只做管理和合并js和css文件

支持加载svn地址文件和远程文件

支持编译转换ES6和scss格式文件

支持生成压缩后ES6源码调试的sourceMap

英文文档: [English Documentation][1]

  [1]: ./README.md

----

#用法

```bash
$ npm install -g addjs
```

```css
//css源码
@import('./a.css');
@import('svn:https://xxx.com.cn/b/trunk/b.css');
@import('http://cnd.xx.com/c.css');
```

```js
//js源码
@require('./a.js');
@require('svn:https://xxx.com.cn/b/trunk/b.js');
@require('http://cdn.xx.com/c.js');
```

```html
//前端加载代码,config-cache 配置文件更新时间戳频率，分钟为单位
<head>
  <script src="addjs.js" data-config="config.js" data-config-cache="10"></script>
  <script>addjs.css('http://cdn.x.cn/addjs/index.css')</script>
</head>
<body>
  <script>addjs.js('http://cdn.x.cn/addjs/index.js')</script>
</body>
```

```js
//config.js配置文件参数version为必填，debugMap为debugServer使用，对线上资源进行本地debug server的转发
addjs.setConfig({
  debugServer:'http:127.0.0.1:7575/',
  debugMap:{
    'http://cdn.x.cn/addjs/index.css':'./css/index.css',
    'http://cdn.x.cn/addjs/index.js':'./js/index.js'
  }
  version:'0.0.1'
});
```

```bash
//命令行详解
$ addjs --help

  Usage: addjs [command] <args...> [options]


  Commands:

    build <source>  build source js or css //合并压缩css，js
    server <path>   start the debug server current directory //根据path启动debug sever
    svn             set default svninfo with --username,--pwd //设置svn用户信息
    info            show default svninfo //查看svn用户信息

  Options:

    -h, --help              output usage information //帮助
    -V, --version           output the version number //版本
    -c, --config <file>     default config will be install user directory in ~.addjs/config.json //指定配置文件执行命令,默认配置文件在user目录下
    -p, --port <port>       server will be listen port //指定debug server 端口
    -o, --output <file>     output fule //压缩输出文件地址
    -b, --beautify <file>   beautify output/specify output options //美化输出地址
    -e, --es6               transform es6 to es5 js source //开启es6转es5
    -s, --sass              transform sass to css source //开启sass转css
    --username <username>   set default svn username //设置svn用户名
    --pwd <password>        set default svn password //设置svn密码
    --command <svncommand>  set default svn command new name //设置svn命令别名

```

```bash
//打包压缩事例
$ addjs build source.js -o target.min.js
$ addjs build source.css -o target.min.css
$ addjs build source.js -b beautify.js
```

```bash
//启动./为debug server目录,默认7575端口
$ addjs server ./ --port 7575 //debug and real time combine like : http://127.0.0.1:7575/combine?filename=/path/source.js
```

如果debug模式要开启sass或者es6模式，需要在url中增加es6=1或者sass=1这2个flag
