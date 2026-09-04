import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Pet } from '../types';

const PETS_KEY = '@petcare/pets/v1';
const SELECTED_PET_KEY = '@petcare/selected-pet/v1';

export const loadPets = async (): Promise<Pet[]> => {
  const stored = await AsyncStorage.getItem(PETS_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  return Array.isArray(parsed) ? (parsed as Pet[]) : [];
};

export const savePets = (pets: Pet[]): Promise<void> =>
  AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));

export const loadSelectedPetId = (): Promise<string | null> =>
  AsyncStorage.getItem(SELECTED_PET_KEY);

export const saveSelectedPetId = async (petId: string | null): Promise<void> => {
  if (petId) {
    await AsyncStorage.setItem(SELECTED_PET_KEY, petId);
  } else {
    await AsyncStorage.removeItem(SELECTED_PET_KEY);
  }
};
