# addjs
just combine js/css.

support svn file and remote file.

support transform ES6 and scss to ES6 and css file.

support source map debug ES6 source code.

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
$ addjs build source.js -o target.min.js
$ addjs build source.css -o target.min.css
$ addjs build source.js -b beautify.js
```

```bash
$ addjs server ./ --port 7575 //debug and real time combine like : http://127.0.0.1:7575/combine?filename=/path/source.js
```
