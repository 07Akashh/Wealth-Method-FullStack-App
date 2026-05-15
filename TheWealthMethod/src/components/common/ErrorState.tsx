import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Vault Error", 
  message = "We encountered a problem accessing your financial records. Please try again.", 
  onRetry,
  style 
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.error + '15' }]}>
        <AlertTriangle size={40} color={theme.colors.error} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.displayBold }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fontFamily.bodyRegular }]}>
        {message}
      </Text>
      {onRetry && (
        <Pressable 
          style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]} 
          onPress={onRetry}
        >
          <RefreshCw size={18} color={theme.colors.onPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.retryText, { color: theme.colors.onPrimary, fontFamily: theme.typography.fontFamily.headlineBold }]}>
            TRY AGAIN
          </Text>
        </Pressable>
      )}
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
    marginBottom: 32,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryText: {
    fontSize: 14,
    letterSpacing: 1,
  },
});
