import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { DoctorComponent } from './doctor/doctor.component';
import { TimetableComponent } from './timetable/timetable.component';
import { ReserveComponent } from './reserve/reserve.component';
import { PatientComponent } from './patient/patient.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'doctor', component: DoctorComponent, canActivate: [authGuard] },
  { path: 'timetable', component: TimetableComponent, canActivate: [authGuard] },
  { path: 'reserve', component: ReserveComponent, canActivate: [authGuard] },
  { path: 'patient', component: PatientComponent, canActivate: [authGuard] },
  { path: 'drag-drop', component: DragDropComponent, canActivate: [authGuard] },
  { path: 'treatment', component: TreatmentComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
