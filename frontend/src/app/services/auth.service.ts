// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { gql } from 'graphql-request';
import { LoginResponse, Person } from '../interfaces/login-response.interface';
import { isPlatformBrowser } from '@angular/common';
import { GraphQLService } from '../config/graphql.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Person | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private graphqlService: GraphQLService,
    private router: Router
  ) {}

  // auth.service.ts
async login(email: string, password: string): Promise<void> {
  const query = gql`
    mutation Login($email: String!, $password: String!) {
      login(request: { email: $email, password: $password }) {
        token
        message
        person {
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

  const variables = { email, password };
  const response = await this.graphqlService.request<{ login: { token: string, person: Person } }>(query, variables);
  const { token, person } = response.login;

  if (token && isPlatformBrowser(this.platformId)) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(person));
    // rol
    localStorage.setItem('role', person.user.role);
    this.user = person;

    // Actualiza el token en el servicio GraphQL
    this.graphqlService.updateToken(token);
  } else {
    throw new Error('No token returned');
  }
}


  async miImage(token: string): Promise<void> {
    const query = gql`
      query ListarUsuario {
        miImage {
          id
          url
          user {
            id
            username
            email
            role
          }
        }
      }
    `;

    // Configura el token para GraphQLService
    // this.graphqlService.setAuthToken(token);

    try {
      const data = await this.graphqlService.request<{ miImage: { id: string, url: string, user: { id: string, username: string, email: string, role: string } }[] }>(query);

      // Procesa la respuesta
      const image = data.miImage;
      if (image.length > 0) {
        localStorage.setItem('firstImageUrl', image[0].url);
        console.log("First image URL saved to localStorage:", image[0].url);
      }
    } catch (error) {
      console.error('Error fetching miImage:', error);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Logging out');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('firstImageUrl');
      localStorage.removeItem('role');
    }
    this.router.navigate(['/login']);  // Redirige a la página de inicio de sesión
  }

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('accessToken');
  }

  getUser(): Person | null {
    if (!this.user && isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    }
    return this.user;
  }

  // get role
  getRole(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('role') : null;
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('accessToken') : null;
  }

  getImageUser(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('firstImageUrl') : null;
  }
}
