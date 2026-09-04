import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { usePets } from '../context/PetContext';
import { colors, radius, spacing } from '../theme';

export function PetSelector() {
  const { pets, selectedPetId, selectPet } = usePets();
  if (pets.length < 2) return null;

  return (
    <ScrollView
      accessibilityLabel="Pet selector"
      contentContainerStyle={styles.row}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {pets.map((pet) => {
        const selected = pet.id === selectedPetId;
        return (
          <Pressable
            accessibilityRole="button"
            key={pet.id}
            onPress={() => selectPet(pet.id)}
            style={[styles.chip, selected && styles.selectedChip]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{pet.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  selectedLabel: {
    color: colors.white,
  },
});
