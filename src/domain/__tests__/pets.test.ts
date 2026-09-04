import { describe, expect, test } from '@jest/globals';

import {
  buildPet,
  cleanDraft,
  groupCareLogs,
  isValidDateInput,
  reminderTime,
  sortAppointments,
  upcomingAppointments,
  validatePetDraft,
} from '../pets';
import type { Appointment, PetDraft } from '../../types';

const validDraft: PetDraft = {
  name: ' Bailey ',
  age: '4',
  birthdate: '2022-03-14',
  breed: ' Golden retriever ',
  weight: '55',
  photoUri: ' file:///bailey.jpg ',
};

describe('pet data helpers', () => {
  test('cleans user-entered fields without changing their meaning', () => {
    expect(cleanDraft(validDraft)).toEqual({
      name: 'Bailey',
      age: '4',
      birthdate: '2022-03-14',
      breed: 'Golden retriever',
      weight: '55',
      photoUri: 'file:///bailey.jpg',
    });
  });

  test.each([
    ['2024-02-29', true],
    ['2023-02-29', false],
    ['2025-13-01', false],
    ['03/14/2022', false],
    ['', false],
  ])('validates date input %s', (value, expected) => {
    expect(isValidDateInput(value)).toBe(expected);
  });

  test('reports invalid profile fields together', () => {
    expect(
      validatePetDraft({
        ...validDraft,
        name: ' ',
        age: '-1',
        birthdate: '2025-02-30',
        weight: 'zero',
      }),
    ).toEqual([
      'Pet name is required.',
      'Birthdate must be a real date in YYYY-MM-DD format.',
      'Age must be a non-negative number.',
      'Weight must be greater than zero.',
    ]);
  });

  test('creates a complete pet record from a valid draft', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const pet = buildPet(validDraft, now);

    expect(pet).toMatchObject({
      name: 'Bailey',
      breed: 'Golden retriever',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      logs: [],
      appointments: [],
      medicalHistory: [],
    });
    expect(pet.id).not.toBe('');
    expect(pet.diet.breakfast).toEqual({ time: '', food: '', medications: '' });
  });
});

describe('appointment helpers', () => {
  const appointments: Appointment[] = [
    {
      id: 'late',
      kind: 'Veterinary',
      title: 'Annual checkup',
      date: '2026-09-06T12:00:00.000Z',
    },
    {
      id: 'early',
      kind: 'Grooming',
      title: 'Grooming',
      date: '2026-09-05T12:00:00.000Z',
    },
  ];

  test('sorts appointments without mutating stored state', () => {
    const sorted = sortAppointments(appointments);

    expect(sorted.map((item) => item.id)).toEqual(['early', 'late']);
    expect(appointments.map((item) => item.id)).toEqual(['late', 'early']);
  });

  test('returns only upcoming appointments', () => {
    const upcoming = upcomingAppointments(
      appointments,
      new Date('2026-09-05T18:00:00.000Z'),
    );

    expect(upcoming.map((item) => item.id)).toEqual(['late']);
  });

  test('calculates a reminder before the appointment', () => {
    expect(reminderTime(new Date('2026-09-05T12:00:00.000Z'), 30).toISOString()).toBe(
      '2026-09-05T11:30:00.000Z',
    );
  });
});

describe('care-log helpers', () => {
  test('filters invalid records and orders the remaining entries newest first', () => {
    const grouped = groupCareLogs([
      { id: 'older', type: 'Walk', timestamp: '2026-09-04T08:00:00.000Z' },
      { id: 'invalid', type: 'Bad date', timestamp: 'not-a-date' },
      { id: 'newer', type: 'Feeding', timestamp: '2026-09-04T12:00:00.000Z' },
    ]);

    const entries = Object.values(grouped).flat();
    expect(entries.map((entry) => entry.id)).toEqual(['newer', 'older']);
  });
});
