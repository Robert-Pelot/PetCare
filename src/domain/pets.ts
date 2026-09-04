import type {
  Appointment,
  CareLogEntry,
  DietSchedule,
  Pet,
  PetDraft,
} from '../types';

export const emptyDietSchedule = (): DietSchedule => ({
  breakfast: { time: '', food: '', medications: '' },
  lunch: { time: '', food: '', medications: '' },
  dinner: { time: '', food: '', medications: '' },
  snacks: '',
  treats: '',
});

export const createId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const cleanDraft = (draft: PetDraft): PetDraft => ({
  name: draft.name.trim(),
  age: draft.age.trim(),
  birthdate: draft.birthdate.trim(),
  breed: draft.breed.trim(),
  weight: draft.weight.trim(),
  photoUri: draft.photoUri.trim(),
});

export const isValidDateInput = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const validatePetDraft = (draft: PetDraft): string[] => {
  const cleaned = cleanDraft(draft);
  const errors: string[] = [];

  if (!cleaned.name) errors.push('Pet name is required.');
  if (cleaned.birthdate && !isValidDateInput(cleaned.birthdate)) {
    errors.push('Birthdate must be a real date in YYYY-MM-DD format.');
  }
  if (cleaned.age && (!Number.isFinite(Number(cleaned.age)) || Number(cleaned.age) < 0)) {
    errors.push('Age must be a non-negative number.');
  }
  if (
    cleaned.weight &&
    (!Number.isFinite(Number(cleaned.weight)) || Number(cleaned.weight) <= 0)
  ) {
    errors.push('Weight must be greater than zero.');
  }

  return errors;
};

export const buildPet = (draft: PetDraft, now = new Date()): Pet => {
  const cleaned = cleanDraft(draft);
  const timestamp = now.toISOString();

  return {
    id: createId(),
    ...cleaned,
    logs: [],
    appointments: [],
    medicalHistory: [],
    diet: emptyDietSchedule(),
    groomingInstructions: '',
    groomerInformation: '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const sortAppointments = (appointments: Appointment[]): Appointment[] =>
  [...appointments].sort(
    (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
  );

export const upcomingAppointments = (
  appointments: Appointment[],
  now = new Date(),
): Appointment[] =>
  sortAppointments(appointments).filter(
    (appointment) => new Date(appointment.date).getTime() >= now.getTime(),
  );

export interface DatedCareLogEntry extends CareLogEntry {
  date: Date;
}

export const groupCareLogs = (
  logs: CareLogEntry[],
): Record<string, DatedCareLogEntry[]> =>
  logs
    .map((log) => ({ ...log, date: new Date(log.timestamp) }))
    .filter((log) => !Number.isNaN(log.date.getTime()))
    .sort((left, right) => right.date.getTime() - left.date.getTime())
    .reduce<Record<string, DatedCareLogEntry[]>>((groups, log) => {
      const key = log.date.toLocaleDateString();
      groups[key] = [...(groups[key] ?? []), log];
      return groups;
    }, {});

export const reminderTime = (appointmentDate: Date, minutesBefore: number): Date =>
  new Date(appointmentDate.getTime() - minutesBefore * 60 * 1000);
