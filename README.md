# addJS
just combine js/css, support svn file and remote file

----

#usage

```bash
$ npm install -g addJS
```

```js
//addJS source file
require('./a.css');

require('./a.js');
require('svn:http://xxx.com.cn/b/trunk/b.js');
require('http://cdn.xx.com/c.js');
```

```html
<!-- <link href="target.min.css" rel="stylesheet"> -->
<script src="addJS.js" data-conf="dist/target.min.js" data-config="dist/target.config.js"></script>
<!-- you can debug the source.js real time when the url has debug flag : http://demo.com/demo.html?debug=/source.js -->
```

```bash
$ addJS server . //debug and real time combine like : http://127.0.0.1:7575/combine?file=/source.js
```

```bash
$ addJS build source.js ./dist --prename target --version 0.0.1
//output the css and js in target directory
$ cd dist && ls
$ target.min.js target.min.css target.config.js
```
