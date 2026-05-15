import React from "react";
import { View, ViewStyle } from "react-native";
import { useThemedStyles } from "../../theme/ThemeProvider";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean; // Tonal lift vs subtle lift
};

/**
 * Ethereal Academy Card Component
 * - Tonal Layering: No border by default.
 * - Separation: background shifts only (surface-container).
 */
export const Card: React.FC<CardProps> = ({ children, style, elevated = false }) => {
  const themedStyles = useThemedStyles((theme) => ({
    base: {
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: theme.radius.xl,
      padding: 20,
      width: "100%",
      marginBottom: 16,
    } as ViewStyle,
    elevated: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    } as ViewStyle,
  }));

  return (
    <View
      style={[
        themedStyles.base,
        elevated && themedStyles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
};
