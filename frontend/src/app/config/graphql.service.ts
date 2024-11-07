// graphql.service.ts
import { Injectable } from '@angular/core';
import { GraphQLClient, gql } from 'graphql-request';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private readonly endpoint = 'http://143.198.138.115:8080/graphql';
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(this.endpoint);
  }

  // Setea el token de autenticación
  setAuthToken(token: string): void {
    this.client.setHeader('Authorization', `Bearer ${token}`);
  }

  // Realiza una solicitud de mutación o query
  async request<T>(query: string, variables?: any): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error) {
      console.error('GraphQL request error:', error);
      throw error;
    }
  }
}
