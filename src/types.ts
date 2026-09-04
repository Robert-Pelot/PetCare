export type AppointmentKind = 'Veterinary' | 'Grooming';

export interface Appointment {
  id: string;
  title: string;
  kind: AppointmentKind;
  date: string;
  reminderId?: string;
}

export interface CareLogEntry {
  id: string;
  type: string;
  timestamp: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  details: string;
}

export interface MealDetails {
  time: string;
  food: string;
  medications: string;
}

export interface DietSchedule {
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
  snacks: string;
  treats: string;
}

export interface Pet {
  id: string;
  name: string;
  age: string;
  birthdate: string;
  breed: string;
  weight: string;
  photoUri: string;
  logs: CareLogEntry[];
  appointments: Appointment[];
  medicalHistory: MedicalRecord[];
  diet: DietSchedule;
  groomingInstructions: string;
  groomerInformation: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetDraft {
  name: string;
  age: string;
  birthdate: string;
  breed: string;
  weight: string;
  photoUri: string;
}

export type RootStackParamList = {
  Main: undefined;
  PetForm: { mode: 'add' | 'edit' };
  MedicalHistory: undefined;
  DietSchedule: undefined;
  GroomingInfo: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  'Care Log': undefined;
  Appointments: undefined;
};
