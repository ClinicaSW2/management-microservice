import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule, // Add MatIconModule here
    SidebarComponent,
    MatMenuModule // Add MatMenuModule here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav; // Reference to sidenav

  constructor(public authService: AuthService, private router: Router) {}

  toggleSidenav() {
    this.sidenav.toggle(); // Method to toggle the sidenav
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
