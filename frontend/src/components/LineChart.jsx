'use client';
import React, { useEffect, useState } from 'react';
import {Line} from 'react-chartjs-2';
import {Chart as chartjs,LinearScale,LineElement,CategoryScale,PointElement,Legend,Title, plugins, Colors} from 'chart.js';
import { getEndpoint } from '@/services/intelligence';
chartjs.register(
    LinearScale,LineElement,CategoryScale,PointElement,Legend,Title
);



const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export default function LineChart({ especialidad }) {
    const [datasets, setDatasets] = useState([]);
    let espe = '';

    if(especialidad){
        espe = especialidad.value;
    }
   
    useEffect(()=>{
        async function fetchData(){
            try {
                const response =await fetch(`${getEndpoint()}/sumaingresobymesbyanioByEspecialidad?especialidad=${espe}`, {
                    method: 'GET',
                    headers: {
                        "ngrok-skip-browser-warning": "69420",
                    }
                  });
                
                const data_response = await response.json();
                const newDatasets = [];
                Object.keys(data_response).forEach(año => {
                    const dataset = {
                        label: `Año `+año ,
                        data: [],
                        borderColor: getRandomColor(),
                        borderWidh:3,
                        tension:0.3
                    };

                    Object.keys(data_response[año]).forEach(mes => {
                        dataset.data.push(data_response[año][mes]);
                    });

                    newDatasets.push(dataset);
                });

                setDatasets(newDatasets);               
            } catch (error) {
                //console.log(error)
            }
        }
        fetchData();
    },[]);
 
    const chartData = {
        labels,
        datasets,
    };
    const options={
        plugins:{
            legend:{
                position:"bottom",
                labels: {
                    color:"",
                    font:{
                        size:12
                    }
                }
            },
            title:{
                display: false,
                text: "Reporte de Ingreso por Mes y Por Año",
                color:"",
                font:{
                    size:20
                }
                
            }
        },
        scales:{
            y:{
                beginAtZero:true,
                min:0,
                max:50000,
                title:{
                    display:true,
                    text:"Ingreso En Bs.",
                    color:"",
                    font:{
                        size:15
                    }
                }
            },
            x:{
                title:{
                    display:true,
                    text:"Meses ",
                    color:"",
                    font:{
                        size:15
                    }
                }
            }
        },
        
        
    };
  return (
    
        <Line data={chartData} options={options} ></Line>

  )

  
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