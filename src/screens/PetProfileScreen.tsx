import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { EmptyPetState } from '../components/EmptyPetState';
import { PetSelector } from '../components/PetSelector';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { colors, radius, spacing } from '../theme';
import type { MainTabParamList, RootStackParamList } from '../types';

type Navigation = BottomTabNavigationProp<MainTabParamList, 'Profile'>;

export function PetProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedPet, deleteSelectedPet } = usePets();

  if (!selectedPet) {
    return (
      <Screen>
        <EmptyPetState
          onAddPet={() => rootNavigation?.navigate('PetForm', { mode: 'add' })}
        />
      </Screen>
    );
  }

  const confirmDelete = () => {
    Alert.alert(
      `Delete ${selectedPet.name}?`,
      'This removes the profile and all of its records from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteSelectedPet },
      ],
    );
  };

  return (
    <Screen>
      <PetSelector />
      <Card style={styles.profileCard}>
        {selectedPet.photoUri ? (
          <Image source={{ uri: selectedPet.photoUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.placeholder]}>
            <Text style={styles.placeholderText}>🐾</Text>
          </View>
        )}
        <Text style={styles.name}>{selectedPet.name}</Text>
        <Text style={styles.breed}>{selectedPet.breed || 'Breed not entered'}</Text>
        <View style={styles.detailGrid}>
          <Detail label="Age" value={selectedPet.age ? `${selectedPet.age} years` : '—'} />
          <Detail label="Weight" value={selectedPet.weight ? `${selectedPet.weight} lb` : '—'} />
          <Detail label="Birthdate" value={selectedPet.birthdate || '—'} />
        </View>
      </Card>

      <AppButton
        label="Edit pet details"
        onPress={() => rootNavigation?.navigate('PetForm', { mode: 'edit' })}
      />
      <AppButton
        label="Medical history"
        onPress={() => rootNavigation?.navigate('MedicalHistory')}
        variant="secondary"
      />
      <AppButton
        label="Diet and feeding schedule"
        onPress={() => rootNavigation?.navigate('DietSchedule')}
        variant="secondary"
      />
      <AppButton
        label="Grooming information"
        onPress={() => rootNavigation?.navigate('GroomingInfo')}
        variant="secondary"
      />
      <AppButton label="Delete this pet" onPress={confirmDelete} variant="danger" />
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  photo: {
    borderRadius: 70,
    height: 140,
    width: 140,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 54,
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  breed: {
    color: colors.muted,
    fontSize: 16,
  },
  detailGrid: {
    alignSelf: 'stretch',
    borderRadius: radius.sm,
    flexDirection: 'row',
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  detail: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 72,
    padding: spacing.sm,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
