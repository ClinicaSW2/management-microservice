import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagePredictionService {
  // private endpoint = `http://146.190.175.183:5000`;
  private endpoint = `http://34.60.94.61:5000`;

  constructor(private http: HttpClient) {}

  /**
   * Método para predecir etiquetas a partir de una imagen
   * @param file - Archivo de imagen para la predicción
   * @returns Observable con las etiquetas predichas y sus puntajes de confianza
   */
  predictImageLabels(file: File): Observable<{ predicted_labels: string[]; confidence_scores: number[] }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ predicted_labels: string[]; confidence_scores: number[] }>(this.endpoint + '/predict', formData)
      .pipe(
        map((response: any) => ({
          predicted_labels: response.predicted_labels,
          confidence_scores: response.confidence_scores
        })),
        catchError((error: HttpErrorResponse) => {
          const errorMsg = error.error?.error || error.message || 'Error en la API';
          return throwError(() => new Error(`Error in API: ${errorMsg}`));
        })
      );
  }
}
