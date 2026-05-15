import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useMemo } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle
} from "react-native";

import { RootStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/authStore";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useWindowDimensions, Dimensions } from "react-native";

type Props = Partial<NativeStackScreenProps<RootStackParamList, "Splash">> & {
    onAnimationComplete?: () => void;
    realtimeProgress?: number;
};

const OrbitalRing: React.FC<{
  size: number;
  delay: number;
  opacity: number;
  color: string;
}> = ({ size, delay, opacity, color }) => {
  const scale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(opacity)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.85,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: opacity,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: color,
        opacity: ringOpacity,
        transform: [{ scale }],
      }}
    />
  );
};

export const SplashScreen: React.FC<Props> = ({ navigation, onAnimationComplete, realtimeProgress }) => {
  const { theme, isDark } = useAppTheme();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { width, height } = useWindowDimensions();

  const minDim = Math.min(width, height);
  const isLandscape = width > height;
  const heroSize = Math.min(280, minDim * (isLandscape ? 0.5 : 0.7));
  
  const ring1 = heroSize * (160/280);
  const ring2 = heroSize * (220/280);
  const ring3 = heroSize;
  const iconSize = Math.min(96, heroSize * 0.35);

  const heroScale = useRef(new Animated.Value(0.6)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordY = useRef(new Animated.Value(20)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(12)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(heroScale, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(wordY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.delay(60),
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 360,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(barWidth, {
          toValue: realtimeProgress ? realtimeProgress / 100 : 1,
          duration: realtimeProgress ? 200 : 1400,
          useNativeDriver: false,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(pillOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [realtimeProgress]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (realtimeProgress !== undefined && realtimeProgress < 100) return;
    
    const t = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
        return;
      }
      if (navigation && !isAuthenticated) {
        navigation.replace("Onboarding");
      }
    }, 2800);
    return () => clearTimeout(t);
  }, [hasHydrated, isAuthenticated, navigation, onAnimationComplete, realtimeProgress]);

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 28,
    } as ViewStyle,
    radialGlow: {
      position: "absolute" as const,
      top: "25%",
      alignSelf: "center" as const,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: theme.colors.primary,
      opacity: isDark ? 0.045 : 0.08,
    } as ViewStyle,
    iconShell: {
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize / 2,
      backgroundColor: theme.colors.surfaceContainerHigh,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 36,
      elevation: 20,
    } as ViewStyle,
    iconInnerGlow: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: iconSize / 2,
      backgroundColor: theme.colors.primary,
      opacity: 0.08,
    } as ViewStyle,
    brandName: {
      fontSize: width > 400 ? 34 : width < 350 ? 24 : 28,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      letterSpacing: -0.5,
    } as TextStyle,
    brandAccent: {
      fontSize: width > 400 ? 34 : width < 350 ? 24 : 28,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.primary,
      letterSpacing: -0.5,
      marginLeft: 6,
      flexShrink: 1,
    } as TextStyle,
    brandDash: {
      width: 20,
      height: 1,
      backgroundColor: theme.colors.primary,
      opacity: 0.5,
    } as ViewStyle,
    brandTagline: {
      fontSize: 13,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: 0.2,
      flexShrink: 1,
      textAlign: "center" as const,
    } as TextStyle,
    progressTrack: {
      width: "80%" as const,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: "visible" as const,
      position: "relative" as const,
    } as ViewStyle,
    progressFill: {
      position: "absolute" as const,
      left: 0,
      top: 0,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 6,
      elevation: 4,
    } as ViewStyle,
    progressCap: {
      position: "absolute" as const,
      top: -3,
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 6,
      marginLeft: -5,
    } as ViewStyle,
    progressLabel: {
      fontSize: 11,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceDim,
      letterSpacing: 0.3,
    } as TextStyle,
    footerText: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.onSurfaceVariant,
      opacity: 0.35,
      letterSpacing: 1.5,
      textTransform: "uppercase" as const,
    } as TextStyle,
    heroAreaDynamic: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: isLandscape ? 20 : 40,
      width: heroSize,
      height: heroSize,
    } as ViewStyle,
    brandBlockDynamic: {
      alignItems: "center" as const,
      gap: 10,
      marginBottom: isLandscape ? 24 : 48,
    } as ViewStyle,
    iconEmoji: {
      fontSize: iconSize * 0.45,
      color: theme.colors.primary,
    } as TextStyle,
  }), [theme, isDark, width, height, heroSize, iconSize, isLandscape]);

  const progressInterpolated = barWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={dynamicStyles.root}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={dynamicStyles.radialGlow} />

      <View style={dynamicStyles.heroAreaDynamic}>
        <OrbitalRing size={ring1} delay={0} opacity={0.35} color={theme.colors.primary} />
        <OrbitalRing size={ring2} delay={600} opacity={0.18} color={theme.colors.primary} />
        <OrbitalRing size={ring3} delay={1100} opacity={0.08} color={theme.colors.primary} />

        <Animated.View
          style={[
            dynamicStyles.iconShell,
            {
              transform: [{ scale: heroScale }],
              opacity: heroOpacity,
            },
          ]}
        >
          <View style={dynamicStyles.iconInnerGlow} />
          <Text style={dynamicStyles.iconEmoji}>✦</Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          dynamicStyles.brandBlockDynamic,
          { opacity: wordOpacity, transform: [{ translateY: wordY }] },
        ]}
      >
        <View style={styles.brandRow}>
          <Text style={dynamicStyles.brandName} adjustsFontSizeToFit numberOfLines={1}>The Wealth</Text>
          <Text style={dynamicStyles.brandAccent} adjustsFontSizeToFit numberOfLines={1}>Method</Text>
        </View>
        <View style={styles.brandTagRow}>
          <View style={dynamicStyles.brandDash} />
          <Animated.Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[
              dynamicStyles.brandTagline,
              { opacity: tagOpacity, transform: [{ translateY: tagY }] },
            ]}
          >
            Master your money, master your life
          </Animated.Text>
          <View style={dynamicStyles.brandDash} />
        </View>
      </Animated.View>

      <View style={styles.progressArea}>
        <View style={dynamicStyles.progressTrack}>
          <Animated.View
            style={[dynamicStyles.progressFill, { width: progressInterpolated }]}
          />
          <Animated.View
            style={[dynamicStyles.progressCap, { left: progressInterpolated }]}
          />
        </View>
        <Animated.Text style={[dynamicStyles.progressLabel, { opacity: pillOpacity }]}>
          {realtimeProgress !== undefined ? `Optimizing Modules... ${Math.round(realtimeProgress)}%` : 'Establishing Secure Session...'}
        </Animated.Text>
      </View>

      <View style={styles.footer}>
        <Text style={dynamicStyles.footerText}>The Wealth Method Systems</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  brandTagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  progressArea: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 44,
  },
});
