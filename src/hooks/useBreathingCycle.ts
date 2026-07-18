import { useCallback, useEffect, useRef, useState } from 'react';
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
export function useBreathingCycle(technique: Technique, totalCycles: number) {
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
      const justFinishedCycle = nextPhaseIndex === 0;
      const nextCyclesCompleted = justFinishedCycle
        ? prev.cyclesCompleted + 1
        : prev.cyclesCompleted;

      const isComplete = justFinishedCycle && nextCyclesCompleted >= totalCycles;

      return {
        phaseIndex: nextPhaseIndex,
        secondsLeft: technique.phases[nextPhaseIndex].durationSec,
        cyclesCompleted: nextCyclesCompleted,
        isRunning: !isComplete,
        isComplete,
      };
    });
  }, [technique, totalCycles]);

  useEffect(() => {
    if (state.isRunning && !state.isComplete) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state.isRunning, state.isComplete, tick]);

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
