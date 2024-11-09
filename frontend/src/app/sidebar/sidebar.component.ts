import { Component, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule para routerLink
import { AuthService } from '../services/auth.service';
import { Person } from '../interfaces/login-response.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterModule // Asegúrate de incluir esto
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() user: Person | null = null;
  userRole: string | null = null;  // Variable para almacenar el rol del usuario
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Obtiene el rol del usuario al iniciar el componente
    this.userRole = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.userRole === role;
  }
}
