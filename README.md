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
真正的配置内容没有写在src/webpack.config.js, 这个文件的作用仅仅是根据env参数来加载对应的配置。
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
  let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
  let validEnv = isValid ? wantedEnv : 'dev';
  let config = require(path.join(__dirname, 'cfg/' + validEnv));
  return config;
}

module.exports = buildConfig(env);

```
真正的配置文件在cfg目录下。



这是一个大标题
====

中标题
----

# 一级标题   中间要加空格哦~
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

这是普通文本，换行要用'\<br>'  <br/> 换行了

    使用两个Tab符实现单行文本。

多行文本和单行文本异曲同工，只要在每行行首加两个Tab

    亲爱的蛋儿：
    你好吗？
    屎吃完了吗？

如果你想使一段话中部分文字高亮显示，来起到突出强调的作用，那么可以把它用 `  ` 包围起来。<br/>
注意这不是单引号，而是Tab上方，数字1左边的按键（注意使用英文输入法）。

 `我是高亮，姓高名亮`  我不是高亮
 
 文字超链接

给一段文字加入超链接的格式是这样的 [ 要显示的文字 ]( 链接的地址 )。比如：
[百度]（www.baidu.com "百度的链接"）

li效果
* 昵称：果冻虾仁
* 别名：隔壁老王
* 英文名：Jelly

带层级
* 编程语言
    * 脚本语言
        * Python
        
树结构
>数据结构
>>树
>>>二叉树
>>>>平衡二叉树
>>>>>满二叉树

图片
![baidu](http://www.baidu.com/img/bdlogo.gif "百度logo")

如果是自己的仓库里的图片：
https://github.com / 你的用户名 / 你的项目名 / raw / 分支名 / 存放图片的文件夹 / 该文件夹下的图片

插入代码片段

我们需要在代码的上一行和下一行用` `` 标记。``` 不是三个单引号，而是数字1左边，Tab键上面的键。要实现语法高亮那么只要在 ``` 之后加上你的编程语言即可（忽略大小写）。c++语言可以写成c++也可以是cpp。

```javascript
let info = 'ok';
console.log(info);
```
