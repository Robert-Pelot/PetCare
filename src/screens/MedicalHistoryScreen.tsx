import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { createId, isValidDateInput } from '../domain/pets';
import { colors, spacing } from '../theme';

export function MedicalHistoryScreen() {
  const { selectedPet, updateSelectedPet } = usePets();
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');

  if (!selectedPet) {
    return (
      <Screen>
        <Text style={styles.empty}>Select or add a pet first.</Text>
      </Screen>
    );
  }

  const addRecord = () => {
    if (!isValidDateInput(date)) {
      Alert.alert('Check the date', 'Enter a real date in YYYY-MM-DD format.');
      return;
    }
    if (!details.trim()) {
      Alert.alert('Add record details', 'Describe the visit, treatment, or health note.');
      return;
    }

    updateSelectedPet({
      medicalHistory: [
        ...selectedPet.medicalHistory,
        { id: createId(), date, details: details.trim() },
      ],
    });
    setDate('');
    setDetails('');
  };

  const records = [...selectedPet.medicalHistory].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  return (
    <Screen>
      <Text style={styles.title}>Medical history</Text>
      <Text style={styles.subtitle}>Health records for {selectedPet.name}</Text>

      <Card>
        <Text style={styles.cardTitle}>Add a record</Text>
        <FormField
          autoCapitalize="none"
          label="Date"
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          value={date}
        />
        <FormField
          label="Details"
          multiline
          onChangeText={setDetails}
          placeholder="Vaccination, medication, veterinary visit…"
          value={details}
        />
        <AppButton label="Save medical record" onPress={addRecord} style={styles.saveButton} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Records</Text>
        {records.length ? (
          records.map((record) => (
            <View key={record.id} style={styles.record}>
              <Text style={styles.recordDate}>{record.date}</Text>
              <Text style={styles.recordDetails}>{record.details}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No medical records have been added.</Text>
        )}
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
  },
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  saveButton: {
    marginTop: spacing.md,
  },
  record: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  recordDate: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  recordDetails: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
    marginTop: spacing.md,
  },
});
