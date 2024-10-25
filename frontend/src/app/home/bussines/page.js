'use client';
import LineChart from '@/components/LineChart';
import { PorsentageChart } from '@/components/PorsentageChart';
import SelectEspecilidad from '@/components/SelectEspecilidad';
import { VerticalBarChart } from '@/components/VerticalBarChart';
import React, { useState } from 'react';




export default function PowerBI() {
  return (
    <>
     <div className="mb-4">
  <div className="mb-4">
    <SelectEspecilidad />
  </div>
  <div className="mb-4">
    <VerticalBarChart />
  </div>
  <div className="mb-4">
    <PorsentageChart />
  </div>
</div>

    
    </>
  );
}
