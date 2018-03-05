import React from 'react';
import Process from './process'
const FlowEditor = () => {
  const testData = {
    text: "Texto de introducción", 
    active: true, 
    child: {
      text: "Información básica", 
      active: true,
      child: {
        text: "¿Le interesa el producto?", 
        active: true,
        options: [
          {
            text: "Sí",
            active: true,
            child: {
              text: "Información adicional", 
              active: true, 
              focused: true,
              child: {
                text: "Datos de la família", 
                child: {
                  text: "Datos de la casa",
                }
              }
            }
          },
          {
            text: "No",
          }
        ],
        child: {
          text: "Despedida", 
          last: true,
        }
      }
    }
  }
  return (
    <div className="flowEditor">
      <svg>
        <g transform="translate(300,10)">
          <Process {...testData}  />
        </g>
      </svg>
    </div>
  );
};

export default FlowEditor;
