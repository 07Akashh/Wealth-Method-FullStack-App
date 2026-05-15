import React, { useMemo, useLayoutEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle, RefreshControl } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../../theme/ThemeProvider";

type ScreenWrapperProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: Edge[];
  floatingContent?: React.ReactNode; // Fixed elements like FAB
  hideHeader?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  customRefreshControl?: React.ReactElement;
};

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  edges,
  floatingContent,
  hideHeader = false,
  onRefresh,
  refreshing = false,
  customRefreshControl,
}) => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<any>();

  // If hideHeader is true and edges aren't explicitly provided,
  // we default to including the top edge to avoid status bar overlap.
  const resolvedEdges = useMemo(() => {
    if (edges) return edges;
    return hideHeader ? (["top", "left", "right"] as Edge[]) : (["left", "right"] as Edge[]);
  }, [edges, hideHeader]);

  useLayoutEffect(() => {
    if (hideHeader && navigation && typeof navigation.setOptions === "function") {
      try {
        // Only set options if we're actually in a stack context
        const state = navigation.getState?.();
        if (state) {
          navigation.setOptions({
            headerShown: false,
          });
        }
      } catch (err) {
        // Silently fail for non-stack contexts
      }
    }
  }, [navigation, hideHeader]);

  const dynamicStyles = useMemo(() => ({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: 120, // Avoid floating tab bar overlap
      gap: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    staticContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: 120, // Avoid floating tab bar overlap
      gap: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
  }), [theme]);

  // Use a completely static stylesheet for fixed layout rules
  // and combine with dynamic styles for theme-reactive rules.
  return (
    <SafeAreaView style={[dynamicStyles.safe, style]} edges={resolvedEdges}>
      <Animated.View 
        entering={FadeInRight.duration(600).springify().damping(22).stiffness(150)}
        exiting={FadeOutLeft.duration(600)}
        style={styles.flex}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {scrollable ? (
            <ScrollView
              style={styles.flex}
              contentContainerStyle={[dynamicStyles.scrollContent, contentContainerStyle]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              refreshControl={
                customRefreshControl ? (
                  customRefreshControl
                ) : onRefresh ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.colors.primary}
                    colors={[theme.colors.primary]}
                  />
                ) : undefined
              }
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[dynamicStyles.staticContent, contentContainerStyle]}>{children}</View>
          )}
        </KeyboardAvoidingView>
        
        {/* Render fixed elements outside of ScrollView but inside Animated layout */}
        {floatingContent && (
             <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                 {floatingContent}
             </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
