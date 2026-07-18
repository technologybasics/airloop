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

export const TECHNIQUES: Technique[] = [BOX_BREATHING, FOUR_SEVEN_EIGHT];
