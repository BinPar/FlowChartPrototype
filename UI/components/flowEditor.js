import React from 'react';
import Process from './process';

const testData = {
  text: 'Texto de introducción',
  active: true,
  child: {
    text: 'Información básica',
    active: true,
    child: {
      text: '¿Le interesa el producto?',
      active: true,
      options: [
        {
          text: 'Sí',
          active: true,
          child: {
            text: 'Información adicional',
            active: true,
            focused: true,
            child: {
              text: 'Datos de la familia',
              child: {
                text: 'Datos de la casa',
                child: {
                  text: 'Tipo de vivienda',
                  options: [
                    {
                      text: 'Propiedad',
                      child: {
                        text: 'Información adicional sobre la propiedad',
                      },
                    },
                    {
                      text: 'Alquiler',
                      child: {
                        text: 'Información sobre el alquiler',
                        child: {
                          text: 'Opción de compra',
                        },
                      },
                    },
                    {
                      text: 'Sin vivienda propia',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          text: 'No',
          child: {
            text: '¿Puede que te interese mas adelante?',
            options: [
              {
                text: 'Sí',
                child: {
                  text: 'Información adicional',
                },
              },
              {
                text: 'No',
              },
            ],
          },
        },
        {
          text: 'Lo tiene',
        },
      ],
      child: {
        text: 'Despedida',
        last: true,
      },
    },
  },
};

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
          <g
            transform={`translate(${x + 10},10)`}
            ref={(ref) => {
              this.chart = ref;
            }}
          >
            <Process {...testData} />
          </g>
        </svg>
      </div>
    );
  }
}
