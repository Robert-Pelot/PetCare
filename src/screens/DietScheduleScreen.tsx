import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { colors, spacing } from '../theme';
import type { DietSchedule, MealDetails } from '../types';

const meals: (keyof Pick<DietSchedule, 'breakfast' | 'lunch' | 'dinner'>)[] = [
  'breakfast',
  'lunch',
  'dinner',
];

export function DietScheduleScreen() {
  const { selectedPet, updateSelectedPet } = usePets();
  const [diet, setDiet] = useState<DietSchedule | null>(() => selectedPet?.diet ?? null);

  if (!selectedPet || !diet) {
    return (
      <Screen>
        <Text style={styles.empty}>Select or add a pet first.</Text>
      </Screen>
    );
  }

  const updateMeal = (meal: (typeof meals)[number], field: keyof MealDetails, value: string) => {
    setDiet((current) =>
      current
        ? {
            ...current,
            [meal]: { ...current[meal], [field]: value },
          }
        : current,
    );
  };

  const save = () => {
    updateSelectedPet({ diet });
    Alert.alert('Diet saved', `${selectedPet.name}’s feeding information is up to date.`);
  };

  return (
    <Screen>
      <Text style={styles.title}>Diet and feeding</Text>
      <Text style={styles.subtitle}>Meal details for {selectedPet.name}</Text>

      {meals.map((meal) => (
        <Card key={meal}>
          <Text style={styles.cardTitle}>{meal[0].toUpperCase() + meal.slice(1)}</Text>
          <FormField
            label="Time"
            onChangeText={(value) => updateMeal(meal, 'time', value)}
            placeholder="8:00 AM"
            value={diet[meal].time}
          />
          <FormField
            label="Food and amount"
            onChangeText={(value) => updateMeal(meal, 'food', value)}
            placeholder="Food, serving size, instructions"
            value={diet[meal].food}
          />
          <FormField
            label="Medications"
            onChangeText={(value) => updateMeal(meal, 'medications', value)}
            placeholder="Optional"
            value={diet[meal].medications}
          />
        </Card>
      ))}

      <Card>
        <Text style={styles.cardTitle}>Extras</Text>
        <FormField
          label="Snacks"
          multiline
          onChangeText={(value) => setDiet((current) => (current ? { ...current, snacks: value } : current))}
          placeholder="Allowed snacks and limits"
          value={diet.snacks}
        />
        <FormField
          label="Treats"
          multiline
          onChangeText={(value) => setDiet((current) => (current ? { ...current, treats: value } : current))}
          placeholder="Allowed treats and limits"
          value={diet.treats}
        />
      </Card>

      <AppButton label="Save feeding schedule" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
  },
});
