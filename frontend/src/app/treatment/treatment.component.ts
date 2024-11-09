import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Treatment } from '../interfaces/treatment.interface';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { PatientService } from '../services/patient.service';
import { TreatmentService } from '../services/treatment.service';
import { Person } from '../interfaces/login-response.interface';
import { PatientDetail } from '../interfaces/patient-detail.interface';

@Component({
  selector: 'app-treatment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './treatment.component.html',
  styleUrl: './treatment.component.scss'
})
export class TreatmentComponent implements OnInit {
  patient: Person | null = null;
  detail: PatientDetail | null = null;
  treatment: Treatment | null = null;
  isLoading = false;
  // isSubmitting = false;
  // isDeleting = false;
  // modalVisibility = false;
  // showForm = false;
  selectedTreatmentId: string | null = null;
  // formData: Partial<Treatment> = {};
  // deleteConfirmationMessage = '¿Estás seguro de que deseas eliminar este tratamiento?';
  // modalTitle: string = 'Crear Tratamiento';

  constructor(
    // private patientService: PatientService
    private treatmentService: TreatmentService
  ) { }

  ngOnInit(): void {
    // this.patient = JSON.parse(localStorage.getItem('patient'));
    if (localStorage.getItem('patient')) {
      this.patient = JSON.parse(localStorage.getItem('patient') || '{}');
      if (localStorage.getItem('patient-detail')) {
        this.detail = JSON.parse(localStorage.getItem('patient-detail') || '{}');
        this.loadTreatments();
      }
    }
  }

  // toggleEditForm(action: string = 'Crear') {
  //   this.modalTitle = action === 'Actualizar' ? 'Actualizar Tratamiento' : 'Crear Tratamiento';
  //   this.showForm = !this.showForm;
  //   if (action === 'Crear') this.formData = {};  // Reset formData for new treatment creation
  // }

  // deleteTreatment(id: string): void {
  //   this.isDeleting = true;
  //   this.patientService.deleteTreatment(id).then(
  //     () => {
  //       this.treatments = this.treatments.filter((treatment) => treatment.id !== id);
  //       this.isDeleting = false;
  //     },
  //     (error) => {
  //       console.error('Error deleting treatment:', error);
  //       this.isDeleting = false;
  //     }
  //   );
  // }

  loadTreatments(): void {
    this.isLoading = true;
    if (this.patient?.id) {
      // this.patientService.fetchTreatments(this.patient.id).then(
      //   (treatments) => {
      //     this.treatments = treatments;
      //     this.isLoading = false;
      //   },
      //   (error) => {
      //     console.error('Error loading treatments:', error);
      //     this.isLoading = false;
      //   }
      // );
      if (this.detail?.id) {
        /* this.patientService.fetchTreatments(this.detail.id).then(
          (treatments) => {
            this.treatments = treatments;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error loading treatments:', error);
            this.isLoading = false;
          }
        ); */
        this.treatmentService.fetchTreatments(this.detail.id).subscribe(
          (treatments) => {
            this.treatment = treatments;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error loading treatments:', error);
            this.isLoading = false;
          }
        );
      }
    }
  }
}
