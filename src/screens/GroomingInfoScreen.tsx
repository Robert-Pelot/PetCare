import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { colors, spacing } from '../theme';

export function GroomingInfoScreen() {
  const { selectedPet, updateSelectedPet } = usePets();
  const [instructions, setInstructions] = useState(
    () => selectedPet?.groomingInstructions ?? '',
  );
  const [groomer, setGroomer] = useState(() => selectedPet?.groomerInformation ?? '');

  if (!selectedPet) {
    return (
      <Screen>
        <Text style={styles.empty}>Select or add a pet first.</Text>
      </Screen>
    );
  }

  const save = () => {
    updateSelectedPet({
      groomingInstructions: instructions.trim(),
      groomerInformation: groomer.trim(),
    });
    Alert.alert('Grooming details saved', `${selectedPet.name}’s information is up to date.`);
  };

  return (
    <Screen>
      <Text style={styles.title}>Grooming information</Text>
      <Text style={styles.subtitle}>Care instructions and provider details for {selectedPet.name}</Text>

      <Card>
        <FormField
          label="Grooming instructions"
          multiline
          onChangeText={setInstructions}
          placeholder="Bathing, brushing, trimming, products to avoid…"
          value={instructions}
        />
        <FormField
          label="Groomer information"
          multiline
          onChangeText={setGroomer}
          placeholder="Business name, phone number, address, notes…"
          value={groomer}
        />
      </Card>

      <AppButton label="Save grooming information" onPress={save} />

      <Card>
        <Text style={styles.noteTitle}>Scheduling</Text>
        <Text style={styles.note}>
          Add grooming visits from the Appointments tab. PetCare keeps veterinary and grooming
          visits together and can schedule a reminder 30 minutes beforehand.
        </Text>
      </Card>
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
    lineHeight: 21,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  note: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
  },
});
