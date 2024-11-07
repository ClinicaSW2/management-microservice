// reserve.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserve } from '../interfaces/reserve.interface';
import { GraphQLClient, gql } from 'graphql-request';

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  private endpoint = 'http://143.198.138.115:8080/graphql';

  constructor(private http: HttpClient) { }

  fetchReserves(token: string): Observable<Reserve[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const query = `
      query GetReservacion {
          getReservacion {
              id
              place
              state
              paciente {
                  id
                  name
                  lastName
                  address
                  ci
                  sexo
                  contactNumber
                  titulo
                  user {
                      id
                      username
                      email
                      role
                  }
              }
              available_time {
                  id
                  date
                  time
                  doctor {
                      id
                      name
                      lastName
                      address
                      ci
                      sexo
                      contactNumber
                      titulo
                      user {
                          id
                          username
                          email
                          role
                      }
                  }
              }
          }
      }
    `;
    return this.http
      .post<any>(this.endpoint, { query }, { headers })
      .pipe(
        map(response => response.data.getReservacion.map((item: any) => ({
          id: item.id,
          place: item.place,
          state: item.state,
          paciente: {
            id: item.paciente.id,
            name: item.paciente.name,
            lastName: item.paciente.lastName,
            address: item.paciente.address,
            ci: item.paciente.ci,
            sexo: item.paciente.sexo,
            contactNumber: item.paciente.contactNumber,
            titulo: item.paciente.titulo,
            user: {
              id: item.paciente.user.id,
              username: item.paciente.user.username,
              email: item.paciente.user.email,
              role: item.paciente.user.role
            }
          },
          available_time: {
            id: item.available_time.id,
            date: item.available_time.date,
            time: item.available_time.time,
            doctor: {
              id: item.available_time.doctor.id,
              name: item.available_time.doctor.name,
              lastName: item.available_time.doctor.lastName,
              address: item.available_time.doctor.address,
              ci: item.available_time.doctor.ci,
              sexo: item.available_time.doctor.sexo,
              contactNumber: item.available_time.doctor.contactNumber,
              titulo: item.available_time.doctor.titulo,
              user: {
                id: item.available_time.doctor.user.id,
                username: item.available_time.doctor.user.username,
                email: item.available_time.doctor.user.email,
                role: item.available_time.doctor.user.role
              }
            }
          }
        })))
      );
  }
}
