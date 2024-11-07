// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly endpoint = 'http://143.198.138.115:5000/api';

  constructor(private http: HttpClient) {}

  // Setea headers de autenticación
  private getHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Métodos de ejemplo para GET, POST, PUT y DELETE
  get<T>(path: string, token?: string): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${path}`, { headers: this.getHeaders(token) });
  }

  post<T>(path: string, body: any, token?: string): Observable<T> {
    return this.http.post<T>(`${this.endpoint}/${path}`, body, { headers: this.getHeaders(token) });
  }

  put<T>(path: string, body: any, token?: string): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${path}`, body, { headers: this.getHeaders(token) });
  }

  delete<T>(path: string, token?: string): Observable<T> {
    return this.http.delete<T>(`${this.endpoint}/${path}`, { headers: this.getHeaders(token) });
  }
}
