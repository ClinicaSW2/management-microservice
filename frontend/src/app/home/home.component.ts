import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SelectEspecialidadComponent } from '../components/select-especialidad.component';
import { LineChartComponent } from '../components/line-chart.components';
import { VerticalBarChartComponent } from '../components/vertical-bar-char.component';
import { PorsentageChartComponent } from '../components/porsentage-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    SelectEspecialidadComponent,
    LineChartComponent,
    VerticalBarChartComponent,
    PorsentageChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  selectedEspecialidad: string = '';  // Define la propiedad para almacenar la especialidad seleccionada

  onEspecialidadSelected(especialidad: string) {
    this.selectedEspecialidad = especialidad;  // Actualiza el valor cuando cambia la especialidad
  }
}
