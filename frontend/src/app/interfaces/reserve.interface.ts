import { Person } from "./login-response.interface";
import { Timetable } from "./timetable.interface";

// reserve.interface.ts
export interface Reserve {
  id: string;
  place: string;
  state: string;
  paciente: Person;
  available_time: Timetable;
}
