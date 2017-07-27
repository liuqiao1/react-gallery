//import {React} from React;
import React from 'react'

require('./ControllerUnit.less')

const ControllerUnit = (props) => {
    const {arrange} = props;
    let className = 'controller-unit';
    arrange.isCenter? className+=' is-center':className+='';
    arrange.isInverse? className+=' is-inverse':className+='';
    function handelClick(e){
        console.log('handleClick...');
        //把制定图片居中
        //把当前unit 加上class: is-inverse is-center
        //把之前居中的去掉
        //props.control();
        
        if(arrange.isCenter){
            //翻转
            props.reverse();
        }else{
            //重排
            props.rearrange();
        }
       
    }
    return(
        <span className = {className} onClick = {handelClick}></span>
    )
}

export default ControllerUnit