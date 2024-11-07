// usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from '../interfaces/login-response.interface';
import { GraphQLClient, gql } from 'graphql-request';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private endpoint = 'http://143.198.138.115:8080/graphql';

  constructor(private http: HttpClient) { }

  fetchUsuarios(token: string): Observable<Person[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const query = `query ListarUsuario { listarUsuario { id, name, lastName, address, ci, sexo, contactNumber, titulo, user { id, username, email, role } } }`;

    return this.http
      .post<any>(this.endpoint, { query }, { headers })
      .pipe(
        map(response => response.data.listarUsuario.map((item: any) => ({
          id: item.id,
          name: item.name,
          lastName: item.lastName,
          address: item.address,
          ci: item.ci,
          sexo: item.sexo,
          contactNumber: item.contactNumber,
          titulo: item.titulo,
          user: {
            id: item.user.id,
            username: item.user.username,
            email: item.user.email,
            role: item.user.role
          }
        })))
      );
  }

  private getClient(): GraphQLClient {
    return new GraphQLClient(this.endpoint);
  }

  async saveUser(user: Partial<Person>, token: string): Promise<void> {
    const client = this.getClient();
    client.setHeader('Authorization', `Bearer ${token}`);
    const mutation = gql`
      mutation StoreDoctor {
        storeDoctor(request: {
          email: "${user.user?.email}",
          password: "defaultPassword",
          name: "${user.name}",
          last_name: "${user.lastName}",
          address: "${user.address}",
          ci: "${user.ci}",
          sexo: "${user.sexo}",
          contact_number: "${user.contactNumber}",
          birth_date: "10-10-1990",
          url: "http://example.com",
          titulo: "${user.titulo || ''}"
        })
      }
    `;

    try {
      const response = await client.request(mutation);
      console.log('User created/updated successfully:', response);
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  }

  async updateUsuario(user: Partial<Person>, token: string): Promise<void> {
    const client = this.getClient();
    client.setHeader('Authorization', `Bearer ${token}`);
    const mutation = gql`
      mutation UpdateDoctor {
        updateDoctor(id: "${user.id}", request: {
          email: "${user.user?.email}",
          password: "defaultPassword",
          name: "${user.name}",
          last_name: "${user.lastName}",
          address: "${user.address}",
          ci: "${user.ci}",
          sexo: "${user.sexo}",
          contact_number: "${user.contactNumber}",
          birth_date: "10-10-1990",
          url: "http://example.com",
          titulo: "${user.titulo || ''}"
        })
      }
    `;

    try {
      const response = await client.request(mutation);
      console.log('User updated successfully:', response);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async deleteUsuario(id: string, token: string): Promise<void> {
    /* const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const mutation = `mutation DeleteDoctor { deleteDoctor(id: "${id}") }`;
    try {
      return this.http.post(this.endpoint, { mutation }, { headers });
    } catch (error) {
      console.error('Error deleting user:', error);
      return of(null);
    } */
    const client = this.getClient();
    client.setHeader('Authorization', `Bearer ${token}`);
    const mutation = gql`mutation DeleteDoctor { deleteDoctor(id: "${id}") }`;
    try {
      const response = await client.request(mutation);
      console.log('User deleted successfully:', response);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
}
