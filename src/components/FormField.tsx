import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';

import { colors, radius, spacing } from '../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
}

export function FormField({ label, multiline, style, ...props }: FormFieldProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        placeholderTextColor={colors.muted}
        style={[styles.input, multiline && styles.multiline, style]}
        {...props}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
});
