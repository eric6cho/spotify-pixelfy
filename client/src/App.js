import React, { useState, useEffect, useRef } from "react";
import Sample from "./components/comp-sample";
import * as u from './scripts/utils'; 
import './styles/main.scss';

export default function App() {
  
  // define states
  const [testState,setTestState] = useState(null);

  // define useEffect
  useEffect(() => {
    setTestState(true);

    u.fetchGet('/api/test').then(data=>{
      console.log(data);
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //define functions
  const testFunction = () => {};

  //define component
  const getComponent = () => {
    // null check
    if(!testState) return;
   
    let content = 
      <div className="content">
        <h1>App Title (h1)</h1>
        <h2>Section Title (h2)</h2>
        <h3>Subsection Title (h3)</h3>
        <h4>Section/Subsection Subtitle (h4)</h4>
        <p>paragraph (p)</p>
        <span>span (span)</span>
        <a>anchor (a)</a>
      </div>;

    let sampleComponent = 
      <Sample title='Sample Component Title'/>;

    return (
      <div className="App">
        {content}
        {sampleComponent}
      </div>
    );
  };

  return getComponent();
}