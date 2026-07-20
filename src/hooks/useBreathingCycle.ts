import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Technique } from '../constants/phases';

type CycleState = {
  phaseIndex: number;
  secondsLeft: number;
  cyclesCompleted: number;
  isRunning: boolean;
  isComplete: boolean;
};

/**
 * Drives a breathing session for any technique (box, 4-7-8, future ones).
 * Pass a Technique + total cycle count; the hook handles phase timing,
 * countdown, and completion. UI just reads state and animates off phaseIndex.
 */
export function useBreathingCycle(
  technique: Technique,
  totalCycles: number,
  hapticsEnabled: boolean = true
) {
  const [state, setState] = useState<CycleState>({
    phaseIndex: 0,
    secondsLeft: technique.phases[0].durationSec,
    cyclesCompleted: 0,
    isRunning: false,
    isComplete: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (!prev.isRunning || prev.isComplete) return prev;

      if (prev.secondsLeft > 1) {
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      }

      // Move to next phase
      const nextPhaseIndex = (prev.phaseIndex + 1) % technique.phases.length;
      const nextPhase = technique.phases[nextPhaseIndex];
      const justFinishedCycle = nextPhaseIndex === 0;
      const nextCyclesCompleted = justFinishedCycle
        ? prev.cyclesCompleted + 1
        : prev.cyclesCompleted;

      const isComplete = justFinishedCycle && nextCyclesCompleted >= totalCycles;

      if (hapticsEnabled) {
        Haptics.impactAsync(
          nextPhase.name === 'Hold'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );
      }

      return {
        phaseIndex: nextPhaseIndex,
        secondsLeft: nextPhase.durationSec,
        cyclesCompleted: nextCyclesCompleted,
        isRunning: !isComplete,
        isComplete,
      };
    });
  }, [technique, totalCycles, hapticsEnabled]);

  useEffect(() => {
    if (state.isRunning && !state.isComplete) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state.isRunning, state.isComplete, tick]);

  const appStateRef = useRef(AppState.currentState);
  const wasRunningBeforeBackgroundRef = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const wasBackgrounded = appStateRef.current.match(/inactive|background/);
      const isNowBackgrounded = nextAppState.match(/inactive|background/);

      if (!wasBackgrounded && isNowBackgrounded) {
        setState((prev) => {
          if (prev.isRunning) {
            wasRunningBeforeBackgroundRef.current = true;
            return { ...prev, isRunning: false };
          }
          return prev;
        });
      } else if (wasBackgrounded && nextAppState === 'active') {
        if (wasRunningBeforeBackgroundRef.current) {
          wasRunningBeforeBackgroundRef.current = false;
          setState((prev) => ({ ...prev, isRunning: true }));
        }
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const start = () => setState((prev) => ({ ...prev, isRunning: true }));
  const pause = () => setState((prev) => ({ ...prev, isRunning: false }));
  const reset = () =>
    setState({
      phaseIndex: 0,
      secondsLeft: technique.phases[0].durationSec,
      cyclesCompleted: 0,
      isRunning: false,
      isComplete: false,
    });

  const currentPhase = technique.phases[state.phaseIndex];

  return {
    currentPhase,
    phaseIndex: state.phaseIndex,
    secondsLeft: state.secondsLeft,
    cyclesCompleted: state.cyclesCompleted,
    totalCycles,
    isRunning: state.isRunning,
    isComplete: state.isComplete,
    start,
    pause,
    reset,
  };
}
