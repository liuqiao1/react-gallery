require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';

import ImageFigure from './ImageFigure'
import ControllerUnit from './ControllerUnit'

const imageDatas = require('../data/imgDatas.json');

//let yeomanImage = require('../images/yeoman.png');
//let imageDataArr = [];
let imageNodes = [];
//let pilo;


(function getImageURL(imageDatas){
    imageDatas.map((item)=>{
        //imageDataArr[key] = 
        item.imageURL = require('../images/'+item.fileName);
    });

    //return imageDataArr;
    //打印出来的路径/assets/01aff2240004563d8797f773c30c1ece.jpg  已经被webpack处理过了
    //console.log(imageDataArr)
})(imageDatas)

//console.log(imageDatas);

// function genImageFigures(){
//   imageDataArr.map((item,key) => {
//         const imageProps={
//           imageURL:item,
//           title:'test'
//         }
//        imageFigures.push(<ImageFigure {...imageProps} />);
//   });
// }



class AppComponent extends React.Component {
  constructor(props){
    super(props);
    let self = this;

    this.state = {
      imgsArrangeArr:[
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   },
        //   isInverse: false
        // }
      ]
    }
    this.Constant = {
      centerPos:{
        left: 0,
        right: 0
      },
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    }

    this.inverse = (index) => {
      return (() => {
        let imgsArrangeArr = self.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        })
      })
    }

    this.rearrange = (centerImgIndex) => {
      return (() => {
        let imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = self.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          //vPosRangeTopX = vPosRange.topX,
          vPosRangeX = vPosRange.x,

          //布局在舞台上侧的图片信息   Math.random()返回0.0 ~ 1.0 之间的一个伪随机数
          imgsArrangeTopArr = [],
          topImgNum = Math.floor (Math.random() * 2),//取值区间0或1
          topImgSpliceIndex = 0,//标记 从哪个位置来取
          
          //布局在舞台中间的图片信息
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerImgIndex,1);

          //居中centerIndex的图片
          imgsArrangeCenterArr = [
            {
              pos: centerPos,
              rotate: 0,
              isCenter: true
            }
          ]
          //imgsArrangeCenterArr[0].pos = centerPos;
          //imgsArrangeCenterArr[0].rotate = 0;
          //imgsArrangeCenterArr[0].isCenter =  true;

          //debugger;
          //取出要布局上侧图片的状态信息
          topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));//从索引位置往后取出
          imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

          // 布局位于上侧的图片
          imgsArrangeTopArr.forEach(function (value,index){
            //这种方法覆盖了初始化内容
            imgsArrangeTopArr[index] = {
              pos:{
                top: getRangeRandom(vPosRangeTopY[0] , vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
              rotate:get30DegRandom(),
              isCenter: false
            }
           
          });

          //布局左右两侧的图片
          for(let i=0, j=imgsArrangeArr.length, k = j / 2 ; i < j; i++){
             let hPosRangeLORX = null;

             if( i < k ){
               hPosRangeLORX = hPosRangeLeftSecX;
             }else{
               hPosRangeLORX = hPosRangeRightSecX;
             }

             imgsArrangeArr[i] = {
               pos : {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
               },
               rotate:get30DegRandom(),
               isCenter:false
             }
          }

          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
          }

          imgsArrangeArr.splice(centerImgIndex, 0, imgsArrangeCenterArr[0]);

          console.log(imgsArrangeArr);

          this.setState({
            imgsArrangeArr: imgsArrangeArr
          })

          function getRangeRandom(low,high){
            return Math.ceil(Math.random() * (high-low) + low);
          }

          function get30DegRandom(){
            return (Math.random() > 0.5? '':'-') + Math.ceil(Math.random() * 30);
          }
      })  
    }

    //this.control = (index) => {
      //return () => {
        //把制定图片居中
        //this.rearrange(index)();
        //把当前unit 加上class: is-inverse is-center

        //把之前居中的去掉
      //}
    //}
  }

  // test(){
  //     console.log(test);
  // }
  //组件加载以后 为每张图片计算其位置的范围
  componentDidMount(){
    //console.log('componentDidMount...');
    //获取舞台大小
    let self = this;
    let stageDOM = this.stage, //React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH /2 );
    //console.log(stageDOM);
    //console.log(this.state.imgsArrangeArr);

    //获取imageFigure大小
    let imgDOM = imageNodes[0];//pilo;//this.imgNode;//ReactDOM.findDOMNode(this.ref.img1);
    //console.log(imgDOM);
    let imgW = imgDOM.scrollWidth,
        imgH = imgDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos ={
      left:halfStageW - halfImgW,
      top:halfStageH-halfImgH
    }

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH-halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(8)();

  }

  
 
  render() {
    let imageFigures = [];
    let controlUnits = [];
    // const imgProps = {
    //   imageURL:'../image/1.jpg',
    //   title:'text',
    //   fileName:'1.jpg'
    // }
  
    //let imgsArrangeArr = this.state.imgsArrangeArr;
    imageDatas.forEach(function(value,index){
        //console.log(this.state.imgsArrangeArr);
        if(! this.state.imgsArrangeArr[index]){
          
          this.state.imgsArrangeArr[index] = {
            pos:{
              left: 0,
              top: 0
            },
            rotate: 0,
            isInverse: false,
            isCenter: false
            //reverse: this.inverse(index),
          }

          console.log('init imgFigure'+index+'...'+this.state.imgsArrangeArr[index]);
        }
        const imageProps={
          imageURL: value.imageURL,
          title: value.title,
          //fileName: value.fileName
          arrange: this.state.imgsArrangeArr[index]
        }
        //let refName = 'img'+index;
        //imageFigures.push(<ImageFigure {...imageProps} />);
        imageFigures.push(imageProps);  
        controlUnits.push(<ControllerUnit key = {index} reverse = {this.inverse(index)} rearrange = {this.rearrange(index)} arrange = {this.state.imgsArrangeArr[index]}/>) 
     }.bind(this));
     //console.log(imageFigures);
    
    return (
      /*<div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />Hello
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>*/
      /**
       * React 支持给任意组件添加特殊属性。ref 属性接受一个回调函数，它在组件被加载或卸载时会立即执行。

         当给 HTML 元素添加 ref 属性时，ref 回调接收了底层的 DOM 元素作为参数。例如，下面的代码使用 ref 回调来存储 DOM 节点的引用。
       */
      <section className="stage" ref = {(section) => { this.stage = section; }}>  
        <section className="img-sec">
          {/*{imageFigures}*/}
          {imageFigures.map((item,key) => 
              /**
              你不能在函数式组件上使用 ref 属性，因为它们没有实例
              对父组件暴露 DOM 节点:建议在子节点上暴露一个特殊的属性。
              子节点将会获得一个函数属性，并将其作为 ref 属性附加到 DOM 节点。
              这允许父代通过中间件将 ref 回调给子代的 DOM 节点

              <ImageFigure>用 {} 包着就无法渲染？为什么？
               */
              <ImageFigure {...item} key = {key} rearrange = {this.rearrange(key)}  reverse = {this.inverse(key)} imgRef = { (node) => (imageNodes[key] = node)} />
              
          )}
          
        </section>

        <section className="ctrl-nav">
          {/*<ControllerUnit />*/}
          {controlUnits}
        </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
