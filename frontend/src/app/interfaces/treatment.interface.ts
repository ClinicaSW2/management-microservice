import { Person } from "./login-response.interface";

export interface Treatment {
  id: string;
  detail: string;
  title: string;
  recipe: string;
  paciente: Person | null;
  doctor: Person | null;
}
