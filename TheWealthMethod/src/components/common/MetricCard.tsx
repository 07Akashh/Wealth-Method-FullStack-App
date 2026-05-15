import React, { useMemo } from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { useAppTheme } from "../../theme/ThemeProvider";
import { Card } from "../ui/Card";

type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
  icon?: any;
};

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon: Icon }) => {
  const { theme, isDark } = useAppTheme();
  
  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      minWidth: 140,
      padding: 16,
      borderRadius: 24,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant + "15",
    } as ViewStyle,
    label: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      letterSpacing: 0.5,
      marginBottom: 4,
    } as TextStyle,
    value: {
      color: theme.colors.onSurface,
      fontSize: 24,
      fontFamily: theme.typography.fontFamily.displayBold,
      letterSpacing: -1,
    } as TextStyle,
    iconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: theme.colors.primary + "12",
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 12,
    } as ViewStyle,
    trendBox: {
       marginTop: 8,
       paddingHorizontal: 8,
       paddingVertical: 4,
       borderRadius: 8,
       backgroundColor: theme.colors.primary + "10",
       alignSelf: "flex-start" as const,
    } as ViewStyle,
    trendText: {
       fontSize: 10,
       fontFamily: theme.typography.fontFamily.headlineBold,
       color: theme.colors.primary,
    } as TextStyle,
  }), [theme]);

  return (
    <Card style={dynamicStyles.container} elevated={false}>
      {Icon && (
        <View style={dynamicStyles.iconBox}>
          <Icon size={16} color={theme.colors.primary} />
        </View>
      )}
      <Text style={dynamicStyles.label}>{label}</Text>
      <Text style={dynamicStyles.value}>{value}</Text>
      {trend && (
          <View style={dynamicStyles.trendBox}>
              <Text style={dynamicStyles.trendText}>{trend}</Text>
          </View>
      )}
    </Card>
  );
};
