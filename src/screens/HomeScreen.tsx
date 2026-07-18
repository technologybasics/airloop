import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TECHNIQUES, Technique } from '../constants/phases';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  streakDays: number;
  onSelectTechnique: (technique: Technique) => void;
};

export function HomeScreen({ streakDays, onSelectTechnique }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingSmall}>Good evening</Text>
        <Text style={styles.greetingBig}>Ready to breathe?</Text>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakIconWrap}>
          <Feather name="zap" size={18} color={colors.accent} />
        </View>
        <View>
          <Text style={styles.streakTitle}>{streakDays} day streak</Text>
          <Text style={styles.streakSubtitle}>Keep it going today</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Techniques</Text>

      {TECHNIQUES.map((technique) => (
        <Pressable
          key={technique.id}
          style={styles.card}
          onPress={() => onSelectTechnique(technique)}
        >
          <View style={styles.cardIconWrap}>
            <Feather
              name={technique.id === 'box' ? 'square' : 'moon'}
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{technique.label}</Text>
            <Text style={styles.cardSubtitle}>{technique.subtitle}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.textMuted} />
        </Pressable>
      ))}

      <View style={[styles.card, styles.cardGhost]}>
        <View style={[styles.cardIconWrap, { backgroundColor: colors.card }]}>
          <Feather name="plus" size={20} color={colors.textMuted} />
        </View>
        <View>
          <Text style={styles.cardGhostTitle}>More techniques</Text>
          <Text style={styles.cardGhostSubtitle}>
            Mindfulness and relaxation, coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  greeting: { marginBottom: spacing.lg },
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
  cardGhost: { opacity: 0.6, borderStyle: 'dashed' },
  cardGhostTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  cardGhostSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
});
