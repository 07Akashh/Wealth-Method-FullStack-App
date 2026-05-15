import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useRef, useState, useMemo } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle
} from "react-native";

import { RootStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const { width: W } = Dimensions.get("window");

const SLIDES = [
  {
    phase: "PHASE 01: WELCOME",
    phaseNum: "01",
    titlePart1: "Master Your",
    titleAccent: "Wealth",
    titlePart2: "with Precision",
    subtitle:
      "The Wealth Method provides high-fidelity tools for private wealth management, asset tracking, and secure financial growth.",
    features: [
      { icon: "📈", title: "Growth",        desc: "Interactive portfolio visualization and trends." },
      { icon: "🛡️", title: "Security",      desc: "Bank-grade encryption for your digital identity." },
      { icon: "💎", title: "Elite Access",  desc: "Curated financial insights at your fingertips." },
    ],
    stat: "Trusted by 10k+ High Networth Individuals",
    accentWord: "Wealth",
    isFinal: false,
  },
  {
    phase: "PHASE 02: INSIGHTS",
    phaseNum: "02",
    titlePart1: "Real-Time",
    titleAccent: "Visibility",
    titlePart2: "into Assets",
    subtitle:
      "Live dashboards, automated financial alerts, and predictive analytics — surfaced precisely when you need to make a move.",
    features: [
      { icon: "📊", title: "Live Dashboard",   desc: "Metrics that update in real-time across your accounts." },
      { icon: "🔔", title: "Smart Alerts",     desc: "AI-powered notifications for market movements." },
      { icon: "📈", title: "Yield Charts",    desc: "Visual performance trends over months and years." },
    ],
    stat: "Comprehensive · Secure · Precise",
    accentWord: "Visibility",
    isFinal: false,
  },
  {
    phase: "PHASE 03: ACCESS",
    phaseNum: "03",
    titlePart1: "Your Digital",
    titleAccent: "Sanctuary",
    titlePart2: "for Wealth",
    subtitle:
      "Access private dashboards, connect with dedicated advisors, and unify your wealth odyssey in one seamless, curated space.",
    features: [
      { icon: "🔐", title: "Secure & Private",  desc: "Zero-knowledge architecture keeps data protected." },
      { icon: "⚡", title: "Blazing Fast",       desc: "Native performance for rapid decision making." },
      { icon: "🌱", title: "Odyssey Focused",    desc: "Every metric is designed to inspire your future." },
    ],
    stat: "Begin Your Wealth Odyssey",
    accentWord: "Sanctuary",
    isFinal: true,
  },
] as const;

const FeatureRow: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => {
  const { theme } = useAppTheme();
  
  const dynamicStyles = useMemo(() => ({
    row: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      gap: 14,
      paddingVertical: 14,
    } as ViewStyle,
    iconWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceContainerHigh,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexShrink: 0,
    } as ViewStyle,
    title: {
      fontSize: 18,
      fontFamily: theme.typography.fontFamily.bodySemibold,
      color: theme.colors.onSurface,
      letterSpacing: -0.1,
    } as TextStyle,
    desc: {
      fontSize: 14,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 18,
    } as TextStyle,
  }), [theme]);

  return (
    <View style={dynamicStyles.row}>
      <View style={dynamicStyles.iconWrap}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1, gap: 3, paddingTop: 2 }}>
        <Text style={dynamicStyles.title}>{title}</Text>
        <Text style={dynamicStyles.desc}>{desc}</Text>
      </View>
    </View>
  );
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [index, setIndex] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideY    = useRef(new Animated.Value(0)).current;
  const transitioning = useRef(false);

  const slide = SLIDES[index];

  const navigateTo = useCallback(
    (next: number) => {
      if (transitioning.current) return;
      if (next < 0 || next >= SLIDES.length) return;
      transitioning.current = true;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(slideY, {
          toValue: next > index ? -12 : 12,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex(next);
        slideY.setValue(next > index ? 12 : -12);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(slideY, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
        ]).start(() => {
          transitioning.current = false;
        });
      });
    },
    [index]
  );

  const goNext = () => {
    if (index === SLIDES.length - 1) {
      navigation.replace("AuthStack", { screen: "Login" });
    } else {
      navigateTo(index + 1);
    }
  };

  const goPrev = () => navigateTo(index - 1);

  const skipToLogin = () =>
    navigation.replace("AuthStack", { screen: "Login" });

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    } as ViewStyle,
    glowBL: {
      position: "absolute" as const,
      bottom: 120,
      left: -80,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.colors.primary,
      opacity: 0.04,
    } as ViewStyle,
    glowTR: {
      position: "absolute" as const,
      top: 40,
      right: -80,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.colors.primaryContainer,
      opacity: 0.06,
    } as ViewStyle,
    logoName: {
      color: theme.colors.onSurface,
      fontSize: 20,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      letterSpacing: -0.5,
    } as TextStyle,
    skipPill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surfaceContainerHigh + "60",
    } as ViewStyle,
    phaseBadge: {
      alignSelf: "flex-start" as const,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "1A",
    } as ViewStyle,
    phaseText: {
      color: theme.colors.primary,
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      letterSpacing: 1.2,
      textTransform: "uppercase" as const,
    } as TextStyle,
    phaseNumBg: {
      position: "absolute" as const,
      right: -8,
      top: -10,
      fontSize: 100,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.surfaceContainerHigh,
      lineHeight: 100,
      letterSpacing: -4,
      opacity: isDark ? 1 : 0.5,
    } as TextStyle,
    headlineLine: {
      fontSize: 34,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      letterSpacing: -0.5,
      lineHeight: 40,
    } as TextStyle,
    subtitle: {
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 24,
      marginBottom: 24,
    } as TextStyle,
    featuresContainer: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 24,
      paddingHorizontal: 16,
      marginBottom: 24,
    } as ViewStyle,
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 44,
      paddingTop: 10,
      backgroundColor: theme.colors.surfaceContainerLow,
      gap: 14,
    } as ViewStyle,
    navPrimary: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 22,
      paddingVertical: 14,
      borderRadius: 16,
    } as ViewStyle,
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.surfaceContainerHighest,
    } as ViewStyle,
    dotActive: {
      width: 26,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
    } as ViewStyle,
  }), [theme, isDark]);

  return (
    <View style={dynamicStyles.root}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={dynamicStyles.glowBL} />
      <View style={dynamicStyles.glowTR} />

      <View style={styles.header}>
        <View style={styles.logoMark}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }} />
          <Text style={dynamicStyles.logoName}>The Wealth Method</Text>
        </View>
        <Pressable onPress={skipToLogin} style={dynamicStyles.skipPill}>
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13 }}>Skip</Text>
        </Pressable>
      </View>

      <Animated.View
         style={[
           styles.slideWrap,
           {
             opacity: fadeAnim,
             transform: [{ translateY: slideY }],
           },
         ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.phaseRow}>
            <View style={dynamicStyles.phaseBadge}>
              <Text style={dynamicStyles.phaseText}>{slide.phase}</Text>
            </View>
          </View>

          <View style={styles.headingArea}>
            <Text style={dynamicStyles.phaseNumBg}>{slide.phaseNum}</Text>
            <View style={styles.headlineBlock}>
              <Text style={dynamicStyles.headlineLine}>{slide.titlePart1}</Text>
              <Text style={[dynamicStyles.headlineLine, { color: theme.colors.primary }]}>{slide.titleAccent}</Text>
              <Text style={dynamicStyles.headlineLine}>{slide.titlePart2}</Text>
            </View>
          </View>

          <Text style={dynamicStyles.subtitle}>{slide.subtitle}</Text>

          <View style={dynamicStyles.featuresContainer}>
            {slide.features.map((f, i) => (
              <View key={i}>
                <FeatureRow icon={f.icon} title={f.title} desc={f.desc} />
                {i < slide.features.length - 1 && (
                  <View style={[styles.tonalDivider, { backgroundColor: theme.colors.outlineVariant, opacity: 0.2 }]} />
                )}
              </View>
            ))}
          </View>

          {slide.isFinal && (
            <Pressable
              onPress={skipToLogin}
              style={({ pressed }) => [
                styles.ctaBtn,
                { backgroundColor: theme.colors.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.ctaBtnText}>Get Started 🚀</Text>
            </Pressable>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>

      <View style={dynamicStyles.footer}>
        <View style={[styles.liveBar, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
          <View style={[styles.liveDot, { backgroundColor: theme.colors.success }]} />
          <Text style={{ color: theme.colors.onSurfaceDim, fontSize: 9 }}>STATUS</Text>
          <Text style={{ color: theme.colors.onSurface, fontSize: 11, flex: 1, marginLeft: 8 }}>{slide.stat}</Text>
        </View>

        <View style={styles.navRow}>
          <Pressable
            onPress={goPrev}
            style={[styles.navGhost, index === 0 && { opacity: 0.3 }]}
            disabled={index === 0}
          >
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>← PREV</Text>
          </Pressable>

          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[dynamicStyles.dot, i === index && dynamicStyles.dotActive]} />
            ))}
          </View>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [dynamicStyles.navPrimary, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.navPrimaryText}>
              {index === SLIDES.length - 1 ? "START" : "NEXT"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
  },
  logoMark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  slideWrap: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  phaseRow: { marginTop: 20, marginBottom: 16 },
  headingArea: {
    position: "relative",
    marginBottom: 16,
    overflow: "hidden",
  },
  headlineBlock: {
    gap: 2,
    paddingTop: 4,
  },
  tonalDivider: {
    height: 1,
    marginHorizontal: 8,
  },
  ctaBtn: {
    borderRadius: 16,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 'bold',
  },
  liveBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navGhost: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  dots: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },
  navPrimaryText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
