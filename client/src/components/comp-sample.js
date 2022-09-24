import React, { useState, useEffect } from "react";
import './../styles/comp-sample.scss';
import * as u from './../scripts/utils'; 

export default function Sample(props) {

  // define constants
  const defaultClass = 'sample ';
  
  // define states
  const [componentClass, setComponentClass] = useState(defaultClass);

  // define useEffect
  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  // define functions
  const sampleFunction = () => {
    const val = 'sample component content';
    return val;
  };
 
  // define component
  const getComponent = () => {

    //define null checks
    if(!componentClass) return;

    let title = 
      <h2>{props.title}</h2>;

    let content = 
      <p>{sampleFunction()}</p>;

    let component = 
      <div className={componentClass}>
        {title}
        {content}
      </div>;

    return component;
  }

  return getComponent();
}