import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getSessions, toCalendarDay } from '../services/sessionStore';
import { useAppSettings } from '../context/AppSettingsContext';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  onClose: () => void;
};

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Re-index JS's Sunday-first getDay() (0-6) to Monday-first (0-6).
function mondayIndex(jsWeekday: number): number {
  return (jsWeekday + 6) % 7;
}

export function ProgressScreen({ onClose }: Props) {
  const { streakDays } = useAppSettings();
  const [activeDays, setActiveDays] = React.useState<Set<string>>(new Set());
  const [visibleMonth, setVisibleMonth] = React.useState(() => startOfMonth(new Date()));

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

  const today = new Date();
  const isCurrentMonth =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();

  const weeks = React.useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = mondayIndex(new Date(year, month, 1).getDay());

    const cells: (Date | null)[] = [
      ...Array.from({ length: leadingBlanks }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];
    const trailingBlanks = (7 - (cells.length % 7)) % 7;
    cells.push(...Array.from({ length: trailingBlanks }, () => null));

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [visibleMonth]);

  const practicedCount = React.useMemo(
    () =>
      weeks
        .flat()
        .filter((d): d is Date => d !== null)
        .filter((d) => activeDays.has(toCalendarDay(d))).length,
    [weeks, activeDays]
  );

  const goToPreviousMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

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

      <View style={styles.streakCard}>
        <View style={styles.streakIconWrap}>
          <Feather name="zap" size={18} color={colors.accent} />
        </View>
        <View>
          <Text style={styles.streakTitle}>{streakDays} day streak</Text>
          <Text style={styles.streakSubtitle}>Keep it going today</Text>
        </View>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <Pressable
            onPress={goToPreviousMonth}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
          >
            <Feather name="chevron-left" size={20} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.monthLabel}>
            {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          </Text>
          <Pressable
            onPress={goToNextMonth}
            hitSlop={12}
            disabled={isCurrentMonth}
            accessibilityRole="button"
            accessibilityLabel="Next month"
          >
            <Feather
              name="chevron-right"
              size={20}
              color={isCurrentMonth ? colors.textMuted : colors.textSecondary}
            />
          </Pressable>
        </View>

        <Text style={styles.practicedLabel}>
          {practicedCount} day{practicedCount === 1 ? '' : 's'} practiced
        </Text>

        <View style={styles.weekdayRow}>
          {WEEKDAY_LETTERS.map((letter, i) => (
            <Text key={i} style={styles.weekdayLabel}>
              {letter}
            </Text>
          ))}
        </View>

        {weeks.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((day, cellIndex) => {
              if (!day) {
                return <View key={cellIndex} style={styles.cell} />;
              }
              const isActive = activeDays.has(toCalendarDay(day));
              const isToday = isSameDay(day, today);
              return (
                <View key={cellIndex} style={styles.cell}>
                  <View
                    style={[
                      styles.dayCircle,
                      isActive && styles.dayCircleActive,
                      isToday && !isActive && styles.dayCircleToday,
                    ]}
                  >
                    <Text style={styles.dayNumber}>{day.getDate()}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
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
  calendarCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  monthLabel: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  practicedLabel: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayNumber: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
