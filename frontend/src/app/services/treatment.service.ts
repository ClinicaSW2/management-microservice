import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Treatment } from '../interfaces/treatment.interface';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private endpoint = `http://146.190.52.218:4000/api`

  constructor(private http: HttpClient) {}

  /**
   * Método para predecir etiquetas a partir de una imagen
   * @param file - Archivo de imagen para la predicción
   * @returns Observable con las etiquetas predichas y sus puntajes de confianza
   */

  fetchTreatments(detailId: string): Observable<Treatment> {
    console.log("🚀 ~ TreatmentService ~ fetchTreatments ~ detailId:", detailId);
    return this.http.get<Treatment>(this.endpoint + '/treatment/' + detailId)
      .pipe(
        map((response: any) => {
          // Log de la respuesta completa que llega desde la API
          console.log("🚀 ~ TreatmentService ~ fetchTreatments ~ response:", response);

          return {
            id: response.id,
            detail: response.detail,
            title: response.title,
            recipe: response.recipe,
            paciente: response.paciente || null,
            doctor: response.doctor || null,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          const errorMsg = error.error?.error || error.message || 'Error en la API';
          console.error("🚨 ~ TreatmentService ~ fetchTreatments ~ error:", errorMsg);
          return throwError(() => new Error(`Error in API: ${errorMsg}`));
        })
      );
  }

}

