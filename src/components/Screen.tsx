import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, type ScrollViewProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

export function Screen({ children, scroll = true, contentContainerStyle }: ScreenProps) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
