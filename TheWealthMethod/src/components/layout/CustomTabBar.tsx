import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useReceiptCaptureStore } from "../../store/receiptCaptureStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme, isDark } = useAppTheme();
  const openReceiptCapture = useReceiptCaptureStore((store) => store.open);

  const focusedRoute = state.routes[state.index];
  const { options } = descriptors[focusedRoute.key];

  if ((options.tabBarStyle as any)?.display === "none") {
    return null;
  }

  const numRoutes = state.routes.length;
  const containerPadding = 12;
  const containerWidth = SCREEN_WIDTH - (containerPadding * 2);
  const tabWidth = containerWidth / numRoutes;
  const translateX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index, tabWidth, translateX]);

  const pillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const dynamicStyles = useMemo(() => ({
    container: {
      flexDirection: "row" as const,
      backgroundColor: isDark ? theme.colors.surfaceContainerLow + "E0" : theme.colors.surfaceContainerLowest + "E0",
      height: 84,
      borderRadius: 42,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      paddingHorizontal: 0,
      alignItems: "center" as const,
      ...theme.effects.shadows.ambient,
      marginBottom: Platform.OS === "ios" ? 20 : 10,
    },
    pill: {
      position: "absolute" as const,
      height: 72,
      borderRadius: 36,
      zIndex: 1,
      padding: 4,
    },
    pillInner: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer + (isDark ? "30" : "15"),
      borderRadius: 32,
    },
  }), [theme, isDark]);

  return (
    <View style={styles.floatingWrapper}>
      <View style={dynamicStyles.container}>
        <Animated.View style={[dynamicStyles.pill, { width: tabWidth }, pillStyle]}>
          <View style={dynamicStyles.pillInner} />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === 'AddTab') {
              openReceiptCapture('expense');
              navigation.getParent()?.navigate('ReceiptCapture' as never);
              return;
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              onPress={onPress}
              isFocused={isFocused}
              label={label as string}
              options={options}
              isPrimary={route.name === 'AddTab'}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabButton = ({ onPress, isFocused, label, options, isPrimary }: any) => {
  const { theme } = useAppTheme();

  const activeColor = isPrimary ? '#FFFFFF' : theme.colors.primary;
  const inactiveColor = theme.colors.onSurfaceDim;

  if (isPrimary) {
    return (
      <Pressable onPress={onPress} style={[styles.tabButton, styles.primaryButtonBase]}>
        <View style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}>
          {options.tabBarIcon({ color: '#FFFFFF', size: 28, focused: true })}
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <View style={styles.buttonContent}>
        <View style={styles.iconBox}>
          {options.tabBarIcon({
            color: isFocused ? activeColor : inactiveColor,
            focused: isFocused,
            size: 24
          })}
        </View>
        <Text style={[
          styles.label,
          { color: isFocused ? activeColor : inactiveColor, fontFamily: theme.typography.fontFamily.headlineBold }
        ]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconBox: {
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 9,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  primaryButtonBase: {
    transform: [{ translateY: -12 }],
  },
  primaryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});
