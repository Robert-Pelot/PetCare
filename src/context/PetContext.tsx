import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { buildPet } from '../domain/pets';
import { loadPets, loadSelectedPetId, savePets, saveSelectedPetId } from '../services/storage';
import type { Pet, PetDraft } from '../types';

interface PetContextValue {
  pets: Pet[];
  selectedPet: Pet | null;
  selectedPetId: string | null;
  isLoading: boolean;
  error: string | null;
  selectPet: (petId: string) => void;
  addPet: (draft: PetDraft) => Pet;
  updateSelectedPet: (changes: Partial<Pet>) => void;
  deleteSelectedPet: () => void;
}

const PetContext = createContext<PetContextValue | null>(null);

export function PetProvider({ children }: PropsWithChildren) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([loadPets(), loadSelectedPetId()])
      .then(([storedPets, storedSelection]) => {
        if (!active) return;
        setPets(storedPets);
        setSelectedPetId(
          storedPets.some((pet) => pet.id === storedSelection)
            ? storedSelection
            : (storedPets[0]?.id ?? null),
        );
      })
      .catch(() => {
        if (active) setError('PetCare could not load the saved data on this device.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    savePets(pets).catch(() => setError('PetCare could not save the latest changes.'));
  }, [isLoading, pets]);

  useEffect(() => {
    if (isLoading) return;
    saveSelectedPetId(selectedPetId).catch(() =>
      setError('PetCare could not remember the selected pet.'),
    );
  }, [isLoading, selectedPetId]);

  const selectPet = useCallback((petId: string) => setSelectedPetId(petId), []);

  const addPet = useCallback((draft: PetDraft) => {
    const pet = buildPet(draft);
    setPets((current) => [...current, pet]);
    setSelectedPetId(pet.id);
    return pet;
  }, []);

  const updateSelectedPet = useCallback(
    (changes: Partial<Pet>) => {
      if (!selectedPetId) return;
      setPets((current) =>
        current.map((pet) =>
          pet.id === selectedPetId
            ? {
                ...pet,
                ...changes,
                id: pet.id,
                updatedAt: new Date().toISOString(),
              }
            : pet,
        ),
      );
    },
    [selectedPetId],
  );

  const deleteSelectedPet = useCallback(() => {
    if (!selectedPetId) return;
    setPets((current) => {
      const remaining = current.filter((pet) => pet.id !== selectedPetId);
      setSelectedPetId(remaining[0]?.id ?? null);
      return remaining;
    });
  }, [selectedPetId]);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? null;

  const value = useMemo(
    () => ({
      pets,
      selectedPet,
      selectedPetId,
      isLoading,
      error,
      selectPet,
      addPet,
      updateSelectedPet,
      deleteSelectedPet,
    }),
    [
      pets,
      selectedPet,
      selectedPetId,
      isLoading,
      error,
      selectPet,
      addPet,
      updateSelectedPet,
      deleteSelectedPet,
    ],
  );

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePets(): PetContextValue {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePets must be used inside PetProvider.');
  return context;
}
