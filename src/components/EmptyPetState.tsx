import { StyleSheet, Text } from 'react-native';

import { colors, spacing } from '../theme';
import { AppButton } from './AppButton';
import { Card } from './Card';

export function EmptyPetState({ onAddPet }: { onAddPet: () => void }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.emoji}>🐾</Text>
      <Text style={styles.title}>Add your first pet</Text>
      <Text style={styles.copy}>
        Create a profile to start tracking care, health notes, feeding details, and appointments.
      </Text>
      <AppButton label="Add a pet" onPress={onAddPet} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  emoji: {
    fontSize: 42,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});
