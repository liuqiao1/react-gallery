# react-gallery
react画廊    [演示地址](https://liuqiao1.github.io/react-gallery/)

这个小应用是我基于 [慕课网materliu老师:React实战--打造画廊应用](http://www.imooc.com/learn/507) 改写的。<br/>
老师制作完视频之后，项目中用到的 React，yoman, Webpack 等工具又有了许多新变化，导致老师视频中讲的内容和现在的代码有些对应不上。
但是核心思想还是没有变的，所以我在老师的基础上结合新特性做了一些修改。
****
### Author: 刘巧
### E-mail: liuqiao@csu.edu.cn
****
[TOC]

## 目录
* [使用Yeoman快速创建新项目](#使用Yeoman快速创建新项目)
* [npm run serve 干了什么？](#npmrunserve干了什么)
* [gulp,grunt怎么不见了](#gulp和grunt怎么不见了)
* [使用less](#使用less)    
* [创建React组件的三种方式](#创建React组件的三种方式)
* [函数式定义的无状态组件 怎么写](#函数式定义的无状态组件 怎么写)
* [es6形式的extends React.Component定义的组件 怎么写](#es6形式定义的组件怎么写)
* [如何获取DOM](#如何获取dom)
* [如何传递 （handler）事件处理函数 给函数式组件](#如何传递事件处理函数给函数式组件)
* [关于github pages](#关于githubpages)
* [还没有解决的问题](#还没有解决的问题)
* [一点废话](#一点废话)



## 使用Yeoman快速创建新项目
[Yeoman 中文网](http://www.yowebapp.com/)
    
```Bash
npm install -g yo
npm install -g generator-webapp
yo react-webpack
npm install
npm run serve
```
## npmrunserve干了什么
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
## gulp和grunt怎么不见了
项目构建的方式改动很大，去掉了gulp,grunt, 使用webpack包办了这些任务。<br/>
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
昨天不知怎么地手贱把assets前面的斜杠去掉了，这下404真的出现了。<br/>
冥思苦想许久，还是用git reset 对比文件修改处才发现端倪。
`对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。相对 URL(relative URL) 会被相对于 HTML 页面（或 <base> 标签）解析。相对于服务的 URL(Server-relative URL)，相对于协议的 URL(protocol-relative URL) 或绝对 URL(absolute URL) 也可是可能用到的，或者有时必须用到，例如：当将资源托管到 CDN 时。

该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀。因此，在多数情况下，此选项的值都会以/结束。`

## 使用less
  务必先安装less: npm install less
  新版的 cfg/defaults.js 已经把 less,scss 的loader都考虑进去了。
  

## 创建React组件的三种方式
视频中用的方法是createClass,现在已经不推荐使用了。<br/>
可以看到，yeoman生成的代码中使用的是 es6 方式，extends React.Component.<br/>
我找到一个特别好的博客来介绍这三种方式以及他们的异同：[React创建组件的三种方式及其区别](http://www.cnblogs.com/wonyun/p/5930333.html)<br/>

使用原则是：能使用函数定义式实现，尽量用纯函数；如果涉及state尽量用继承方式，除非万不得已不要用createClass方式。

## 函数式定义的无状态组件怎么写
视频中把展示图片的imageFigure, 控制单元controlUnit 都写在了一个文件里面。<br/>
我觉得这样不太合适。万一以后别的页面也要用这两个组件呢？<br/>
所以我把这两个组件拆分出来，用函数定义式方式实现。<br/>

以imageFigure为例吧。
```//javascript
require('./ImageFigure.less');

//如果不引入React：Uncaught ReferenceError: React is not defined
import React from 'react'

const ImageFigure = ({...props}) => {
  const {imageURL, title, arrange, reverse, rearrange} = props;
  let styleObj = {};

  let imgFigureClassName = 'img-figure';//arrange.isInverse? 'img-back' : 'img-figure';
      imgFigureClassName += arrange.isInverse? ' img-back' : ' '; 

  if(arrange.pos){
      styleObj  = arrange.pos;
  }
  if(arrange.rotate){
      //内联样式用驼峰法命名
      (['MozTransform', 'MsTransform', 'WebkitTransform', '']).forEach((value)=>{
          styleObj[value] = 'rotate('+arrange.rotate+'deg)';
      }) 
  }

  function handleClick(e){
      //console.log(arrange.isInverse? 'inverse':'not inverse');
      
      if(arrange.isCenter){
          //点击中间的图片
          reverse();
      }else{
          rearrange();
      }
  }
  return (
    <figure className = {imgFigureClassName} ref={props.imgRef} style = {styleObj} onClick = {handleClick}>
        <img src={imageURL} alt={title}/>
        <figcaption>
            <h2>{title}</h2>
        </figcaption>
    </figure>
  );
}

export default ImageFigure
//import时如果写 import {ImageFigure}就错了
//加了default 默认引入  import 随便名字 from ''
```
```//css
.img-figure{
    position: absolute;

    width: 300px;
    height: 340px;
    //overflow: hidden;
    margin: 0;
    padding:20px;

    background-color: #fff;
    box-sizing: border-box;

    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform .6s ease-in-out, left .6s ease-in-out,top .6s ease-in-out;

    img{
        width: 100%;
        height: 90%;
    }
    
    figcaption{
        text-align: center;

        h2{
            margin: 20px 0 0 0;
            color: #a7a0a2;
            font-size: 16px;
        }
    }

    &.img-back{
        //background-color: red;
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg); /* Safari 与 Chrome */
    }

    
}

## es6形式定义的组件怎么写
先贴一段官网的格式：

```//javascript
class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```
相比craeteClass方式，很明显的不同点是初始化state放在了构造函数里，如果函数内部要用this 必须要bind.另外生命周期方法也不是用***：来写了，具体细节还是查文档吧。

## 如何获取dom
视频中用的方法是：
```//javascript
<div ref={'imgSec'}></div>
```
很遗憾，这种方式现在已经被抛弃了。查看文档[Refs and the DOM](https://facebook.github.io/react/docs/refs-and-the-dom.html)

```//javascript
 //react 将底层node传给section
 <section className="stage" ref = {(section) => { this.stage = section; }}>  
```
如果要获取函数定义式组件里的DOM呢？<br/>

```//javascript
//当作一个普通prop传回调
<ImageFigure imgRef = { (node) => (imageNodes[key] = node)} />
//组件接收
<figure ref={props.imgRef}></figure>
```

## 如何传递事件处理函数给函数式组件
上面说到我将ImageFigure组件拆分出来用函数定义式实现，那么当点击图片时的事件处理函数该如何处理呢？<br/>
因为点击图片之后需要触发setState修改状态，所以事件处理不可能在ImageFigure里写，这样做也有悖于函数定义式组件的设计原则。<br/>
既然这样，只能选择由父组件通过props传入。

```//javascript
 <ImageFigure  rearrange = {this.rearrange(key)}  reverse = {this.inverse(key)} />
 
 this.inverse = (index) => {
      return (() => {
        let imgsArrangeArr = self.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        })
      })
    }
```
  一定要注意！！！inverse()返回的是一个待执行函数！ 如果写成：
```//javascript
this.inverse = (index) => {  
        let imgsArrangeArr = self.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        })
    }
```
这样程序会进入死循环。原因是执行 <ImageFigure reverse = {this.inverse(key)} />遇到inverse直接执行了inverse里的setState代码, 而setState恰好又触发render,这样循环往复肯定会挂~

## 关于githubpages
```
npm run dist *打包到输出目录 这相当于要部署的内容*
git subtree push --prefix=dist origin gh-pages *gh-pages是github默认分支，名字不能随便乱改*
```
登陆github账户就会发现多了一个gh-pages分支，该分支下就是dist目录下的内容（为啥多了个stati文件夹？）

## 还没有解决的问题
* 图片翻转的时候出现图片说明如何实现？
* react渲染过程是怎样的？浏览器里面都发生了什么？
* 当我关闭编辑器，页面依然可以点，翻转，切换都有效，是浏览器缓存起来了吗？ 缓存了什么？什么时候缓存的？

## 一点废话
小白的探索之路真是遍布荆棘啊~ 感叹自己水平还太渣了，代码还有很多需要改进的地方，这里权当记录吧。<br/>
* 关键时刻，官方文档才是亲妈！
* 遇到问题就解决问题，以我现在的水平，遇到的问题都能搜到~
* 不要中途放弃，动手做起来，才会有效。
* 手残不要紧，还有git这个好工具，感谢git, git大法好！
