import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Person } from '../interfaces/login-response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule],
  selector: 'app-usuarios',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  usuarios: Person[] = [];
  isLoading = false;
  isSubmitting = false; // Loading indicator for form submission
  isDeleting = false;
  modalVisibility = false;
  userFix: string = '';
  showForm = false;
  formData: Partial<Person> = {}; // Keeps formData as Partial<Person>
  deleteConfirmationMessage = '¿Estás seguro de que deseas eliminar este usuario?';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.fetchUsuarios().then(
      (usuarios) => {
        this.usuarios = usuarios;
        this.isLoading = false;
      }
    ).catch((error) => {
      this.isLoading = false;
      if (error.error.message === 'Unauthorized') {
        this.authService.logout();
      }
    });
  }

  modalTitle: string = 'Crear Usuario';

  toggleUserForm(action: string = 'Crear') {
    this.modalTitle = action === 'Actualizar' ? 'Actualizar Usuario' : 'Crear Usuario';
    this.showForm = !this.showForm;
    if (action === 'Crear') this.formData = {};  // Reset formData for new user creation
  }

  async handleSubmit() {
    this.isSubmitting = true;
    try {
      if (this.modalTitle === 'Crear Usuario') {
        await this.usuarioService.saveUser(this.formData); // Create action
      } else {
        await this.usuarioService.updateUsuario(this.formData); // Update action
      }
      this.toggleUserForm(); // Close modal after successful save/update
      this.loadUsuarios(); // Refresh user list
    } catch (error) {
      console.error("Error saving/updating user:", error);
    } finally {
      this.isSubmitting = false;
    }
  }



  handleActualizarUsuario(usuario: Person): void {
    this.formData = { ...usuario };  // Load user data into form for editing
    this.toggleUserForm('Actualizar');  // Set title to "Actualizar" and open modal
  }

  handleEliminarUsuario(id: string): void {
    this.userFix = id; // Store user ID for deletion
    this.modalVisibility = true; // Show confirmation modal
  }

  confirmDelete(): void {
    this.isDeleting = true; // Start deleting loader
    this.usuarioService.deleteUsuario(this.userFix).then(() => {
      this.isDeleting = false; // Stop deleting loader
      this.modalVisibility = false; // Close confirmation modal
      this.loadUsuarios(); // Refresh user list
    }).catch(() => {
      this.isDeleting = false; // Ensure loader stops on error
    });
  }

  cancelDelete(): void {
    this.modalVisibility = false; // Close modal without action
  }

  onCancel(): void {
    this.modalVisibility = false;
  }
}
