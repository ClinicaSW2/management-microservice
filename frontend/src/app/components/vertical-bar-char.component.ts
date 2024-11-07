import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartDataset, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';
import { IntelligenceService } from '../services/intelligence.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js/auto';

// Registrar explícitamente los componentes necesarios de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-vertical-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],  // Importa NgChartsModule completo
  template: `
    <div class="chart-container">
      <canvas *ngIf="chartData" baseChart
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
      margin-bottom: 10px;
    }
  `]
})
export class VerticalBarChartComponent implements OnInit {
  chartData: { labels: string[]; datasets: ChartDataset<'bar'>[] } | null = null;

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cantidad de Citas Médicas por Mes y Año',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tiempo en minutos',
          font: {
            size: 15,
          },
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  constructor(private intelligenceService: IntelligenceService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      (await this.intelligenceService.getCantidadReservacion()).subscribe((dataString) => {
        const data = JSON.parse(dataString);
        const datasets: ChartDataset<'bar'>[] = [];
        const labels = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        Object.keys(data).forEach((year) => {
          const dataset: ChartDataset<'bar'> = {
            label: `Año ${year}`,
            data: Object.values(data[year]),
            backgroundColor: this.getRandomColor(),
          };
          datasets.push(dataset);
        });

        this.chartData = {
          labels,
          datasets,
        };
      });

    } catch (error) {
      console.error('Error al obtener datos de reservación:', error);
    }
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }
}
