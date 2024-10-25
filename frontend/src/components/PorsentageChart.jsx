'use client';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getEndpoint } from '@/services/intelligence';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' ,
    },
    title: {
      display: true,
      text: 'Promedio de atencion vs Especialidad',
      font:{
        size:20
    }
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 1
      },
      title:{
        display:true,
        text:"Tiempo en minuto",
        color:"",
        font:{
            size:15
        }
    },
    }
  }
};

export function PorsentageChart() {
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);
  const [backgroundColors, setBackgroundColors] = useState([]);

  const [labelsM, setLabelsM] = useState([]);
  const [dataValuesM, setDataValuesM] = useState([]);
  const [backgroundColorsM, setBackgroundColorsM] = useState([]);

  const [labelsF, setLabelsF] = useState([]);
  const [dataValuesF, setDataValuesF] = useState([]);
  const [backgroundColorsF, setBackgroundColorsF] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${getEndpoint()}/promedioAtencion`, {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "69420",
          }
        });
        const dataResponse = await response.json();
        const newLabels = dataResponse.map(item => item.especialidad);
        const newDataValues = dataResponse.map(item => item.promedio_tiempo_atencion);
        const newBackgroundColors = newDataValues.map(() => getRandomColor());
        setLabels(newLabels);
        setDataValues(newDataValues);
        setBackgroundColors(newBackgroundColors);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${getEndpoint()}/promedioAtencionM`, {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "69420",
          }
        });
        const dataResponse = await response.json();
        const newLabels = dataResponse.map(item => item.especialidad);
        const newDataValues = dataResponse.map(item => item.promedio_tiempo_atencion);
        const newBackgroundColors = newDataValues.map(() => getRandomColor());
        setLabelsM(newLabels);
        setDataValuesM(newDataValues);
        setBackgroundColorsM(newBackgroundColors);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${getEndpoint()}/promedioAtencionF`, {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "69420",
          }
        });
        const dataResponse = await response.json();
        const newLabels = dataResponse.map(item => item.especialidad);
        const newDataValues = dataResponse.map(item => item.promedio_tiempo_atencion);
        const newBackgroundColors = newDataValues.map(() => getRandomColor());
        setLabelsF(newLabels);
        setDataValuesF(newDataValues);
        setBackgroundColorsF(newBackgroundColors);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Tiempo Promedio de Atención (minutos)',
        data: dataValues,
        backgroundColor: backgroundColors,
      },
      {
        label: 'Tiempo Promedio de Atención Paciente Hombre (minutos)',
        data: dataValuesM,
        backgroundColor: backgroundColorsM,
      },
      {
        label: 'Tiempo Promedio de Atención Paciente Mujer (minutos)',
        data: dataValuesF,
        backgroundColor: backgroundColorsF,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

// Función para generar un color hexadecimal aleatorio
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
