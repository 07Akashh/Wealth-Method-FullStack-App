const baseUnit = 4;

/** 
 * The Wealth Method – Spacing System
 * Based on a 4px grid: spacing.sm (8px), spacing.md (16px), spacing.lg (24px)
 * Also usable as a function: theme.spacing(2) = 8px
 */
type SpacingFunction = {
  (factor: number): number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

const spacingFn = (factor: number): number => factor * baseUnit;

export const spacing: SpacingFunction = Object.assign(spacingFn, {
  xs:  4,   // 1x base
  sm:  8,   // 2x base
  md:  16,  // 4x base
  lg:  24,  // 6x base
  xl:  32,  // 8x base
  xxl: 48,  // 12x base
});

/**
 * Border radius — favour xl/lg for "friendly-sophisticated" feel.
 * "No-Line" rule: corners do more visual work than lines.
 */
export const radius = {
  xs:   6,
  sm:   10,
  /** Standard Components (Buttons/Inputs) */
  md:   12,
  lg:   20,
  /** Large Components (Cards/Modals) */
  xl:   24,
  xxl:  32,
  /** Small Components (Chips/Tags) */
  full: 9999,
} as const;
