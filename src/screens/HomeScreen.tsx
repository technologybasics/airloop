import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PRO_TECHNIQUE_IDS, SHOW_PRO_TECHNIQUES, TECHNIQUES, Technique } from '../constants/phases';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  streakDays: number;
  onSelectTechnique: (technique: Technique) => void;
  defaultTechniqueId: string | null;
  onOpenSettings: () => void;
  onOpenProgress: () => void;
};

function TechniqueCard({
  technique,
  isDefault,
  onSelectTechnique,
}: {
  technique: Technique;
  isDefault: boolean;
  onSelectTechnique: (technique: Technique) => void;
}) {
  return (
    <Pressable style={styles.card} onPress={() => onSelectTechnique(technique)}>
      <View style={styles.cardIconWrap}>
        <Feather name={technique.icon as any} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{technique.label}</Text>
        <Text style={styles.cardSubtitle}>{technique.subtitle}</Text>
      </View>
      {isDefault && <Feather name="star" size={14} color={colors.accent} />}
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export function HomeScreen({
  streakDays,
  onSelectTechnique,
  defaultTechniqueId,
  onOpenSettings,
  onOpenProgress,
}: Props) {
  const standardTechniques = TECHNIQUES.filter(
    (technique) => !PRO_TECHNIQUE_IDS.includes(technique.id)
  );
  const proTechniques = TECHNIQUES.filter((technique) =>
    PRO_TECHNIQUE_IDS.includes(technique.id)
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.greetingRow}>
        <View style={styles.greeting}>
          <Text style={styles.greetingSmall}>Good evening</Text>
          <Text style={styles.greetingBig}>Ready to breathe?</Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable
            onPress={onOpenProgress}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="View progress"
          >
            <Feather name="bar-chart-2" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={onOpenSettings}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Feather name="settings" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <Pressable
        style={styles.streakCard}
        onPress={onOpenProgress}
        accessibilityRole="button"
        accessibilityLabel={`${streakDays} day streak, view progress`}
      >
        <View style={styles.streakIconWrap}>
          <Feather name="zap" size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.streakTitle}>{streakDays} day streak</Text>
          <Text style={styles.streakSubtitle}>Keep it going today</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      </Pressable>

      <Text style={styles.sectionLabel}>Techniques</Text>

      {standardTechniques.map((technique) => (
        <TechniqueCard
          key={technique.id}
          technique={technique}
          isDefault={technique.id === defaultTechniqueId}
          onSelectTechnique={onSelectTechnique}
        />
      ))}

      {SHOW_PRO_TECHNIQUES && (
        <>
          <Text style={styles.sectionLabel}>Pro</Text>

          {proTechniques.map((technique) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              isDefault={technique.id === defaultTechniqueId}
              onSelectTechnique={onSelectTechnique}
            />
          ))}
        </>
      )}
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
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {},
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  greetingSmall: { color: colors.textSecondary, fontSize: 13 },
  greetingBig: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '500',
    marginTop: 2,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  streakIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.circleFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  streakSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
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
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.circleFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '500' },
  cardSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
});
