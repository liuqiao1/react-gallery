require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
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
 
  render() {
    let imageFigures = [];

    imageDatas.forEach(function(value){
        const imageProps={
          imageURL:value.imageURL,
          title:value.title
        }
        imageFigures.push(<ImageFigure {...imageProps}/>);
    });

    return (
      /*<div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />Hello
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>*/
      <section className="stage">  
        <section className="img-sec">
          {imageFigures}
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
