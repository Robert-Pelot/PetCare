import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { EmptyPetState } from '../components/EmptyPetState';
import { PetSelector } from '../components/PetSelector';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { upcomingAppointments } from '../domain/pets';
import { colors, radius, spacing } from '../theme';
import type { MainTabParamList, RootStackParamList } from '../types';

type Navigation = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedPet, isLoading, error } = usePets();

  if (isLoading) {
    return (
      <Screen>
        <Text style={styles.status}>Loading your pet information…</Text>
      </Screen>
    );
  }

  if (!selectedPet) {
    return (
      <Screen>
        <Text style={styles.eyebrow}>PETCARE</Text>
        <Text style={styles.heading}>Care organized in one place.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <EmptyPetState
          onAddPet={() => rootNavigation?.navigate('PetForm', { mode: 'add' })}
        />
      </Screen>
    );
  }

  const upcoming = upcomingAppointments(selectedPet.appointments).slice(0, 3);

  return (
    <Screen>
      <View>
        <Text style={styles.eyebrow}>PETCARE</Text>
        <Text style={styles.heading}>Hello, {selectedPet.name}.</Text>
        <Text style={styles.subheading}>Here’s the latest care overview.</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PetSelector />

      <Card style={styles.heroCard}>
        {selectedPet.photoUri ? (
          <Image source={{ uri: selectedPet.photoUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={styles.photoEmoji}>🐾</Text>
          </View>
        )}
        <View style={styles.heroCopy}>
          <Text style={styles.petName}>{selectedPet.name}</Text>
          <Text style={styles.petDetail}>{selectedPet.breed || 'Breed not entered'}</Text>
          <Text style={styles.petDetail}>
            {selectedPet.age ? `${selectedPet.age} years` : 'Age not entered'}
            {selectedPet.weight ? ` · ${selectedPet.weight} lb` : ''}
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Upcoming appointments</Text>
        {upcoming.length ? (
          upcoming.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentRow}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateMonth}>
                  {new Date(appointment.date).toLocaleDateString(undefined, { month: 'short' })}
                </Text>
                <Text style={styles.dateDay}>{new Date(appointment.date).getDate()}</Text>
              </View>
              <View style={styles.appointmentCopy}>
                <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                <Text style={styles.petDetail}>
                  {new Date(appointment.date).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCopy}>Nothing scheduled yet.</Text>
        )}
      </Card>

      <AppButton
        label="Add another pet"
        onPress={() => rootNavigation?.navigate('PetForm', { mode: 'add' })}
        variant="secondary"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  heading: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginTop: spacing.xs,
  },
  subheading: {
    color: colors.muted,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  status: {
    color: colors.muted,
    fontSize: 16,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  heroCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  photo: {
    borderRadius: radius.md,
    height: 96,
    width: 96,
  },
  photoPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
  },
  photoEmoji: {
    fontSize: 38,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  petName: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
  },
  petDetail: {
    color: colors.muted,
    fontSize: 15,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  appointmentRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: 12,
  },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    minWidth: 54,
    padding: spacing.sm,
  },
  dateMonth: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dateDay: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  appointmentCopy: {
    flex: 1,
  },
  appointmentTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
});
