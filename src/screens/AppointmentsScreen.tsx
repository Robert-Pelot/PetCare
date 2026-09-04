import DateTimePickerModal from 'react-native-modal-datetime-picker';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { EmptyPetState } from '../components/EmptyPetState';
import { FormField } from '../components/FormField';
import { PetSelector } from '../components/PetSelector';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { createId, sortAppointments } from '../domain/pets';
import { cancelReminder, scheduleAppointmentReminder } from '../services/notifications';
import { colors, radius, spacing } from '../theme';
import type { AppointmentKind, MainTabParamList, RootStackParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Appointments'>;

export function AppointmentsScreen({ navigation }: Props) {
  const { selectedPet, updateSelectedPet } = usePets();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const [kind, setKind] = useState<AppointmentKind>('Veterinary');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [minimumDate] = useState(() => new Date());
  const [pickerDefaultDate] = useState(() => new Date(Date.now() + 60 * 60 * 1000));
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!selectedPet) {
    return (
      <Screen>
        <EmptyPetState
          onAddPet={() => rootNavigation?.navigate('PetForm', { mode: 'add' })}
        />
      </Screen>
    );
  }

  const appointments = sortAppointments(selectedPet.appointments);

  const saveAppointment = async () => {
    if (!date || date.getTime() <= Date.now()) {
      Alert.alert('Choose a future date', 'Appointments must be scheduled in the future.');
      return;
    }

    setSaving(true);
    const appointmentTitle = title.trim() || `${kind} appointment`;
    let reminderId: string | undefined;

    try {
      reminderId = await scheduleAppointmentReminder(selectedPet.name, appointmentTitle, date);
    } catch {
      Alert.alert(
        'Appointment saved without a reminder',
        'This device could not schedule the local notification.',
      );
    }

    updateSelectedPet({
      appointments: [
        ...selectedPet.appointments,
        {
          id: createId(),
          title: appointmentTitle,
          kind,
          date: date.toISOString(),
          ...(reminderId ? { reminderId } : {}),
        },
      ],
    });
    setDate(null);
    setTitle('');
    setSaving(false);
  };

  const removeAppointment = (appointmentId: string, reminderId?: string) => {
    Alert.alert('Delete this appointment?', 'Any associated reminder will also be removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          cancelReminder(reminderId).catch(() => undefined);
          updateSelectedPet({
            appointments: selectedPet.appointments.filter(
              (appointment) => appointment.id !== appointmentId,
            ),
          });
        },
      },
    ]);
  };

  return (
    <Screen>
      <Text style={styles.title}>Appointments</Text>
      <PetSelector />

      <Card>
        <Text style={styles.cardTitle}>Schedule for {selectedPet.name}</Text>
        <View style={styles.kindRow}>
          {(['Veterinary', 'Grooming'] as AppointmentKind[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setKind(option)}
              style={[styles.kindChip, kind === option && styles.selectedKind]}
            >
              <Text style={[styles.kindLabel, kind === option && styles.selectedKindLabel]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <FormField
          label="Appointment description"
          onChangeText={setTitle}
          placeholder={`${kind} appointment`}
          value={title}
        />
        <AppButton
          label={date ? date.toLocaleString() : 'Choose date and time'}
          onPress={() => setPickerVisible(true)}
          variant="secondary"
          style={styles.dateButton}
        />
        <DateTimePickerModal
          date={date ?? pickerDefaultDate}
          isVisible={pickerVisible}
          minimumDate={minimumDate}
          mode="datetime"
          onCancel={() => setPickerVisible(false)}
          onConfirm={(chosenDate) => {
            setDate(chosenDate);
            setPickerVisible(false);
          }}
        />
        <AppButton
          disabled={saving}
          label={saving ? 'Saving…' : 'Save appointment'}
          onPress={saveAppointment}
          style={styles.saveButton}
        />
        <Text style={styles.reminderNote}>
          PetCare will request notification permission when a future reminder can be scheduled.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>All appointments</Text>
        {appointments.length ? (
          appointments.map((appointment) => (
            <Pressable
              accessibilityHint="Opens a confirmation to delete this appointment"
              key={appointment.id}
              onLongPress={() => removeAppointment(appointment.id, appointment.reminderId)}
              style={styles.appointmentRow}
            >
              <View style={styles.appointmentCopy}>
                <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                <Text style={styles.meta}>
                  {appointment.kind} · {new Date(appointment.date).toLocaleString()}
                </Text>
              </View>
              <Pressable
                accessibilityLabel={`Delete ${appointment.title}`}
                accessibilityRole="button"
                onPress={() => removeAppointment(appointment.id, appointment.reminderId)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteLabel}>Delete</Text>
              </Pressable>
            </Pressable>
          ))
        ) : (
          <Text style={styles.empty}>No appointments have been added.</Text>
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
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  kindRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  kindChip: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  selectedKind: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  kindLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  selectedKindLabel: {
    color: colors.white,
  },
  dateButton: {
    marginTop: spacing.md,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  reminderNote: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  appointmentRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 12,
  },
  appointmentCopy: {
    flex: 1,
  },
  appointmentTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteLabel: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
    marginTop: spacing.md,
  },
});
