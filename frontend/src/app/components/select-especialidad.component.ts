// select-especialidad.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IntelligenceService } from '../services/intelligence.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-especialidad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="especialidad-selector">
      <label>Filtro Especialidades</label>
      <select class="form-control" (change)="handleChange($event)">
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .especialidad-selector {
      margin-bottom: 20px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      font-size: 16px;
      border-radius: 4px;
      border: 1px solid #ccc;
      transition: border-color 0.3s;
    }
    .form-control:focus {
      border-color: #3949ab;
      outline: none;
    }
    label {
      font-size: 14px;
      color: #3949ab;
      margin-bottom: 8px;
      display: block;
    }
  `]
})
export class SelectEspecialidadComponent implements OnInit {
  options: { value: string; label: string }[] = [];
  @Output() specialtySelected = new EventEmitter<string>();

  constructor(private intelligenceService: IntelligenceService) {}

  async ngOnInit(): Promise<void> {
    (await this.intelligenceService.getEspecialidades()).subscribe((data) => {
      this.options = [{ value: '', label: 'Todos' }, ...data];
    });
  }

  handleChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.specialtySelected.emit(selectedValue);
  }
}
