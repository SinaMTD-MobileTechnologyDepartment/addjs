# addjs
just combine js/css.

support svn file and remote file.

support transform ES6 and scss file.

support source map debug ES6 source code.

chinese documentation: [中文文档][1]

  [1]: ./zh.md

----

#usage

```bash
$ npm install -g addjs
```

```css
@import('./a.css');
@import('svn:https://xxx.com.cn/b/trunk/b.css');
@import('http://cnd.xx.com/c.css');
```

```js
//addJS source file
@require('./a.js');
@require('svn:https://xxx.com.cn/b/trunk/b.js');
@require('http://cdn.xx.com/c.js');
```

```html
<head>
  <script src="addjs.js" data-config="config.js" data-config-cache="10"></script>
  <script>addjs.css('http://cdn.x.cn/addjs/index.css')</script>
</head>
<body>
  <script>addjs.js('http://cdn.x.cn/addjs/index.js')</script>
</body>
```

```js
//config.js
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
$ addjs --help

  Usage: addjs [command] <args...> [options]


  Commands:

    build <source>  build source js or css
    server <path>   start the debug server current directory
    svn             set default svninfo with --username,--pwd
    info            show default svninfo

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -c, --config <file>     default config will be install user directory in ~.addjs/config.json
    -p, --port <port>       server will be listen port
    -o, --output <file>     output fule
    -b, --beautify <file>   beautify output/specify output options
    -e, --es6               transform es6 to es5 js source
    -s, --sass              transform sass to css source
    --username <username>   set default svn username
    --pwd <password>        set default svn password
    --command <svncommand>  set default svn command new name

```

```bash
$ addjs build source.js -o target.min.js
$ addjs build source.css -o target.min.css
$ addjs build source.js -b beautify.js
```

```bash
$ addjs server ./ --port 7575 //debug and real time combine like : http://127.0.0.1:7575/combine?filename=/path/source.js
```

the combine url flag option default is false, if you want combine es6 or sass file combine real time, set the options true.
