import { Person } from "./login-response.interface";

export interface Timetable {
  id: string;
  date : string;
  time: string;
  doctor : Person;
}
