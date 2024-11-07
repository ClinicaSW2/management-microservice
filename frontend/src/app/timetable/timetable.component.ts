import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import { AuthService } from '../services/auth.service';
import { Timetable } from '../interfaces/timetable.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-timetable-doctor',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule]
})
export class TimetableComponent implements OnInit {
  timetables: Timetable[] = [];
  isLoading = false;
  isSubmitting = false;
  isDeleting = false;
  modalVisibility = false;
  showForm = false;
  selectedHorarioId: string | null = null;
  formData: Partial<Timetable> = {};
  deleteConfirmationMessage = '¿Estás seguro de que deseas eliminar este horario?';
  modalTitle: string = 'Crear Horario';
  token: string | null = null;

  constructor(
    private timetableService: TimetableService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    if (this.token) {
      this.loadTimetables();
    } else {
      this.authService.logout();
    }
  }

  loadTimetables(): void {
    if (this.token) {
      this.isLoading = true;
      this.timetableService.fetchTimetables(this.token).subscribe(
        (timetables) => {
          this.timetables = timetables;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading horarios:', error);
          this.isLoading = false;
        }
      );
    }
  }

  toggleCreateForm(action: string = 'Crear'): void {
    this.modalTitle = action === 'Actualizar' ? 'Actualizar Horario' : 'Crear Horario';
    this.showForm = !this.showForm;
    if (action === 'Crear') this.formData = {}; // Clear form for new horario creation
  }

  async handleSubmit() {
    this.isSubmitting = true;
    try {
      if (this.token) {
        if (this.modalTitle === 'Crear Horario') {
          await this.timetableService.saveTimetable(this.formData, this.token); // Create new horario
        } else {
          /* await this.timetableService.updateTimetable(this.formData, this.token); // Update existing horario */
        }
        this.toggleCreateForm(); // Close form modal
        this.loadTimetables(); // Refresh list
      }
    } catch (error) {
      console.error('Error creating/updating horario:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  handleEliminarHorario(id: string): void {
    this.selectedHorarioId = id; // Store horario ID for deletion
    this.modalVisibility = true; // Show confirmation modal
  }

  confirmDelete(): void {
    this.isDeleting = true;
    if (this.token && this.selectedHorarioId) {
      this.timetableService.deleteTimetable(this.selectedHorarioId, this.token).then(() => {
        this.cancelDelete();
        this.isDeleting = false;
        this.loadTimetables();
      }).catch((error) => {
        console.error('Error deleting horario:', error);
        this.isDeleting = false
      });
    }
  }

  cancelDelete(): void {
    this.modalVisibility = false;
    this.selectedHorarioId = null;
  }
}
