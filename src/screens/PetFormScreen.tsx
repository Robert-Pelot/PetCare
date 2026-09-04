import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { FormField } from '../components/FormField';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { cleanDraft, validatePetDraft } from '../domain/pets';
import { colors, radius, spacing } from '../theme';
import type { PetDraft, RootStackParamList } from '../types';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PetForm'>;
  route: RouteProp<RootStackParamList, 'PetForm'>;
}

const emptyDraft: PetDraft = {
  name: '',
  age: '',
  birthdate: '',
  breed: '',
  weight: '',
  photoUri: '',
};

export function PetFormScreen({ navigation, route }: Props) {
  const { selectedPet, addPet, updateSelectedPet } = usePets();
  const isEditing = route.params.mode === 'edit';
  const [draft, setDraft] = useState<PetDraft>(() =>
    isEditing && selectedPet
      ? {
        name: selectedPet.name,
        age: selectedPet.age,
        birthdate: selectedPet.birthdate,
        breed: selectedPet.breed,
        weight: selectedPet.weight,
        photoUri: selectedPet.photoUri,
        }
      : emptyDraft,
  );

  const updateField = (field: keyof PetDraft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const choosePhoto = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        source === 'camera'
          ? 'Camera permission is required to take a pet photo.'
          : 'Photo-library permission is required to choose a pet photo.',
      );
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ['images'],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ['images'],
            quality: 0.8,
          });

    const uri = result.canceled ? null : result.assets[0]?.uri;
    if (uri) updateField('photoUri', uri);
  };

  const save = () => {
    const errors = validatePetDraft(draft);
    if (errors.length) {
      Alert.alert('Check the pet details', errors.join('\n'));
      return;
    }

    const cleaned = cleanDraft(draft);
    if (isEditing) {
      updateSelectedPet(cleaned);
    } else {
      addPet(cleaned);
    }
    navigation.goBack();
  };

  return (
    <Screen>
      <Text style={styles.title}>{isEditing ? 'Edit pet details' : 'Add a new pet'}</Text>

      {draft.photoUri ? (
        <Image source={{ uri: draft.photoUri }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.placeholder]}>
          <Text style={styles.placeholderText}>🐾</Text>
        </View>
      )}

      <View style={styles.photoActions}>
        <AppButton
          label="Take photo"
          onPress={() => choosePhoto('camera')}
          style={styles.photoButton}
          variant="secondary"
        />
        <AppButton
          label="Choose photo"
          onPress={() => choosePhoto('library')}
          style={styles.photoButton}
          variant="secondary"
        />
      </View>

      <FormField
        autoCapitalize="words"
        label="Name *"
        onChangeText={(value) => updateField('name', value)}
        placeholder="Bailey"
        value={draft.name}
      />
      <FormField
        autoCapitalize="words"
        label="Breed"
        onChangeText={(value) => updateField('breed', value)}
        placeholder="Golden retriever"
        value={draft.breed}
      />
      <FormField
        keyboardType="decimal-pad"
        label="Age in years"
        onChangeText={(value) => updateField('age', value)}
        placeholder="4"
        value={draft.age}
      />
      <FormField
        keyboardType="decimal-pad"
        label="Weight in pounds"
        onChangeText={(value) => updateField('weight', value)}
        placeholder="55"
        value={draft.weight}
      />
      <FormField
        autoCapitalize="none"
        label="Birthdate"
        onChangeText={(value) => updateField('birthdate', value)}
        placeholder="YYYY-MM-DD"
        value={draft.birthdate}
      />

      <AppButton label={isEditing ? 'Save changes' : 'Create pet profile'} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
  },
  photo: {
    alignSelf: 'center',
    borderRadius: radius.lg,
    height: 150,
    width: 150,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 54,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photoButton: {
    flex: 1,
  },
});
