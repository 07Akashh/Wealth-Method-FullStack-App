import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  useSharedValue, 
  interpolate 
} from "react-native-reanimated";
import { useAppTheme } from "../../theme/ThemeProvider";

interface SkeletonProps {
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = "100%", 
  height = 20, 
  borderRadius = 8, 
  style 
}) => {
  const { theme } = useAppTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceContainerHighest,
        },
        animatedStyle,
        style
      ]}
    />
  );
};

export const DashboardSkeleton = () => {
    const { theme } = useAppTheme();
    return (
        <View style={{ gap: 20, padding: 20 }}>
            <Skeleton width={150} height={32} />
            <Skeleton width="100%" height={180} borderRadius={24} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <Skeleton width="48%" height={120} borderRadius={20} />
                <Skeleton width="48%" height={120} borderRadius={20} />
            </View>
            <Skeleton width="100%" height={240} borderRadius={32} />
        </View>
    );
};

export const HistorySkeleton = () => {
    return (
        <View style={{ gap: 16, padding: 20 }}>
            <Skeleton width="100%" height={56} borderRadius={16} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <Skeleton width={80} height={40} borderRadius={12} />
                <Skeleton width={80} height={40} borderRadius={12} />
                <Skeleton width={80} height={40} borderRadius={12} />
            </View>
            {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Skeleton width={48} height={48} borderRadius={24} />
                    <View style={{ flex: 1, gap: 4 }}>
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="40%" height={14} />
                    </View>
                    <Skeleton width={60} height={20} />
                </View>
            ))}
        </View>
    );
};
