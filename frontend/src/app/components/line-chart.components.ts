import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IntelligenceService } from '../services/intelligence.service';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Cargando Grafico...</p>
      </div>
      <canvas id="lineChart"></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      // display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
      // background-color: #f9fafc;
      // border-radius: 8px;
      // padding: 16px;
      // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      // border: 1px solid #e0e0e0;
    }
    canvas {
      max-height: 100%;
      max-width: 100%;
    }
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(249, 250, 252, 0.8);
      z-index: 1;
      color: #3949ab;
    }
  `]
})

export class LineChartComponent implements OnChanges {
  isLoading = false;
  @Input() especialidad: string = '';

  chart: any;

  constructor(private intelligenceService: IntelligenceService) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['especialidad']) {
      await this.fetchData();
    }
  }

  async fetchData(): Promise<void> {
    this.isLoading = true;
    (await this.intelligenceService.getIngresoByEspecialidad(this.especialidad)).subscribe((dataString) => {
      const data = JSON.parse(dataString);
      const chartData = this.formatChartData(data);
      this.renderChart(chartData);
      this.isLoading = false;
    });
  }

  formatChartData(data: any): any {
    const datasets = Object.keys(data).map((year) => ({
      label: `Año ${year}`,
      data: Object.values(data[year]),
      borderColor: this.getRandomColor(),
      backgroundColor: this.getRandomColor(0.1),
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }));

    return {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets
    };
  }

  renderChart(chartData: any): void {
    if (this.chart) this.chart.destroy();

    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#3949ab',
                font: {
                  size: 12,
                  family: 'Arial, sans-serif',
                  weight: 'bold'
                }
              }
            },
            title: {
              display: true,
              text: 'Reporte de Ingresos por Mes y Año',
              color: '#1a237e',
              font: {
                size: 16,
                family: 'Arial, sans-serif',
                weight: 'bold'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#e0e0e0'
              },
              title: {
                display: true,
                text: 'Ingreso En Bs.',
                color: '#3949ab',
                font: {
                  size: 14,
                  family: 'Arial, sans-serif'
                }
              }
            },
            x: {
              grid: {
                color: '#e0e0e0'
              },
              title: {
                display: true,
                text: 'Meses',
                color: '#3949ab',
                font: {
                  size: 14,
                  family: 'Arial, sans-serif'
                }
              }
            }
          }
        }
      });
    }
  }

  private getRandomColor(opacity: number = 1): string {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
  }
}
