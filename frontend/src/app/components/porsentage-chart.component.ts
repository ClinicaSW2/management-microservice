import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartOptions, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IntelligenceService } from '../services/intelligence.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-porsentage-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
              [data]="chartData"
              [options]="chartOptions"
              type="bar">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
      background-color: #f9fafc;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
    }
  `]
})
export class PorsentageChartComponent implements OnInit {
  chartData: { labels: string[]; datasets: ChartDataset<'bar'>[] } = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Promedio de Atención vs Especialidad',
        font: { size: 20 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: {
          display: true,
          text: 'Tiempo en minuto',
          font: { size: 15 }
        }
      }
    }
  };

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  constructor(private intelligenceService: IntelligenceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchGeneralData();
    this.fetchMaleData();
    this.fetchFemaleData();
  }

  async fetchGeneralData() {
    try {
      (await this.intelligenceService.getPromedioAtencion()).subscribe((dataResponse) => {
        const data = JSON.parse(dataResponse);
        const labels = data.map((item: any) => item.especialidad);
        const dataValues = data.map((item: any) => item.tiempo_atencion);
        const backgroundColors = dataValues.map(() => this.getRandomColor());

        this.chartData.labels = labels;
        this.chartData.datasets.push({
          label: 'Tiempo Promedio de Atención (minutos)',
          data: dataValues,
          backgroundColor: backgroundColors,
        });

        this.chart.update();  // Refresca el gráfico
        this.cdr.detectChanges();  // Asegura la detección de cambios
      });
    } catch (error) {
      console.error('Error al obtener datos generales:', error);
    }
  }

  async fetchMaleData() {
    try {
      (await this.intelligenceService.getPromedioAtencionM()).subscribe((dataResponse) => {
        const data = JSON.parse(dataResponse);
        const dataValues = data.map((item: any) => item.tiempo_atencion);
        const backgroundColors = dataValues.map(() => this.getRandomColor());

        this.chartData.datasets.push({
          label: 'Tiempo Promedio de Atención Paciente Hombre (minutos)',
          data: dataValues,
          backgroundColor: backgroundColors,
        });

        this.chart.update();
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error al obtener datos de atención de hombres:', error);
    }
  }

  async fetchFemaleData() {
    try {
      (await this.intelligenceService.getPromedioAtencionF()).subscribe((dataResponse) => {
        const data = JSON.parse(dataResponse);
        const dataValues = data.map((item: any) => item.tiempo_atencion);
        const backgroundColors = dataValues.map(() => this.getRandomColor());

        this.chartData.datasets.push({
          label: 'Tiempo Promedio de Atención Paciente Mujer (minutos)',
          data: dataValues,
          backgroundColor: backgroundColors,
        });

        this.chart.update();
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error al obtener datos de atención de mujeres:', error);
    }
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }
}
