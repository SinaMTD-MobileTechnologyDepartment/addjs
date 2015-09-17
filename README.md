# addjs
just combine js/css, support svn file and remote file

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
require('./a.js');
require('svn:https://xxx.com.cn/b/trunk/b.js');
require('http://cdn.xx.com/c.js');
```

```html
<script src="addjs.js" data-config="config.js" data-config-cache="10"></script>
<script>addjs.css('http://cdn.x.cn/addjs/index.css')</script>
<script>addjs.js('http://cdn.x.cn/addjs/index.js')</script>
<!-- 
url can add debug flag to add combine source file.
http://demo/path/?debug
-->
```

```js
//config.js
addjs.config({
  debugServer:'http:127.0.0.1:7575/',
  debugMap:{
    'http://cdn.x.cn/addjs/index.css':'./css/index.css',
    'http://cdn.x.cn/addjs/index.js':'./js/index.js'
  }
  version:'0.0.1'
});
```

```bash
$ addjs build source.js -o target.js
$ addjs build source.css -o target.css
```

```bash
$ addjs server --port 7575 //debug and real time combine like : http://127.0.0.1:7575/addjs?file=/path/source.js
```
