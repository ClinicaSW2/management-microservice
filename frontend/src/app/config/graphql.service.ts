// graphql.service.ts
import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private readonly endpoint = 'http://143.198.138.115:8080/graphql';
  // private readonly endpoint = 'http://localhost:8080/graphql';
  private client: GraphQLClient;
  private authService?: AuthService;  // Agregar una propiedad para AuthService

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector  // Inyectar Injector en lugar de AuthService
  ) {
    // Inicializa el cliente de GraphQL
    this.client = new GraphQLClient(this.endpoint);

    // Configura el token en el cliente
    const token = this.getTokenFromLocalStorage();
    if (token) {
      this.setAuthorizationHeader(token);
    }
  }

  private getTokenFromLocalStorage(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('accessToken') : null;
  }

  // Configura el encabezado de autorización
  private setAuthorizationHeader(token: string): void {
    this.client.setHeader('Authorization', `Bearer ${token}`);
  }

  // Permite actualizar el token de autenticación
  public updateToken(token: string): void {
    localStorage.setItem('accessToken', token);
    this.setAuthorizationHeader(token);
  }

  async request<T>(query: string, variables?: any): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error) {
      console.error('GraphQL request error:', error);

      if ((error as any).response?.errors?.[0]?.message === 'Unauthorized') {
        // Obtener una instancia de AuthService para llamar a logout()
        if (!this.authService) {
          this.authService = this.injector.get(AuthService);
        }

        // Llamar a logout para cerrar la sesión
        this.authService.logout();
      }

      throw error;
    }
  }
}
