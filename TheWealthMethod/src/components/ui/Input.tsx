import { LucideIcon } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import { StyleSheet, Text, TextInput, View, TextStyle, ViewStyle, StyleProp } from "react-native";

import { useAppTheme } from "../../theme/ThemeProvider";

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  style?: StyleProp<ViewStyle>;
  leftIcon?: LucideIcon;
  rightElement?: React.ReactNode;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType = "default",
  style,
  leftIcon: LeftIcon,
  rightElement,
  autoCapitalize = "sentences",
  maxLength,
}) => {
  const { theme } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const dynamicStyles = useMemo(() => ({
    label: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.titleMedium,
      color: theme.colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      paddingLeft: 4,
    } as TextStyle,
    inputArea: {
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 54,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "transparent",
    } as ViewStyle,
    inputFocused: {
      backgroundColor: theme.colors.surfaceBright,
      borderColor: theme.colors.primary + "4D",
    } as ViewStyle,
    inputError: {
      borderColor: theme.colors.danger + "80",
    } as ViewStyle,
    input: {
      flex: 1,
      color: theme.colors.onSurface,
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      height: "100%",
    } as TextStyle,
    errorText: {
      color: theme.colors.danger,
      fontSize: 11,
      fontFamily: theme.typography.fontFamily.bodySemibold,
      paddingLeft: 4,
    } as TextStyle,
  }), [theme]);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}
      <View
        style={[
          dynamicStyles.inputArea,
          isFocused && dynamicStyles.inputFocused,
          error && dynamicStyles.inputError,
        ]}
      >
        {LeftIcon && (
          <LeftIcon 
            size={18} 
            color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant} 
            style={styles.leftIcon} 
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onSurfaceDim}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={theme.colors.primary}
          style={dynamicStyles.input}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
        {rightElement}
      </View>
      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
    marginBottom: 6,
  },
  leftIcon: {
    marginRight: 12,
  },
});
