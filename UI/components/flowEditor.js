import React from 'react';
import Process from './process';
import flowChartTools from '../tools/flowChartTools';

const { getMaxDepth, getTotalWidth } = flowChartTools;

const FlowEditor = () => {
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

  const width = (getTotalWidth(testData) + 2) * 220;
  return (
    <div className="flowEditor">
      <svg style={{ height: getMaxDepth({ child: testData }) * 110, width }}>
        <g transform={`translate(${width / 2},10)`}>
          <Process {...testData} />
        </g>
      </svg>
    </div>
  );
};

export default FlowEditor;
