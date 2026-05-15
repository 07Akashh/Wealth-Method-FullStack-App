import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LucideIcon, Ghost } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

interface EmptyStateProps {
  title: string;
  message: string;
  Icon?: LucideIcon;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  Icon = Ghost,
  style 
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
        <Icon size={40} color={theme.colors.onSurfaceDim} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.displayBold }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fontFamily.bodyRegular }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
});
