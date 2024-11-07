// login-response.interface.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Person {
  id: string;
  name: string;
  lastName: string;
  address: string;
  ci: string;
  sexo: string;
  contactNumber: string;
  titulo?: string | null;
  user: User;
}

export interface LoginResponse {
  token: string;
  message: string | null;
  person: Person;
}
