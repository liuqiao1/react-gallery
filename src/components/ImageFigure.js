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
  const {imageURL, title, fileName} = props;

  return (
    <figure className = 'img-figure' ref={props.imgRef}>
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