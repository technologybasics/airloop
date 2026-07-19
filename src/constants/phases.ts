export type Phase = {
  name: 'Inhale' | 'Hold' | 'Exhale';
  durationSec: number;
  scale: number; // target scale for the animated circle
};

export type Technique = {
  id: string;
  label: string;
  subtitle: string;
  icon: string; // tabler icon name, for reference in UI
  defaultCycles: number;
  phases: Phase[];
};

export const BOX_BREATHING: Technique = {
  id: 'box',
  label: 'Box breathing',
  subtitle: '4-4-4-4 · calm and focus',
  icon: 'square',
  defaultCycles: 8,
  phases: [
    { name: 'Inhale', durationSec: 4, scale: 1.7 },
    { name: 'Hold', durationSec: 4, scale: 1.7 },
    { name: 'Exhale', durationSec: 4, scale: 1 },
    { name: 'Hold', durationSec: 4, scale: 1 },
  ],
};

export const FOUR_SEVEN_EIGHT: Technique = {
  id: '478',
  label: '4-7-8 breathing',
  subtitle: '4-7-8 · wind down and sleep',
  icon: 'moon',
  defaultCycles: 4,
  phases: [
    { name: 'Inhale', durationSec: 4, scale: 1.7 },
    { name: 'Hold', durationSec: 7, scale: 1.7 },
    { name: 'Exhale', durationSec: 8, scale: 1 },
  ],
};

export const COHERENT_BREATHING: Technique = {
  id: 'coherent',
  label: 'Coherent breathing',
  subtitle: '5-5 · balance and coherence',
  icon: 'activity',
  defaultCycles: 12,
  phases: [
    { name: 'Inhale', durationSec: 5, scale: 1.7 },
    { name: 'Exhale', durationSec: 5, scale: 1 },
  ],
};

export const CALM_BREATHING: Technique = {
  id: 'calm',
  label: 'Calm breathing',
  subtitle: '6-6 · slow and steady',
  icon: 'wind',
  defaultCycles: 10,
  phases: [
    { name: 'Inhale', durationSec: 6, scale: 1.7 },
    { name: 'Exhale', durationSec: 6, scale: 1 },
  ],
};

export const DEEP_RESET: Technique = {
  id: 'deepreset',
  label: 'Deep reset',
  subtitle: '4-4-6-2 · release tension',
  icon: 'sunrise',
  defaultCycles: 8,
  phases: [
    { name: 'Inhale', durationSec: 4, scale: 1.7 },
    { name: 'Hold', durationSec: 4, scale: 1.7 },
    { name: 'Exhale', durationSec: 6, scale: 1 },
    { name: 'Hold', durationSec: 2, scale: 1 },
  ],
};

export const ENERGIZE: Technique = {
  id: 'energize',
  label: 'Energize',
  subtitle: '2-0-2-0 · quick energizing breath',
  icon: 'zap',
  defaultCycles: 20,
  phases: [
    { name: 'Inhale', durationSec: 2, scale: 1.7 },
    { name: 'Exhale', durationSec: 2, scale: 1 },
  ],
};

export const TECHNIQUES: Technique[] = [
  BOX_BREATHING,
  FOUR_SEVEN_EIGHT,
  COHERENT_BREATHING,
  CALM_BREATHING,
  DEEP_RESET,
  ENERGIZE,
];
