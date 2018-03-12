import React from 'react';
import flowChartTools from '../tools/flowChartTools';
import Process from './process';

const { getMaxDepth, getMaxWidth, endsWithChild } = flowChartTools;

const getOptionsLines = (options, margin, childActive, onSelectNode, childsX) => {
  const xMargin = margin;
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
        const maxDepth = getMaxDepth({ child: option.child, options: option.options }) - 1;
        let subMargin = margin;
        subMargin -= maxDepth * 110;
        
        const delta = i === 0 ? 0 : 105;
        currentX += getMaxWidth(option.child, option.options) * delta;
        const xPosition = currentX;
        currentX += getMaxWidth(option.child, option.options) * 105;

        let verticalEnd = margin - subMargin;
        verticalEnd += 85;

        const labelAlmostCenter = (xPosition + childsX) >= 0 &&(xPosition + childsX) < 80;
        const labelAlmostCenterL = !labelAlmostCenter && (xPosition + childsX) < 0 &&(xPosition + childsX) > -80;

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
                    d={`m ${-childsX} 85 h ${xPosition + childsX}`}
                  />
                  <path
                    key="startPathAim"
                    strokeWidth={2}
                    stroke={'#fff'}
                    className="animated"
                    d={`m ${-childsX} 85 h ${xPosition + childsX}`}
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
                    d={`m ${xPosition} 85 v ${xMargin - 20} h ${-xPosition - childsX}`}
                  />
                  {option.active ? (
                    <path
                      key="pathAnim"
                      fill="none"
                      strokeWidth="2"
                      className="animated"
                      stroke="#fff"
                      d={`m ${xPosition} 85 v ${xMargin - 20} h ${-xPosition - childsX} v 20`}
                    />
                  ) : null}
                </g>
              )}
              <foreignObject
                x={ labelAlmostCenter  ? xPosition : xPosition - 80}
                y="48"
                width={labelAlmostCenter || labelAlmostCenterL ? 80 : 160}
                height="40"
                onClick={() => click(option)}
              >
                <div className={`flowTitle${option.active ? ' active' : ''}`}>
                  <div>
                    <p className={labelAlmostCenter ? 'alignLeft' : (labelAlmostCenterL?'alignRight':'')}>{option.text}</p>
                  </div>
                </div>
              </foreignObject>
              {option.child ? (
                <g key="child" transform={`translate(${xPosition},110)`}>
                  <Process node={option.child} onSelectNode={onSelectNode} />
                </g>
              ) : null}
              {option.child ? (
                <g>
                  <path
                    fill="none"
                    strokeWidth={(childActive && option.active) ? 2 : 1}
                    stroke={childActive && option.active ? '#4a90e2' : '#e2e2e2'}
                    d={`m ${xPosition} ${verticalEnd - (endsWithChild(option) ? 20 : 25)} v ${subMargin + (endsWithChild(option) ? 0 : 5)} h ${(xPosition +childsX) * -1}`}
                  />
                  {(childActive && option.active) ? (
                    <path
                      fill="none"
                      strokeWidth="2"
                      stroke="#fff"
                      className="animated"
                      d={`m ${xPosition} ${verticalEnd - (endsWithChild(option) ? 20 : 25)} v ${subMargin + (endsWithChild(option) ? 0 : 5)} h ${(xPosition +childsX) * -1}`}
                    />
                  ) : null}
                </g>
              ) : null}
            </g>
          ),
          subnode: (
            <g key={option.text}>
              {option.child && childActive && option.active? (
                <g>
                  <path
                    fill="none"
                    strokeWidth={(childActive && option.active) ? 2 : 1}
                    stroke={childActive && option.active ? '#4a90e2' : '#e2e2e2'}
                    d={`m ${xPosition} ${verticalEnd - (endsWithChild(option) ? 20 : 25)} v ${subMargin + (endsWithChild(option) ? 0 : 5)} h ${(xPosition +childsX) * -1}`}
                  />
                  <path
                    fill="none"
                    strokeWidth="2"
                    stroke="#fff"
                    className="animated"
                    d={`m ${xPosition} ${verticalEnd - (endsWithChild(option) ? 20 : 25)} v ${subMargin + (endsWithChild(option) ? 0 : 5)} h ${(xPosition +childsX) * -1}`}
                  />
                </g>
              ) : (
                childActive && option.active ? (
                  <g>
                    <path
                      key="path"
                      fill="none"
                      strokeWidth={option.active ? 2 : 1}
                      stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                      d={`m ${xPosition} 85 v ${xMargin - 20} h ${-xPosition - childsX}`}
                    />
                    {option.active ? (
                      <path
                        key="pathAnim"
                        fill="none"
                        strokeWidth="2"
                        className="animated"
                        stroke="#fff"
                        d={`m ${xPosition} 85 v ${xMargin - 20} h ${-xPosition - childsX} v 20`}
                      />
                    ) : null}
                  </g>
                ) : null
              )}
              <circle
                cx={xPosition}
                cy="85"
                r="5"
                onClick={() => click(option)}
                stroke={option.active ? '#4a90e2' : '#e2e2e2'}
                strokeWidth="1"
                fill="#fff"
              />
              {option.active ? <circle cx={xPosition} cy="85" r="2" fill="#4a90e2" /> : null}
            </g>
          )
        };
      })
      .sort((a, b) => (a.x > b.x ? 1 : -1))
      .reduce((t,x) => [[...t[0], x.node], [...t[1],x.subnode]], [[],[]]),
  ];
};

export default getOptionsLines;
