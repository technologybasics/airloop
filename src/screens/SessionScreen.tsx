import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BreathingCircle } from '../components/BreathingCircle';
import { useBreathingCycle } from '../hooks/useBreathingCycle';
import { Technique } from '../constants/phases';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  technique: Technique;
  onClose: () => void;
  onComplete: (summary: { techniqueId: string; cyclesCompleted: number }) => void;
};

export function SessionScreen({ technique, onClose, onComplete }: Props) {
  const {
    currentPhase,
    phaseIndex,
    secondsLeft,
    cyclesCompleted,
    totalCycles,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
  } = useBreathingCycle(technique, technique.defaultCycles);

  const hasCompletedRef = React.useRef(false);

  React.useEffect(() => {
    // autostart when the screen mounts
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    React.useEffect(() => {
        if (isComplete && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete({ techniqueId: technique.id, cyclesCompleted: totalCycles });
        }
    }, [isComplete]);

  const remainingCycles = totalCycles - cyclesCompleted;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Feather name="chevron-left" size={20} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{technique.label}</Text>
        <Feather name="settings" size={18} color={colors.primary} />
      </View>

      <View style={styles.circleWrap}>
        <BreathingCircle phase={currentPhase} secondsLeft={secondsLeft} />
      </View>

      <View style={styles.dots}>
        {technique.phases.map((p, i) => (
          <View
            key={`${p.name}-${i}`}
            style={[
              styles.dot,
              i === phaseIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.progressText}>
        Cycle {Math.min(cyclesCompleted + 1, totalCycles)} of {totalCycles}
        {'  ·  '}
        {remainingCycles} to go
      </Text>

      <View style={styles.controls}>
          <Pressable
              onPress={() => {
                  hasCompletedRef.current = false;
                  reset();
              }}
              hitSlop={12}
          >
          <Feather name="refresh-cw" size={20} color={colors.textSecondary} />
        </Pressable>
        <Pressable
          onPress={isRunning ? pause : start}
          style={styles.playButton}
        >
          <Feather
            name={isRunning ? 'pause' : 'play'}
            size={22}
            color={colors.background}
          />
        </Pressable>
        <Pressable onPress={onClose} hitSlop={12}>
          <Feather name="x" size={20} color={colors.textSecondary} />
        </Pressable>
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
  circleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  dotInactive: {
    backgroundColor: colors.cardBorder,
  },
  progressText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
