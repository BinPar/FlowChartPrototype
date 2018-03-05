import React from 'react';

const getMaxDepth = ({child, options}) => {
  let max = 0;
  if (options) {
    options.forEach(option => {
      let newMax = getMaxDepth(option);
      if(newMax > max) {
        max = newMax;
      }
    });
  }
  if (child) {
    max += 1;
    max += getMaxDepth(child);
  }
  return max;
};

const getOptionsLines = (options) => {
  return options.map((option,i) => (
    <g key={option.text}>
      <path key="startPath" strokeWidth={1} stroke={option.active ? "#4a90e2" : "#e2e2e2"} d={`m 0 85 h ${(i + 0.5 - options.length / 2) * 210}`} />
      <path key="path" fill={ option.active ? "#4a90e2" : "#e2e2e2"} strokeWidth={1} stroke={ option.active ? "#4a90e2" : "#e2e2e2"} d={`m ${(i + 0.5 - options.length / 2) * 210} 85 v 13 h 5 l -5 10 l -5 -10 h 5`} />
      <foreignObject x={(i + 0.5 - options.length / 2) * 210 - 90} y="48" width="160" height="40">
        <div className={"flowTitle" + (option.active?" active":"")}>
          <div>
            <p contentEditable={option.focused}>{option.text}</p>
          </div>
        </div>
      </foreignObject>
      <circle cx={(i + 0.5 - options.length / 2) * 210} cy="85" r="5" stroke={ option.active ? "#4a90e2" : "#e2e2e2"} strokeWidth="1" fill='#ffffff' />
      {option.active?<circle cx={(i + 0.5 - options.length / 2) * 210} cy="85" r="2" fill='#4a90e2' />:null}
      {option.child?
        (<g key="child" transform={`translate(${(i + 0.5 - options.length / 2) * 210},110)`}>
          <Process {...option.child}  />
        </g>):null
      }
    </g>
  ));
};

const Process = ({text, active, focused, last, child, options}) => {
  const stroke = active ? "#4a90e2" : "#e2e2e2";
  let fill = active ? "#e8f3ff" : "#fbfbfb";
  const style = {};
  if (focused) {
    style.filter = "url(#glow)";
  }
  if (focused) {
    fill = stroke;
  }
  
  const maxDepth = getMaxDepth({options});
  const margin = maxDepth * 110;
  
  return (
    <g>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {
        last ? (
          <path style={style} fill={fill} strokeWidth={1} stroke={stroke} d="m -90 0 h 180 c 0 0, 10 0, 10 10 v 30 c 0 0, 0 10, -10 10 h -180 c 0 0, -10 0, -10 -10 v -30 c 0 0, 0 -10, 10 -10" />
        ):(
          <path style={style} fill={fill} strokeWidth={1} stroke={stroke} d="m -90 0 h 180 c 0 0, 10 0, 10 10 v 30 c 0 0, 0 10, -10 10 h -80 l -10 10 l -10 -10 h -80 c 0 0, -10 0, -10 -10 v -30 c 0 0, 0 -10, 10 -10" />
        )
      }
      <foreignObject x="-90" y="5" width="180" height="40">
        <div className={"flowTitle" + (active?" active":"") + (focused?" focused":"")}>
          <div>
            <p contentEditable={focused}>{text}</p>
          </div>
        </div>
      </foreignObject>
      {
        options?[
          (<path key="startPath" strokeWidth={1} stroke={options.some(option => option.active) ? "#4a90e2" : "#e2e2e2"} d="m 0 60 v 25" />),
          getOptionsLines(options)
        ]:null
      }
      {
        child?[
          (<g key="child" transform={`translate(0,${margin+ 110})`}>
            <Process {...child}  />
          </g>),
          (<path key="path" fill={ child.active ? "#4a90e2" : "#e2e2e2"} strokeWidth={1} stroke={ child.active ? "#4a90e2" : "#e2e2e2"} d={`m 0 ${margin + (options?85:60)} v ${options?13:38} h 5 l -5 10 l -5 -10 h 5`} />)
        ]:null
      }
      
    </g>
  )
};

export default Process;
