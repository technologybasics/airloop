import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Phase } from '../constants/phases';
import { colors } from '../constants/theme';

type Props = {
  phase: Phase;
  secondsLeft: number;
};

const BASE_SIZE = 120;
const RING_SIZE = 220;

export function BreathingCircle({ phase, secondsLeft }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: phase.scale,
      duration: phase.durationSec * 1000,
      useNativeDriver: true,
    }).start();
  }, [phase, scaleAnim]);

  return (
    <View style={styles.wrap}>
      <View style={styles.ring} />
      <Animated.View
        style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.phaseLabel}>{phase.name}</Text>
        <Text style={styles.count}>{secondsLeft}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.ring,
  },
  circle: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderRadius: BASE_SIZE / 2,
    backgroundColor: colors.circleFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  count: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '500',
    marginTop: 4,
  },
});
