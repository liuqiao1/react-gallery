/*class ImageFigure extends React.Component {
  render() {
    return (
        <figure>
            <img src="" alt={}/>
        </figure>
    )
  }
}*/
require('./ImageFigure.less');

//如果不引入React：Uncaught ReferenceError: React is not defined
import React from 'react'
//import styles from './ImageFigure.less'

const ImageFigure = ({...props}) => {
  const {imageURL, title, arrange, reverse} = props;
  let styleObj = {};

  let imgFigureClassName = 'img-figure';//arrange.isInverse? 'img-back' : 'img-figure';
      imgFigureClassName += arrange.isInverse? ' img-back' : ' '; 

  if(arrange.pos){
      styleObj  = arrange.pos;
  }
  if(arrange.rotate){
      (['-moz-', '-ms-', '-webkit-', '']).forEach((value)=>{
          styleObj[value+'transform'] = 'rotate('+arrange.rotate+'deg)';
      }) 
  }

  function handleClick(e){
      console.log(arrange.isInverse? 'inverse':'not inverse');
      reverse();
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