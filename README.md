# react-gallery
react画廊    [演示地址](https://liuqiao1.github.io/react-gallery/)

这个小应用是我基于 [慕课网materliu老师:React实战--打造画廊应用](http://www.imooc.com/learn/507) 改写的。<br/>
老师制作完视频之后，项目中用到的 React，yoman, Webpack 等工具又有了许多新变化，导致老师视频中讲的内容和现在的代码有些对应不上。
但是核心思想还是没有变的，所以我在老师的基础上结合新特性做了一些修改。
****
### Author: 刘巧
### E-mail: liuqiao@csu.edu.cn
****

## 使用Yeoman快速创建新项目
[Yeoman 中文网](http://www.yowebapp.com/)

    
```Bash
npm install -g yo
npm install -g generator-webapp
yo react-webpack
npm install
npm run serve
```
## npm run serve 干了什么？
查看 `src/package.json`, 
```
"serve": "node server.js --env=dev",
```
运行server.js文件，传入参数env = dev.<br/>
server.js 又干了什么呢?<br/>
简单来说，就是 根据传入参数加载对应的webpack配置文件,加载wepack-dev-server, 获取compiler， 开启监听，捕获错误，打印状态信息。

```javascript
/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

/**
 * webpack provides a Node.js API which can be used directly in Node.js runtime.
 * The Node.js API is useful in scenarios in which you need to customize the build or development process since all the reporting and error handling must be done manually and webpack only does the compiling part. 
 * For this reason the stats configuration options will not have any effect in the webpack() call.
 */

/**
 * Flag indicating whether webpack compiled for the first time.
 * @type {boolean}
 */
let isInitialCompilation = true;

/**
 * The imported webpack function is fed a webpack Configuration Object
 *  and runs the webpack compiler if a callback function is provided:
 * https://webpack.js.org/api/node/
 * 
 * compiler对象包涵了Webpack环境所有的的配置信息，
 * 这个对象在Webpack启动时候被构建，并
 * 配置上所有的设置选项包括 options，loaders，plugins。
 */
const compiler = webpack(config);

/**
 * devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false
  },
 */

new WebpackDevServer(compiler, config.devServer)
.listen(config.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
});

/**
 * 自定义插件 https://webpack.js.org/development/how-to-write-a-plugin/
 * 
 * 在 webpack 中你经常可以看到 compilation.plugin(‘xxx’, callback) ，
 * 你可以把它当作是一个事件的绑定，这些事件在打包时由 webpack 来触发。
 * 
 * done: Specifies webpack's event hook to attach itself.
 * 打包完成后执行回调函数
 */
compiler.plugin('done', () => {
  if (isInitialCompilation) {
    // Ensures that we log after webpack printed its stats (is there a better way?)
    setTimeout(() => {
      console.log('\n✓ The bundle is now ready for serving!\n');
      console.log('  Open in iframe mode:\t\x1b[33m%s\x1b[0m',  'http://localhost:' + config.port + '/webpack-dev-server/');
      console.log('  Open in inline mode:\t\x1b[33m%s\x1b[0m', 'http://localhost:' + config.port + '/\n');
      console.log('  \x1b[33mHMR is active\x1b[0m. The bundle will automatically rebuild and live-update on changes.')
    }, 350);
  }
  isInitialCompilation = false;
});

```
## 项目构建的方式改动很大，去掉了gulp,grunt, 使用webpack包办了这些任务。
真正的配置内容没有写在src/webpack.config.js, 这个文件的作用仅仅是根据env参数来加载对应的配置。<br/>

```//javascript
'use strict';

const path = require('path');
/**
 * minimist轻量级的命令行参数解析引擎 http://www.jianshu.com/p/231b931ab389
 * process对象是 Node 的一个全局对象，提供当前 Node 进程的信息。
 * 它可以在脚本的任意位置使用，不必通过require命令加载。该对象部署了EventEmitter接口。
 * process.argv：返回一个数组，成员是当前进程的所有命令行参数
 * slice() 方法可从已有的数组中返回选定的元素。
 */
const args = require('minimist')(process.argv.slice(2));


/**
 * [ 'D:\\nodeJS\\node.exe',
  'F:\\FrontEnd\\react-gallery\\server.js',
  '--env=dev' ]
 */
console.log('args:'+args);


// List of allowed environments
const allowedEnvs = ['dev', 'dist', 'test'];

// Set the correct environment
let env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
  env = 'test';
} else if (args.env) {
  env = args.env;
} else {
  env = 'dev';
}
process.env.REACT_WEBPACK_ENV = env;

/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
function buildConfig(wantedEnv) {
 
  let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;// 参数校验

  let validEnv = isValid ? wantedEnv : 'dev';//  默认dev环境
  let config = require(path.join(__dirname, 'cfg/' + validEnv));
  return config;
}

module.exports = buildConfig(env);

```

真正的配置文件在cfg目录下。
比如，如果我们运行nom run serve,那么与之匹配的试env=dev.<br/>
来看看 cfg/dev.js.<br/>
一打开就可以发现，这不对呀，怎么可能这么简单呢，loaders也没有，不着急，看看
```//javascript
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
```
原来yeoman把不同环境下的公共配置提取到了这两个文件中。
关于[webpack 的配置项]('https://doc.webpack-china.org/configuration/')，我只想说一说output.publicPath.

在src/index.html中有一句：
```//javascript
<script type="text/javascript" src="/assets/app.js"></script>
```
乍一看会很纳闷，src下根本就没有assets文件夹，这样可是会报404的，但事实是程序跑得好好的，就是因为配置了这个publicPath.
```
 publicPath: '/assets/'
```
昨天不知怎么地手贱把assets前面的斜杠去掉了，这下404真的出现了。
冥思苦想许久，还是用git reset 对比文件修改处才发现端倪。
`对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。相对 URL(relative URL) 会被相对于 HTML 页面（或 <base> 标签）解析。相对于服务的 URL(Server-relative URL)，相对于协议的 URL(protocol-relative URL) 或绝对 URL(absolute URL) 也可是可能用到的，或者有时必须用到，例如：当将资源托管到 CDN 时。

该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀。因此，在多数情况下，此选项的值都会以/结束。`

## 使用less
  务必先安装less: npm install less
  新版的 cfg/defaults.js 已经把 less,scss 的loader都考虑进去了。
  

## 创建React组件的三种方式

