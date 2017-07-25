require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';

import ImageFigure from './ImageFigure'

const imageDatas = require('../data/imgDatas.json');

//let yeomanImage = require('../images/yeoman.png');
//let imageDataArr = [];


(function getImageURL(imageDatas){
    imageDatas.map((item)=>{
        //imageDataArr[key] = 
        item.imageURL = require('../image/'+item.fileName);
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
  
  //组件家在以后 为每张图片计算其位置的范围
  componentDidMount(){
    //console.log('componentDidMount...');
    //获取舞台大小
    let stageDOM = this.stage, //React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH /2 );
    //console.log(stageDOM);

    //获取imageFigure大小
    //let imgDOM = ReactDOM.findDOMNode(this.ref.img1);
    //console.log(imgDOM);
  }
 
  render() {
    let imageFigures = [];
    

    const pos = {
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
    let imgNodes = [];
    imageDatas.forEach(function(value,index){
        const imageProps={
          imageURL: value.imageURL,
          title: value.title,
          fileName: value.fileName
        }
        //let refName = 'img'+index;
        imageFigures.push(<ImageFigure {...imageProps} />);
          
     });
     console.log(imgNodes[0]);
    
    return (
      /*<div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />Hello
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>*/
      <section className="stage" ref = {(section) => { this.stage = section; }}>  
        <section className="img-sec">
          {imageFigures}
          
          {/*{
            imageDatas.map((item,key) =>{
              let props = {
                imageURL: item.imageURL,
                title: item.title,
                fileName: item.fileName
              },
              <ImageFigure {...props} imgRef = {el => this.imgElement = el}/>
            })
          }*/}

        </section>

        <section className="ctrl-nav">
          ctrl-nav
        </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
