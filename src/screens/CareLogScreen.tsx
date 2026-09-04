import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { EmptyPetState } from '../components/EmptyPetState';
import { FormField } from '../components/FormField';
import { PetSelector } from '../components/PetSelector';
import { Screen } from '../components/Screen';
import { usePets } from '../context/PetContext';
import { createId, groupCareLogs } from '../domain/pets';
import { colors, radius, spacing } from '../theme';
import type { MainTabParamList, RootStackParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Care Log'>;

export function CareLogScreen({ navigation }: Props) {
  const { selectedPet, updateSelectedPet } = usePets();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [customEntry, setCustomEntry] = useState('');

  if (!selectedPet) {
    return (
      <Screen>
        <EmptyPetState
          onAddPet={() => rootNavigation?.navigate('PetForm', { mode: 'add' })}
        />
      </Screen>
    );
  }

  const groups = groupCareLogs(selectedPet.logs);

  const addLog = (type: string) => {
    const cleaned = type.trim();
    if (!cleaned) return;
    updateSelectedPet({
      logs: [
        ...selectedPet.logs,
        { id: createId(), type: cleaned, timestamp: new Date().toISOString() },
      ],
    });
  };

  const saveCustomEntry = () => {
    addLog(customEntry);
    if (!customEntry.trim()) return;
    setCustomEntry('');
    setModalVisible(false);
  };

  return (
    <Screen>
      <Text style={styles.title}>Care log</Text>
      <PetSelector />
      <Card>
        <Text style={styles.cardTitle}>Quick entry for {selectedPet.name}</Text>
        <View style={styles.quickActions}>
          <AppButton label="Log walk" onPress={() => addLog('Walk')} style={styles.action} />
          <AppButton label="Log feeding" onPress={() => addLog('Feeding')} style={styles.action} />
        </View>
        <AppButton
          label="Add a custom entry"
          onPress={() => setModalVisible(true)}
          variant="secondary"
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Recent care</Text>
        {Object.keys(groups).length ? (
          Object.entries(groups).map(([dateLabel, logs]) => (
            <View key={dateLabel} style={styles.logGroup}>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              {logs.map((log) => (
                <View key={log.id} style={styles.logRow}>
                  <Text style={styles.time}>
                    {log.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.logType}>{log.type}</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No care entries yet.</Text>
        )}
      </Card>

      <Modal
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        transparent
        visible={modalVisible}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Custom care entry</Text>
            <FormField
              autoFocus
              label="What happened?"
              onChangeText={setCustomEntry}
              placeholder="Medication, bath, playtime…"
              value={customEntry}
            />
            <AppButton label="Save entry" onPress={saveCustomEntry} />
            <Pressable onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  action: {
    flex: 1,
  },
  logGroup: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  dateLabel: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  logRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: 5,
  },
  time: {
    color: colors.muted,
    fontSize: 14,
    width: 76,
  },
  logType: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 30, 26, 0.62)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: spacing.md,
    padding: spacing.lg,
    width: '100%',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  cancelButton: {
    padding: spacing.sm,
  },
  cancelLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
