import React from 'react';
import Head from 'next/head';
import FlowEditor from '../components/flowEditor';

const flowData = {
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
                child: {
                  text: 'Información adicional',
                },
              },
            ],
          },
        },
        {
          text: 'Lo tiene',
          child: {
            text: 'Es una pena',
            child: {
              text: 'Cross selling',
              child: {
                text: 'Up selling',
              },
            },
          },
        },
      ],
      child: {
        text: 'Despedida',
        last: true,
      },
    },
  },
};

const page = () => (
  <div>
    <Head>
      <title>Flow Chart Prototype</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&amp;subset=latin-ext" rel="stylesheet" />
      <link rel="stylesheet" type="text/css" href="/static/main.css" />
    </Head>
    <FlowEditor flowData={flowData} />
  </div>
);

export default page;
