import { LucideIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";

import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";

type ButtonVariant = "primary" | "secondary" | "glass" | "ghost" | "social";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  icon?: LucideIcon | React.ComponentType<any>;
  iconSize?: number;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  icon: Icon,
  iconSize = 20,
}) => {
  const { theme } = useAppTheme();

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGlass = variant === "glass";
  const isGhost = variant === "ghost";
  const isSocial = variant === "social";

  const themedStyles = useThemedStyles((t) => ({
    primaryGlow: {
      position: "absolute" as const,
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,
      backgroundColor: t.colors.primary,
      borderRadius: 16,
      opacity: 0.15,
      shadowColor: t.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
    } as ViewStyle,
    base: {
      minHeight: 52,
      paddingHorizontal: 24,
      borderRadius: 20,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,
    } as ViewStyle,
    primary: {
      backgroundColor: t.colors.primary,
    } as ViewStyle,
    secondary: {
      backgroundColor: t.colors.surfaceContainerHigh,
    } as ViewStyle,
    glass: {
      backgroundColor: t.colors.surfaceVariant + "66",
      borderWidth: 1,
      borderColor: t.colors.outlineVariant,
    } as ViewStyle,
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: t.colors.outline,
    } as ViewStyle,
    social: {
      flex: 1,
      backgroundColor: t.colors.surfaceContainerHigh,
      minHeight: 48,
    } as ViewStyle,
    label: {
      fontSize: 16,
      fontFamily: t.typography.fontFamily.headlineSemi,
      letterSpacing: 0.3,
    } as TextStyle,
    labelPrimary: {
      color: t.colors.surface,
    } as TextStyle,
    labelAccent: {
      color: t.colors.primary,
    } as TextStyle,
    labelDisabled: {
      color: t.colors.onSurfaceDim,
    } as TextStyle,
  }));

  const iconColor = useMemo(() => {
    if (isPrimary) return theme.colors.surface;
    if (isSocial) return theme.colors.onSurface;
    return theme.colors.primary;
  }, [isPrimary, isSocial, theme.colors]);

  return (
    <View style={[styles.outerContainer, style]}>
      {isPrimary && !disabled && <View style={themedStyles.primaryGlow} />}

      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          themedStyles.base,
          isPrimary && themedStyles.primary,
          isSecondary && themedStyles.secondary,
          isGlass && themedStyles.glass,
          isGhost && themedStyles.ghost,
          isSocial && themedStyles.social,
          (disabled || loading) && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimary ? theme.colors.surface : theme.colors.primary} />
        ) : (
          <View style={styles.content}>
            {Icon && (
              <View style={styles.iconContainer}>
                <Icon size={iconSize} color={iconColor} />
              </View>
            )}
            <Text
              style={[
                themedStyles.label,
                isPrimary && themedStyles.labelPrimary,
                (isSecondary || isGlass || isGhost || isSocial) && themedStyles.labelAccent,
                disabled && themedStyles.labelDisabled,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "relative",
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
});
