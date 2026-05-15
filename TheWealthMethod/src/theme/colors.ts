/**
 * The Ethereal Academy – Color System
 * 
 * High-fidelity surface hierarchy for both:
 * 1. Deep Oceanic (Dark) 
 * 2. Ethereal Alabaster (Light) - Warm, premium, editorial aesthetic.
 * 3. Surface Bright - Interactive highlights.
 */

// ── Light Theme (Architectural White - Default) ──────────────────
export const lightColors = {
  // Surfaces: Root Hierarchy
  surface:                "#f8f9fa", // Level 0 (Base)
  surfaceContainerLow:    "#f3f4f5", // Level 1 (Sections)
  surfaceContainerLowest: "#ffffff", // Level 2 (Interactive/Cards)
  surfaceBright:          "#ffffff", // High Contrast Surface
  
  // Surfaces: Secondary Layers
  surfaceContainer:       "#f3f4f5", 
  surfaceContainerHigh:   "#eaebec", 
  surfaceContainerHighest:"#e1e2e3", 

  background:             "#f8f9fa",
  card:                   "#ffffff",

  // Brand: The Digital Bank
  primary:                "#3525cd", // Indigo
  primaryContainer:       "#4F46E5",
  onPrimary:              "#ffffff",
  
  secondary:              "#006c49", // Growth Emerald
  secondaryContainer:     "#006c49", // Base for ghost fill
  
  tertiary:               "#960014", // Expense Ruby
  tertiaryContainer:      "#960014", // Base for ghost fill

  // State
  success: "#006c49",
  warning: "#f59e0b",
  danger:  "#960014",
  error:   "#960014",
  errorContainer: "#960014",
  info:    "#4F46E5",

  // Typography
  onSurface:              "#191c1d", // Deep Onyx (Softened)
  onSurfaceVariant:       "#45494a", // Medium Grey
  onSurfaceDim:           "#8b8e8f", // Placeholder Grey

  // Elevation
  outline:                "rgba(53,37,205,0.15)", // Ghost Border (15% primary)
  outlineVariant:         "rgba(25,28,29,0.06)", // Soft Divider Variant
};

// ── Dark Theme (Deep Portfolio) ──────────────────
export const darkColors: typeof lightColors = {
  surface:                "#0D1117", 
  surfaceContainerLow:    "#161B22", 
  surfaceContainerLowest: "#010409",
  surfaceBright:          "#2d333b",
  
  surfaceContainer:       "#161B22", 
  surfaceContainerHigh:   "#21262d", 
  surfaceContainerHighest:"#30363d", 

  background:             "#0D1117",
  card:                   "#161B22",

  primary:                "#7C3AED", // Vibrant Violet for Dark Mode
  primaryContainer:       "#4C1D95",
  onPrimary:              "#ffffff",

  secondary:              "#10B981",
  secondaryContainer:     "#10B981",
  
  tertiary:               "#FB7185",
  tertiaryContainer:      "#FB7185",

  success: "#10B981",
  warning: "#FBBF24",
  danger:  "#FB7185",
  error:   "#FB7185",
  errorContainer: "#FB7185",
  info:    "#60A5FA",

  onSurface:              "#F0F6FC", 
  onSurfaceVariant:       "#8B949E", 
  onSurfaceDim:           "#484F58", 

  outline:                "rgba(124,58,237,0.2)",
  outlineVariant:         "rgba(240,246,252,0.12)",
};

export const colors = lightColors; 
export type AppColors = typeof lightColors;
