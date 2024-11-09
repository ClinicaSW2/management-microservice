import { Component, OnInit, NgZone } from '@angular/core';
import { Person } from '../interfaces/login-response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientDetail } from '../interfaces/patient-detail.interface';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule, MatIconModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patient: Person | null = null;
  patientDetails: PatientDetail[] = [];
  isLoading = false;
  isCreating = false;
  showForm = false;
  modalTitle: string = 'Crear Detalle de Paciente';
  formData: Partial<PatientDetail> = {};
  deleteConfirmationMessage = '¿Estás seguro de que deseas eliminar este detalle de paciente?';
  detailFix: string = '';
  modalVisibility = false;
  isDeleting = false;
  recognition: any;
  isListening = false;
  isListeningTitle = false;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.patient = JSON.parse(localStorage.getItem('patient') || '{}');
    this.loadPatientDetails();
    this.setupSpeechRecognition();
  }

  setupSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      console.log("SpeechRecognition API found");
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        console.log("Speech recognition started");
        this.ngZone.run(() => this.isListening = true);
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript received:", transcript);
        this.ngZone.run(() => {
          if (this.isListeningTitle) {
            this.formData.title = (this.formData.title || '') + ' ' + transcript;
          } else {
            this.formData.notes = (this.formData.notes || '') + ' ' + transcript;
          }
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        this.ngZone.run(() => this.isListening = false);
      };

      this.recognition.onend = () => {
        console.log("Speech recognition ended");
        this.ngZone.run(() => this.isListening = false);
      };
    } else {
      console.warn("Speech recognition API is not supported in this browser");
    }
  }

  startListening(field: 'title' | 'notes') {
    if (this.recognition) {
      console.log("Starting speech recognition for:", field);
      this.isListeningTitle = field === 'title';
      this.recognition.start();
    } else {
      console.warn("Speech recognition is not initialized");
    }
  }

  stopListening() {
    if (this.recognition) {
      console.log("Stopping speech recognition");
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async loadPatientDetails(): Promise<void> {
    if (this.patient?.id) {
      this.isLoading = true;
      try {
        this.patientDetails = await this.patientService.fetchPatientDetails(this.patient.id);
      } catch (error) {
        console.error('Error al cargar los detalles del paciente:', error);
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
    if (action === 'Crear') this.formData = {};
  }

  async handleSubmit() {
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
      console.error('Error al guardar el detalle del paciente:', error);
    } finally {
      this.isCreating = false;
    }
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
          console.error('Error al eliminar el detalle del paciente:', error);
          this.isDeleting = false;
          this.modalVisibility = false;
        }
      );
    } catch (error) {
      console.error('Error al eliminar el detalle del paciente:', error);
      this.isDeleting = false;
    }
  }

  cancelDelete(): void {
    this.modalVisibility = false;
  }

  handleVerTratamiento(detail: PatientDetail): void {
    console.log("🚀 ~ PatientComponent ~ handleVerTratamiento ~ detail:", detail)
    localStorage.setItem('patient-detail', JSON.stringify(detail));
    this.router.navigate(['/treatment']);
  }
}
