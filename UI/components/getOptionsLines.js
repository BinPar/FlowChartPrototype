import React from 'react';
import flowChartTools from '../tools/flowChartTools';
import Process from './process';

const { getMaxDepth, getMaxWidth } = flowChartTools;

const getOptionsLines = (options, margin, childActive, onSelectNode) => {
  let requiredWidth = 0;
  options.forEach((option, i) => {
    requiredWidth +=
      i === 0 || i === options.length - 1
        ? getMaxWidth(option, null) / 2
        : getMaxWidth(option, null);
  });

  const click = (option) => {
    const selOption = option;
    if (option.child) {
      onSelectNode(option.child);
    } else if (option.childRef) {
      onSelectNode(null);
      selOption.active = true;
      onSelectNode(option.childRef);
    }
  };

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
                <g>
                  <path
                    key="startPath"
                    strokeWidth={2}
                    stroke={'#4a90e2'}
                    d={`m 0 85 h ${xPosition}`}
                  />
                  <path
                    key="startPathAim"
                    strokeWidth={2}
                    stroke={'#fff'}
                    className="animated"
                    d={`m 0 85 h ${xPosition}`}
                  />
                </g>
              ) : null}
              {option.child ? (
                <g>
                  <path
                    key="path"
                    fill={option.active ? '#4a90e2' : '#e2e2e2'}
                    strokeWidth={option.active ? 2 : 1}
                    stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                    d={`m ${xPosition} 85 v 13 h 5 l -5 10 l -5 -10 h 5`}
                  />
                  {option.active ? (
                    <path
                      key="pathActive"
                      strokeWidth={2}
                      className="animated"
                      stroke={'#fff'}
                      d={`m ${xPosition} 85 v 12`}
                    />
                  ) : null}
                </g>
              ) : (
                <g>
                  <path
                    key="path"
                    fill="none"
                    strokeWidth={option.active ? 2 : 1}
                    stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                    d={`m ${xPosition} 85 v ${margin}`}
                  />
                  {option.active ? (
                    <path
                      key="pathAnim"
                      fill="none"
                      strokeWidth="2"
                      className="animated"
                      stroke="#fff"
                      d={`m ${xPosition} 85 v ${margin}`}
                    />
                  ) : null}
                </g>
              )}
              <foreignObject
                x={xPosition === 0 ? 0 : xPosition - 80}
                y="48"
                width={xPosition === 0 ? 80 : 160}
                height="40"
                onClick={() => click(option)}
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
                onClick={() => click(option)}
                stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                strokeWidth="1"
                fill="#ffffff"
              />
              {option.child ? (
                <g>
                  <path
                    fill="none"
                    strokeWidth={(childActive && option.active) ? 2 : 1}
                    stroke={childActive && option.active ? '#4a90e2' : '#e2e2e2'}
                    d={`m ${xPosition} ${verticalEnd} v ${subMargin} h ${xPosition * -1}`}
                  />
                  {(childActive && option.active) ? (
                    <path
                      fill="none"
                      strokeWidth="2"
                      stroke="#fff"
                      className="animated"
                      d={`m ${xPosition} ${verticalEnd} v ${subMargin} h ${xPosition * -1}`}
                    />
                  ) : null}
                </g>
              ) : null}
              {option.active ? <circle cx={xPosition} cy="85" r="2" fill="#4a90e2" /> : null}
              {option.child ? (
                <g key="child" transform={`translate(${xPosition},110)`}>
                  <Process node={option.child} onSelectNode={onSelectNode} />
                </g>
              ) : null}
            </g>
          ),
        };
      })
      .sort((a, b) => (a.x > b.x ? 1 : -1))
      .map(x => x.node),
  ];
};

export default getOptionsLines;
