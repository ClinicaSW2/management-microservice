import { Component, OnInit } from '@angular/core';
import { Person } from '../interfaces/login-response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientDetail } from '../interfaces/patient-detail.interface';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patient: Person | null = null;
  patientDetails: PatientDetail[] = [];
  // token: string | null = null;
  isLoading = false;
  isCreating = false;
  showForm = false;
  modalTitle: string = 'Crear Detalle de Paciente';
  formData: Partial<PatientDetail> = {};
  deleteConfirmationMessage = '¿Estás seguro de que deseas eliminar este detalle de paciente?';
  detailFix: string = '';
  modalVisibility = false;
  isDeleting = false;

  constructor(
    private router: Router,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.patient = JSON.parse(localStorage.getItem('patient') || '{}');
    // this.token = this.authService.getToken();
    // if (this.token) {
    //   console.log('Patient:', this.patient);
    //   this.loadPatientDetails();
    //   if (!this.patient) {
    //     this.router.navigate(['/doctor']);
    //   }
    // } else {
    //   this.authService.logout();
    // }

    this.loadPatientDetails();
  }

  async loadPatientDetails(): Promise<void> {
    // if (this.token && this.patient?.id) {
    //   this.isLoading = true;
    //   try {
    //     this.patientDetails = await this.patientService.fetchPatientDetails(this.patient.id);
    //   } catch (error) {
    //     console.error('Error loading patient details:', error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // }

    if (this.patient?.id) {
      this.isLoading = true;
      try {
        this.patientDetails = await this.patientService.fetchPatientDetails(this.patient.id);
      } catch (error) {
        console.error('Error loading patient details:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.router.navigate(['/reserve']);
    }
  }

  toggleCreateForm(action: string = 'Crear'): void {
    this.showForm = !this.showForm;
    this.modalTitle = action === 'Actualizar' ? 'Actualizar Detalle de Paciente' : 'Crear Detalle de Paciente';
    if (action === 'Crear') this.formData = {}; // Clear form for new patient detail
  }

  handleVerTratamiento(detail: PatientDetail): void {
    console.log("🚀 ~ PatientComponent ~ handleVerTratamiento ~ detail:", detail)
    localStorage.setItem('patient-detail', JSON.stringify(detail));
    this.router.navigate(['/treatment']);
  }

  async handleSubmit() {
    // this.isLoading = true;
    // try {
    //   if (this.token && this.patient?.id) {
    //     await this.patientService.savePatientDetail(this.token, this.formData, this.patient.id);
    //     this.toggleCreateForm();
    //     await this.loadPatientDetails();
    //   } else {
    //     this.router.navigate(['/reserve']);
    //   }
    // } catch (error) {
    //   console.error('Error saving patient detail:', error);
    // } finally {
    //   this.isLoading = false;
    // }

    try {
      if (this.patient?.id) {
        this.isCreating = true;
        await this.patientService.savePatientDetail(this.formData, this.patient.id);
        this.isCreating = false;
        this.toggleCreateForm();
        await this.loadPatientDetails();
      } else {
        this.router.navigate(['/reserve']);
      }
    } catch (error) {
      console.error('Error saving patient detail:', error);
    } finally {
      // this.isLoading = false;
    }
  }

  toggleTreatment() {
    this.router.navigate(['/treatment']);
  }

  handleEliminarDetallePaciente(id: string): void {
    this.detailFix = id;
    this.modalVisibility = true;
  }

  async confirmDelete(): Promise<void> {
    this.isDeleting = true;
    try {
      await this.patientService.deletePatientDetail(this.detailFix).then(
        () => {
          this.patientDetails = this.patientDetails.filter((detail) => detail.id !== this.detailFix);
          this.isDeleting = false;
          this.modalVisibility = false;
        },
        (error) => {
          console.error('Error deleting patient detail:', error);
          this.isDeleting = false;
          this.modalVisibility = false;
        }
      );
    } catch (error) {
      console.error('Error deleting patient detail:', error);
      this.isDeleting = false;
    }
  }

  cancelDelete(): void {
    this.modalVisibility = false;
  }
}
