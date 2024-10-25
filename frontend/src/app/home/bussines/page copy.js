'use client';
import LineChart from '@/components/LineChart';
import { VerticalBarChart } from '@/components/VerticalBarChart';
import React, { useState } from 'react';


export default function PowerBI() {

  const [optico, setOptico] = useState(false);

  const onOptico= () => {

    setOptico(!optico);

    if (optico){
      console.log("true message optico");

    }else{
      console.log("false message optico");
    }
  }

  return (
    <>
      <div className='row'>
        <div className='col-md-10'>
        <LineChart ></LineChart>
        </div>
          <div className='col-md-2'>
            <div className='row'>
              <div className='col'>        
                <input type='checkbox' value="optico" onChange={onOptico}></input>
                <label for="check1">optico</label>
              </div>
              <div className='col'>        
                <input type='checkbox' value="optico" onChange={onOptico} ></input>
                <label for="check1">optico</label>
              </div>

              <div className='col'>        
                <input type='checkbox' value="optico"></input>
                <label for="check1">optico</label>
              </div>

              <div className='col'>        
                <input type='checkbox' value="optico"></input>
                <label for="check1">optico</label>
              </div>
            </div>
          </div>
      </div>    
    </>
  );
}
