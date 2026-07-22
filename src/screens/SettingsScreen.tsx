import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PRO_TECHNIQUE_IDS, SHOW_PRO_TECHNIQUES, TECHNIQUES } from '../constants/phases';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  onClose: () => void;
  cycleCounts: Record<string, number>;
  onChangeCycleCount: (techniqueId: string, count: number) => void;
  hapticsEnabled: boolean;
  onChangeHapticsEnabled: (enabled: boolean) => void;
};

const MIN_CYCLES = 1;
const MAX_CYCLES = 50;

export function SettingsScreen({
  onClose,
  cycleCounts,
  onChangeCycleCount,
  hapticsEnabled,
  onChangeHapticsEnabled,
}: Props) {
  const visibleTechniques = SHOW_PRO_TECHNIQUES
    ? TECHNIQUES
    : TECHNIQUES.filter((technique) => !PRO_TECHNIQUE_IDS.includes(technique.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={20} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={styles.sectionLabel}>Haptics</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Phase transition taps</Text>
          <Text style={styles.rowSubtitle}>Feel a tap when the phase changes</Text>
        </View>
        <Switch
          value={hapticsEnabled}
          onValueChange={onChangeHapticsEnabled}
          trackColor={{ false: colors.cardBorder, true: colors.accent }}
          thumbColor={colors.textPrimary}
        />
      </View>

      <Text style={styles.sectionLabel}>Cycle count</Text>
      {visibleTechniques.map((technique) => {
        const count = cycleCounts[technique.id] ?? technique.defaultCycles;
        return (
          <View key={technique.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{technique.label}</Text>
              <Text style={styles.rowSubtitle}>{technique.subtitle}</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepperButton}
                hitSlop={8}
                onPress={() => onChangeCycleCount(technique.id, Math.max(MIN_CYCLES, count - 1))}
                accessibilityRole="button"
                accessibilityLabel={`Decrease ${technique.label} cycle count`}
              >
                <Feather name="minus" size={16} color={colors.primary} />
              </Pressable>
              <Text style={styles.stepperValue}>{count}</Text>
              <Pressable
                style={styles.stepperButton}
                hitSlop={8}
                onPress={() => onChangeCycleCount(technique.id, Math.min(MAX_CYCLES, count + 1))}
                accessibilityRole="button"
                accessibilityLabel={`Increase ${technique.label} cycle count`}
              >
                <Feather name="plus" size={16} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '500' },
  rowSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.circleFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
});
