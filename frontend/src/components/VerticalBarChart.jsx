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
            position: 'top',
        },
        title: {
            display: true,
            text: 'Cantidad de Citas medicas por Mes y Por Año',
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

// Función para generar colores aleatorios
const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

// Lista de nombres de los meses
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function VerticalBarChart() {
    const [chartData, setChartData] = useState({
        labels: monthNames, // Usar la lista de nombres de los meses
        datasets: [],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${getEndpoint()}/cantidadReservacion`, {
                    method: 'GET',
                    headers: {
                        "ngrok-skip-browser-warning": "69420",
                    }
                  });
                const data_response = await response.json();
                
                const newLabels = [];
                const newDatasets = [];
                Object.keys(data_response).forEach(año => {
                    const dataset = {
                        label: `Año ` + año,
                        data: [],
                        backgroundColor: randomColor(),
                    };

                    Object.keys(data_response[año]).forEach(mes => {
                        if (!newLabels.includes(mes)) {
                            newLabels.push(mes);
                        }
                        dataset.data.push(data_response[año][mes]);
                    });

                    newDatasets.push(dataset);
                });

                setChartData({
                    labels: monthNames ,
                    datasets: newDatasets,
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return <Bar options={options} data={chartData} />;
}
