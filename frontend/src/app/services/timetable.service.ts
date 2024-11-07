import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timetable } from '../interfaces/timetable.interface';
import { GraphQLClient, gql } from 'graphql-request';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private endpoint = 'http://143.198.138.115:8080/graphql';

  constructor(private http: HttpClient) { }

  fetchTimetables(token: string): Observable<Timetable[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const query = `
      query MiHorario {
          miHorario {
              message
              status
              data {
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
        map(response => response.data.miHorario.data.map((item: any) => ({
          id: item.id,
          date: item.date,
          time: item.time,
          doctor: {
            id: item.doctor.id,
            name: item.doctor.name,
            lastName: item.doctor.lastName,
            address: item.doctor.address,
            ci: item.doctor.ci,
            sexo: item.doctor.sexo,
            contactNumber: item.doctor.contactNumber,
            titulo: item.doctor.titulo,
            user: {
              id: item.doctor.user.id,
              username: item.doctor.user.username,
              email: item.doctor.user.email,
              role: item.doctor.user.role
            }
          }
        })))
      );
  }

  private getClient(): GraphQLClient {
    return new GraphQLClient(this.endpoint);
  }

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }


  async saveTimetable(timetable: Partial<Timetable>, token: string): Promise<void> {
    console.log('Saving timetable:', timetable);
    console.log('Token:', token);

    const client = this.getClient();
    client.setHeader('Authorization', `Bearer ${token}`);

    // Format the date to DD-MM-YYYY
    const formattedDate = this.formatDate(timetable.date || '');

    console.log('Formatted date:', formattedDate);

    const mutation = gql`
      mutation StoreHorario {
        storeHorario(request: {
          date: "${formattedDate}",
          time: "${timetable.time}:00",
        }) {
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
    `;

    try {
      const response = await client.request(mutation);
      console.log('Timetable created/updated successfully:', response);
    } catch (error) {
      console.error('Error creating/updating timetable:', error);
    }
  }


  async deleteTimetable(id: string, token: string): Promise<void> {
    /* const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const mutation = `
      mutation DeleteHorario {
        deleteHorario(id: "${id}")
      }
    `;

    return this.http.post(this.endpoint, { mutation }, { headers }); */
    const client = this.getClient();
    client.setHeader('Authorization', `Bearer ${token}`);
    const mutation = gql`
      mutation DeleteHorario {
        deleteHorario(id: "${id}")
      }
    `;
    try {
      return client.request(mutation);
    } catch (error) {
      console.error('Error deleting timetable:', error);
    }
  }
}
