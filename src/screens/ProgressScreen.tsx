import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getSessions, toCalendarDay } from '../services/sessionStore';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  onClose: () => void;
};

const DAYS_IN_GRID = 56; // last 8 weeks
const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildGridDays(): Date[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (DAYS_IN_GRID - 1));

  return Array.from({ length: DAYS_IN_GRID }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function ProgressScreen({ onClose }: Props) {
  const [activeDays, setActiveDays] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    (async () => {
      try {
        const sessions = await getSessions();
        setActiveDays(new Set(sessions.map((s) => toCalendarDay(new Date(s.completedAt)))));
      } catch (error) {
        console.error('Could not load sessions for progress screen:', error);
      }
    })();
  }, []);

  const days = React.useMemo(buildGridDays, []);
  const activeCount = days.filter((d) => activeDays.has(toCalendarDay(d))).length;
  const weekdayHeader = React.useMemo(() => {
    const startWeekday = days[0].getDay();
    return Array.from({ length: 7 }, (_, c) => WEEKDAY_LETTERS[(startWeekday + c) % 7]);
  }, [days]);

  const rows: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

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
        <Text style={styles.headerTitle}>Progress</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={styles.subtitle}>
        {activeCount} of last {DAYS_IN_GRID} days practiced
      </Text>

      <View style={styles.weekdayRow}>
        {weekdayHeader.map((letter, i) => (
          <Text key={i} style={styles.weekdayLabel}>
            {letter}
          </Text>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {row.map((day) => {
            const isActive = activeDays.has(toCalendarDay(day));
            return (
              <View
                key={day.toISOString()}
                style={[styles.cell, isActive ? styles.cellActive : styles.cellInactive]}
              />
            );
          })}
        </View>
      ))}
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
    marginBottom: spacing.lg,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  weekdayRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radii.sm / 2,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
  },
  cellActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  cellInactive: {
    backgroundColor: colors.card,
  },
});
