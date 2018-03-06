import React from 'react';
import PropTypes from 'prop-types';
import Process from './process';

export default class FlowEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      x: 0,
    };
  }

  componentDidMount() {
    this.recalculateChartSize();
  }

  recalculateChartSize() {
    const { width, height, x } = this.chart.getBBox();
    this.setState({ width: width + 20, height: height + 20, x: x * -1 });
  }

  render() {
    const { width, height, x } = this.state;
    return (
      <div className="flowEditor">
        <svg style={{ width, height }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g
            transform={`translate(${x + 10},10)`}
            ref={(ref) => {
              this.chart = ref;
            }}
          >
            <Process {...this.props.flowData} />
          </g>
        </svg>
      </div>
    );
  }
}

FlowEditor.propTypes = {
  flowData: PropTypes.shape(),
};

FlowEditor.defaultProps = {
  flowData: {
    text: 'Texto de introducción',
    active: true,
    first: true,
    child: {
      child: {
        text: 'Despedida',
        last: true,
      },
    },
  },
};
