import React, { useMemo } from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { useAppTheme } from "../../theme/ThemeProvider";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  const { theme } = useAppTheme();
  
  const dynamicStyles = useMemo(() => ({
    container: {
      gap: theme.spacing(1),
      marginBottom: 8,
      position: "relative" as const,
      paddingLeft: 12,
    } as ViewStyle,
    accentBar: {
       position: "absolute" as const,
       left: 0,
       top: 4,
       bottom: 4,
       width: 3,
       borderRadius: 2,
       backgroundColor: theme.colors.primary,
    } as ViewStyle,
    title: {
      color: theme.colors.onSurface,
      fontSize: 20,
      fontFamily: theme.typography.fontFamily.displayBold,
      letterSpacing: -0.5,
    } as TextStyle,
    subtitle: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineBold,
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      opacity: 0.8,
    } as TextStyle,
  }), [theme]);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.accentBar} />
      {subtitle ? <Text style={dynamicStyles.subtitle}>{subtitle}</Text> : null}
      <Text style={dynamicStyles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
