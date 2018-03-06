import React from 'react';
import flowChartTools from '../tools/flowChartTools';
import Process from './process';

const { getMaxDepth, getMaxWidth } = flowChartTools;

const getOptionsLines = (options, margin, childActive) => {
  let requiredWidth = 0;
  options.forEach((option, i) => {
    requiredWidth +=
      i === 0 || i === options.length - 1
        ? getMaxWidth(option, null) / 2
        : getMaxWidth(option, null);
  });

  const totalWidth = requiredWidth * 210;
  let currentX = totalWidth / -2;
  return [
    <path
      key="startPath"
      strokeWidth={1}
      stroke={'#e2e2e2'}
      d={`m ${currentX} 85 h ${totalWidth}`}
    />,
    ...options
      .map((option, i) => {
        const maxDepth = getMaxDepth({ child: option.child, options: option.options });
        let subMargin = margin;
        subMargin -= maxDepth * 110;
        subMargin += 25;
        const delta = i === 0 ? 0 : 105;
        currentX += getMaxWidth(option.child, option.options) * delta;
        const xPosition = currentX;
        currentX += getMaxWidth(option.child, option.options) * 105;

        let verticalEnd = margin - subMargin;
        verticalEnd += 85;
        if (option.child && option.child.options && !option.child.child) {
          verticalEnd += 25;
          subMargin -= 25;
        }
        return {
          x: Math.abs(xPosition),
          node: (
            <g key={option.text}>
              {option.active ? (
                <path
                  key="startPath"
                  strokeWidth={1}
                  stroke={'#4a90e2'}
                  d={`m 0 85 h ${xPosition}`}
                />
              ) : null}
              {option.child ? (
                <path
                  key="path"
                  fill={option.active ? '#4a90e2' : '#e2e2e2'}
                  strokeWidth={1}
                  stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                  d={`m ${xPosition} 85 v 13 h 5 l -5 10 l -5 -10 h 5`}
                />
              ) : (
                <path
                  key="path"
                  fill="none"
                  strokeWidth={1}
                  stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                  d={`m ${xPosition} 85 v ${margin} h ${xPosition * -1}`}
                />
              )}
              <foreignObject
                x={xPosition === 0 ? 0 : xPosition - 80}
                y="48"
                width={xPosition === 0 ? 80 : 160}
                height="40"
              >
                <div className={`flowTitle${option.active ? ' active' : ''}`}>
                  <div>
                    <p className={xPosition === 0 ? 'alignLeft' : ''}>{option.text}</p>
                  </div>
                </div>
              </foreignObject>
              <circle
                cx={xPosition}
                cy="85"
                r="5"
                stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                strokeWidth="1"
                fill="#ffffff"
              />
              {option.child ? (
                <path
                  fill="none"
                  strokeWidth={1}
                  stroke={childActive ? '#4a90e2' : '#e2e2e2'}
                  d={`m ${xPosition} ${verticalEnd} v ${subMargin} h ${xPosition * -1}`}
                />
              ) : null}
              {option.active ? <circle cx={xPosition} cy="85" r="2" fill="#4a90e2" /> : null}
              {option.child ? (
                <g key="child" transform={`translate(${xPosition},110)`}>
                  <Process {...option.child} />
                </g>
              ) : null}
            </g>
          ),
        };
      })
      .sort((a, b) => (a.x < b.x ? 1 : -1))
      .map(x => x.node),
  ];
};

export default getOptionsLines;
