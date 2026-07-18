// Ocean Breath theme — matches the UI mockups
export const colors = {
  background: '#0D1F1E',
  card: '#132E2C',
  cardBorder: '#2A4A48',
  cardBorderDashed: '#2A4A48',
  ring: '#2A4A48',
  circleFill: '#1B4B4A',
  primary: '#7FC7C2', // headings, active nav, icons
  accent: '#FF8B7B', // CTAs, active dots — use sparingly
  textPrimary: '#F7F9F9',
  textSecondary: '#7FA7A3',
  textMuted: '#5F8A86',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 28,
  full: 999,
} as const;
