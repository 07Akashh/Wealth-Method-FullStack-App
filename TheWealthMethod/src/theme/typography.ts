/**
 * The Architectural Finance Method – Typography System
 * High-contrast editorial scale using Inter for extreme hierarchy.
 */
export const typography = {
  /**
   * Font families — Inter is the primary hero of the private bank aesthetic.
   */
  fontFamily: {
    // Inter handles both display and body with weight shifts
    displayBold:    "Inter_700Bold",
    headlineBold:   "Inter_700Bold",
    headlineSemi:   "Inter_600SemiBold",
    titleMedium:    "Inter_500Medium",
    bodyRegular:    "Inter_400Regular",
    bodyMedium:     "Inter_500Medium",
    bodySemibold:   "Inter_600SemiBold",
    // Fallbacks
    regular:   "System",
    medium:    "System",
    semibold:  "System",
    bold:      "System",
  },

  /**
   * Font size scale (sp – scaled pixels)
   * Designed for the "Editorial Voice"
   */
  fontSize: {
    displayLg:  48,  // Hero Wealth Totals
    displayMd:  38,  // Large Balances
    displaySm:  32,  // Card Balances
    headlineSm: 24,  // Section Openers (1.5rem)
    titleLg:    18,  // Module Titles
    titleMd:    16,  // Primary Metadata
    bodyMd:     14,  // Workhorse Body (0.875rem)
    bodySemibold: 14, // Semibold weight size (matching bodyMd)
    bodySm:     13,  // Subtle Body
    labelSm:    11,  // Secondary Metadata (0.6875rem)
    
    // Legacy mapping
    xs:  11,
    sm:  13,
    md:  14,
    lg:  18,
    xl:  24,
    xxl: 38,
  },

  /**
   * Letter spacing
   * Display: tight (-0.02em). Labels: wide (0.05em).
   */
  letterSpacing: {
    display:  -0.6,   // Tightened for premium feel
    heading:  -0.4,
    body:      0,
    label:     0.55,  // 0.05em wide for label-sm uppercase
  },

  /**
   * Line height scale
   */
  lineHeight: {
    tight:   1.1,
    normal:  1.4,
    relaxed: 1.6,
  },
} as const;
