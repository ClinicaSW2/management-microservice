import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IntelligenceService {
  // private baseUrl = 'http://143.198.138.115:5000'; // Replace with actual base URL
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  async getEspecialidades(): Promise<Observable<{ value: string; label: string; }[]>> {
    return this.http.get<any[]>(`${this.baseUrl}/getespecialidad`).pipe(
      map((data) => {
        console.log('Datos obtenidos de la API:', data); // Muestra los datos antes de transformarlos
        return data.map((especialidad) => ({ value: especialidad, label: especialidad }));
      })
    );
  }


  async getIngresoByEspecialidad(especialidad: string): Promise<Observable<any>> {
    console.log(`${this.baseUrl}/sumaingresobymesbyanioByEspecialidad?especialidad=${especialidad}`)
    return this.http.get<any>(`${this.baseUrl}/sumaingresobymesbyanioByEspecialidad?especialidad=${especialidad}`);
  }

  async getCantidadReservacion(): Promise<Observable<any>> {
    return this.http.get<any>(`${this.baseUrl}/cantidadReservacion`);
  }

  async getPromedioAtencion(): Promise<Observable<any>> {
    return this.http.get<any[]>(`${this.baseUrl}/promedioAtencion`);
  }

  async getPromedioAtencionM(): Promise<Observable<any>> {
    return this.http.get<any[]>(`${this.baseUrl}/promedioAtencionM`);
  }

  async getPromedioAtencionF(): Promise<Observable<any>> {
    return this.http.get<any[]>(`${this.baseUrl}/promedioAtencionF`);
  }
}
