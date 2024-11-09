import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientDetail } from '../interfaces/patient-detail.interface';
import { GraphQLClient, gql } from 'graphql-request';
import { lastValueFrom } from 'rxjs';
import { GraphQLService } from '../config/graphql.service';
import { Treatment } from '../interfaces/treatment.interface';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // private endpoint = 'http://143.198.138.115:8080/graphql';

  constructor(private graphqlService: GraphQLService) {}

  async fetchPatientDetails(id: string): Promise<PatientDetail[]> {
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const query = `
      query ListDetallePaciente {
          ListDetallePaciente(paciente_id: "${id}") {
              id
              title
              data_time
              notes
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

    // // Usa lastValueFrom para convertir el observable en una promesa
    // return lastValueFrom(
    //   this.http.post<any>(this.endpoint, { query }, { headers }).pipe(
    //     map(response =>
    //       response.data.ListDetallePaciente.map((item: any) => ({
    //         id: item.id,
    //         title: item.title,
    //         data_time: item.data_time,
    //         notes: item.notes,
    //         paciente: {
    //           id: item.paciente.id,
    //           name: item.paciente.name,
    //           lastName: item.paciente.lastName,
    //           address: item.paciente.address,
    //           ci: item.paciente.ci,
    //           sexo: item.paciente.sexo,
    //           contactNumber: item.paciente.contactNumber,
    //           titulo: item.paciente.titulo,
    //           user: {
    //             id: item.paciente.user.id,
    //             username: item.paciente.user.username,
    //             email: item.paciente.user.email,
    //             role: item.paciente.user.role
    //           }
    //         },
    //         doctor: {
    //           id: item.doctor.id,
    //           name: item.doctor.name,
    //           lastName: item.doctor.lastName,
    //           address: item.doctor.address,
    //           ci: item.doctor.ci,
    //           sexo: item.doctor.sexo,
    //           contactNumber: item.doctor.contactNumber,
    //           titulo: item.doctor.titulo,
    //           user: {
    //             id: item.doctor.user.id,
    //             username: item.doctor.user.username,
    //             email: item.doctor.user.email,
    //             role: item.doctor.user.role
    //           }
    //         }
    //       }))
    //     )
    //   )
    // );

    // Realiza la solicitud
    const response = await this.graphqlService.request<{ ListDetallePaciente: PatientDetail[] }>(query);
    return response.ListDetallePaciente;
  }

  async deletePatientDetail(id: string): Promise<void> {
    const mutation = gql`
      mutation DeleteStoryDetail {
          DeleteStoryDetail(id: "${id}")
      }
    `;

    // Realiza la solicitud
    await this.graphqlService.request(mutation);
  }

  // private getClient(): GraphQLClient {
  //   return new GraphQLClient(this.endpoint);
  // }

  async savePatientDetail(patientDetail: Partial<PatientDetail>, patientId: string): Promise<void> {
    // console.log("🚀 ~ savePatientDetail ~ patientDetail:", patientDetail);
    // console.log('Token:', token);

    // const client = this.getClient();
    // client.setHeader('Authorization', `Bearer ${token}`);

    const mutation = gql`
      mutation Store_StoryDetail {
        store_StoryDetail(
          request: {
            paciente_id: "${patientId}"
            notes: "${patientDetail.notes}"
            title: "${patientDetail.title}"
            id: null
          }
        ) {
          id
          title
          data_time
          notes
        }
      }
    `;
    // try {
    //   const response = await client.request(mutation);
    //   console.log("🚀 ~ PatientService ~ savePatientDetail ~ response:", response);
    // } catch (error) {
    //   console.error('Error saving patient detail:', error);
    // }

    // Realiza la solicitud
    await this.graphqlService.request<{ store_StoryDetail: PatientDetail }>(mutation);
  }

  async fetchTreatments(id: string): Promise<Treatment[]> {
    const query = `
      query GetTratamientoByIdPaciente {
        getTratamientoByIdPaciente(paciente_id: "${id}") {
            id
            detail
            title
            recipe
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

    const response = await this.graphqlService.request<{ getTratamientoByIdPaciente: Treatment[] }>(query);
    return response.getTratamientoByIdPaciente;
  }
}
