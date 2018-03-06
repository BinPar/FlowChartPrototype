import React from 'react';
import PropTypes from 'prop-types';
import flowChartTools from '../tools/flowChartTools';
import getOptionsLines from './getOptionsLines';

const { getMaxDepth } = flowChartTools;

class Process extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
    this.mouseHover = this.mouseHover.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.click = this.click.bind(this);
    this.renderShape = this.renderShape.bind(this);
  }

  componentDidMount() {
    if (this.label && this.props.node.focused) {
      this.label.contentEditable = true;
    }
  }

  componentDidUpdate() {
    if (this.label) {
      this.label.contentEditable = !!this.props.node.focused;
    }
  }

  mouseHover() {
    this.setState({ hover: true });
  }

  mouseOut() {
    this.setState({ hover: false });
  }

  click() {
    this.props.onSelectNode(this.props.node);
  }

  renderShape() {
    const { active, focused, last, first, condition, script } = this.props.node;
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
          d="m -75 0 h 150 c 0 0, 25 0, 25 25 c 0 0, 0 25, -25 25 h -150 c 0 0, -25 0, -25 -25 c 0 0, 0 -25, 25 -25"
        />
      );
    }
    if (first) {
      return (
        <path
          style={style}
          fill={fill}
          strokeWidth={1}
          stroke={stroke}
          d="m -75 0 h 150 c 0 0, 25 0, 25 25 c 0 0, 0 25, -25 25 h -65 l -10 10 l -10 -10 h -65 c 0 0, -25 0, -25 -25 c 0 0, 0 -25, 25 -25"
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
    if (script) {
      return (
        <path
          style={style}
          fill={fill}
          strokeWidth={1}
          stroke={stroke}
          d="m -100 0 h 190 l 10 10 v 40 h -90 l -10 10 l -10 -10 h -90 v -50"
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
    const { text, active, focused, child, options, childRef } = this.props.node;
    const style = {};
    if (focused) {
      style.filter = 'url(#glow)';
    }
    const maxDepth = getMaxDepth({ options });
    const margin = maxDepth * 110;

    return (
      <g>
        <g
          pointerEvents="all"
          onMouseOver={this.mouseHover}
          onMouseOut={this.mouseOut}
          onClick={this.click}
        >
          {this.renderShape()}
          <foreignObject x="-74" y="5" width="150" height="40">
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
              strokeWidth={options.some(option => option.active) ? 2 : 1}
              stroke={options.some(option => option.active) ? '#4a90e2' : '#e2e2e2'}
              d="m 0 60 v 25"
            />,
            options.some(option => option.active) ? (
              <path
                key="startPathAnim"
                strokeWidth={2}
                className="animated"
                stroke="#fff"
                d="m 0 60 v 25"
              />
            ) : null,
            getOptionsLines(
              options,
              margin,
              (child && child.active) || (childRef && childRef.active),
              this.props.onSelectNode,
            ),
          ]
          : null}
        {child
          ? [
            <g key="child" transform={`translate(0,${margin + 110})`}>
              <Process node={child} onSelectNode={this.props.onSelectNode} />
            </g>,
            <path
              key="path"
              fill={child.active ? '#4a90e2' : '#e2e2e2'}
              strokeWidth={child.active ? 2 : 1}
              stroke={child.active ? '#4a90e2' : '#e2e2e2'}
              d={`m 0 ${margin + (options ? 85 : 60)} v ${
                options ? 13 : 38
              } h 5 l -5 10 l -5 -10 h 5`}
            />,
            child.active ? (
              <path
                key="pathActive"
                strokeWidth={2}
                className="animated"
                stroke={'#fff'}
                d={`m 0 ${margin + (options ? 85 : 60)} v ${options ? 13 : 37}`}
              />
            ) : null,
          ]
          : null}
      </g>
    );
  }
}

Process.propTypes = {
  node: PropTypes.shape(),
  onSelectNode: PropTypes.func,
};

Process.defaultProps = {
  node: null,
  onSelectNode: () => {},
};

export default Process;
