import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../services/reserve.service';
import { AuthService } from '../services/auth.service';
import { Reserve } from '../interfaces/reserve.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../interfaces/login-response.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.scss'
})
export class ReserveComponent implements OnInit {
  reserves: Reserve[] = [];
  // token: string | null = null;

  isLoading = false;

  constructor(
    private reserveService: ReserveService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.token = this.authService.getToken();
    // if (this.token) {
    //   this.loadReserves();
    //   console.log('Reserves:', this.reserves);
    //   if (!this.reserves) {
    //     this.router.navigate(['/login']);
    //   }
    // } else {
    //   this.authService.logout();
    //   this.router.navigate(['/login']);
    // }

    this.loadReserves();
  }

  loadReserves(): void {
    // if (this.token) {
    //   this.isLoading = true;
    //   this.reserveService.fetchReserves(this.token).subscribe(
    //     (reserves) => {
    //       console.log("🚀 ~ ReserveComponent ~ loadReserves ~ reserves:", reserves)
    //       this.reserves = reserves;
    //       this.isLoading = false;
    //     },
    //     (error) => {
    //       console.error('Error loading reserves:', error);
    //       this.isLoading = false;
    //     }
    //   );
    // }

    this.isLoading = true;
    this.reserveService.fetchReserves().then(
      (reserves) => {
        this.reserves = reserves;
        this.isLoading = false;
      }
    ).catch((error) => {
      this.isLoading = false;
      if (error.error.message === 'Unauthorized') {
        this.authService.logout();
      }
    });
  }

  handleViewPatient(patient: Person): void {
    console.log('Viewing patient:', patient);
    localStorage.setItem('patient', JSON.stringify(patient));
    this.router.navigate(['/patient']);
  }

  handleFinishReserve(reserve: Reserve): void {
    console.log('Finishing reserve:', reserve);
  }

}
