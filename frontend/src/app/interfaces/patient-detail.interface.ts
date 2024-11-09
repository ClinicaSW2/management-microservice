import { Person } from "./login-response.interface";

export interface PatientDetail {
  id: string;
  title: string;
  data_time: string;
  notes: string;
  paciente: Person;
  doctor: Person;
}
