import React from 'react';
import PropTypes from 'prop-types';
import flowChartTools from '../tools/flowChartTools';

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

class Process extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
    this.mouseHover = this.mouseHover.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.renderShape = this.renderShape.bind(this);
  }

  componentDidMount() {
    if (this.label && this.props.focused) {
      this.label.contentEditable = true;
    }
  }

  mouseHover() {
    this.setState({ hover: true });
  }

  mouseOut() {
    this.setState({ hover: false });
  }
  renderShape() {
    const { active, focused, last, condition } = this.props;
    let stroke = '#e2e2e2';
    if (active) {
      stroke = '#4a90e2';
    }
    let fill = active ? '#e8f3ff' : '#fbfbfb';
    const style = {};
    if (focused || this.state.hover) {
      style.filter = 'url(#glow)';
    }
    if (focused) {
      fill = stroke;
    }

    if (this.state.hover) {
      stroke = '#b2b2b2';
    }

    if (last) {
      return (
        <path
          style={style}
          fill={fill}
          strokeWidth={1}
          stroke={stroke}
          d="m -90 0 h 180 c 0 0, 10 0, 10 10 v 30 c 0 0, 0 10, -10 10 h -180 c 0 0, -10 0, -10 -10 v -30 c 0 0, 0 -10, 10 -10"
        />
      );
    }
    if (condition) {
      return (
        <path
          style={style}
          fill={fill}
          strokeWidth={1}
          stroke={stroke}
          d="m -75 0 h 150 l 25 25 l -25 25 h -65 l -10 10 l -10 -10 h -65 l -25 -25 l 25 -25"
        />
      );
    }
    return (
      <path
        style={style}
        fill={fill}
        strokeWidth={1}
        stroke={stroke}
        d="m -90 0 h 180 c 0 0, 10 0, 10 10 v 30 c 0 0, 0 10, -10 10 h -80 l -10 10 l -10 -10 h -80 c 0 0, -10 0, -10 -10 v -30 c 0 0, 0 -10, 10 -10"
      />
    );
  }

  render() {
    const { text, active, focused, child, options } = this.props;
    const style = {};
    if (focused) {
      style.filter = 'url(#glow)';
    }
    const maxDepth = getMaxDepth({ options });
    const margin = maxDepth * 110;

    return (
      <g>
        <g pointerEvents="all" onMouseOver={this.mouseHover} onMouseOut={this.mouseOut}>
          {this.renderShape()}
          <foreignObject x="-90" y="5" width="180" height="40">
            <div className={`flowTitle${active ? ' active' : ''}${focused ? ' focused' : ''}`}>
              <div>
                <p
                  ref={(ref) => {
                    this.label = ref;
                  }}
                >
                  {text}
                </p>
              </div>
            </div>
          </foreignObject>
        </g>
        {options
          ? [
            <path
              key="startPath"
              strokeWidth={1}
              stroke={options.some(option => option.active) ? '#4a90e2' : '#e2e2e2'}
              d="m 0 60 v 25"
            />,
            getOptionsLines(options, margin, child && child.active),
          ]
          : null}
        {child
          ? [
            <g key="child" transform={`translate(0,${margin + 110})`}>
              <Process {...child} />
            </g>,
            <path
              key="path"
              fill={child.active ? '#4a90e2' : '#e2e2e2'}
              strokeWidth={1}
              stroke={child.active ? '#4a90e2' : '#e2e2e2'}
              d={`m 0 ${margin + (options ? 85 : 60)} v ${
                options ? 13 : 38
              } h 5 l -5 10 l -5 -10 h 5`}
            />,
          ]
          : null}
      </g>
    );
  }
}

Process.propTypes = {
  text: PropTypes.string,
  active: PropTypes.bool,
  focused: PropTypes.bool,
  last: PropTypes.bool,
  first: PropTypes.bool,
  condition: PropTypes.bool,
  child: PropTypes.shape(),
  options: PropTypes.arrayOf(PropTypes.shape()),
};

Process.defaultProps = {
  text: '',
  active: false,
  condition: false,
  focused: false,
  last: false,
  first: false,
  child: null,
  options: null,
};

export default Process;
