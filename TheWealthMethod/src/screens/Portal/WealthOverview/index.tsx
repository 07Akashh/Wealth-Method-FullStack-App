import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Utensils,
  Plane,
  Zap,
  Sparkles,
  Camera,
  Images,
} from "lucide-react-native";
import React, { useMemo, useCallback, useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ViewStyle,
  TextStyle,
  Platform,
  LayoutAnimation,
} from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop, Rect } from "react-native-svg";
import { DashboardSkeleton } from "../../../components/common/Skeleton";
import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";

import { ScreenWrapper } from "../../../components/layout/ScreenWrapper";
import { PortalStackParamList } from "../../../navigation/types";
import { useAppTheme } from "../../../theme/ThemeProvider";
import { useDashboardStats, useGoals, useInsights } from "../../../lib/TanstackQuery/QueryHooks";
import { useBottomSheetStore } from "../../../store/bottomSheetStore";
import { useReceiptCaptureStore } from "../../../store/receiptCaptureStore";
import { useUserStore } from "../../../store/userStore";
import { useAuthStore } from "../../../store/authStore";

type Props = NativeStackScreenProps<PortalStackParamList, "PortalHome">;

export const WealthOverviewScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const { firstName, lastName, name, currencySymbol, privacyEnabled, convertAmount } = useUserStore();
  const { isTempPass, setTempPassState } = useAuthStore();
  const { fetchProfile } = useUserStore();
  const openBottomSheet = useBottomSheetStore(state => state.open);
  const openReceiptCapture = useReceiptCaptureStore(state => state.open);
  const [showActionButtons, setShowActionButtons] = React.useState(false);

  const handleOpenExpenseWithReceipt = useCallback(() => {
    setShowActionButtons(false);
    openReceiptCapture('expense');
    navigation.navigate('ReceiptCapture');
  }, [openReceiptCapture, navigation]);

  const handleOpenIncome = useCallback(() => {
    setShowActionButtons(false);
    openBottomSheet('add-transaction');
  }, [openBottomSheet]);

  const handleOpenAdd = useCallback(() => {
    setShowActionButtons(!showActionButtons);
  }, [showActionButtons]);

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: statsRefetch } = useDashboardStats();
  const { data: insights, isLoading: insightsLoading, isError: insightsError, refetch: insightsRefetch } = useInsights();
  const { data: goals = [], isLoading: goalsLoading, isError: goalsError, refetch: goalsRefetch } = useGoals();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncProfileState = async () => {
      const profile = await fetchProfile();
      if (!isMounted || !profile) return;

      if (typeof profile.requiresPasswordChange === "boolean") {
        setTempPassState(profile.requiresPasswordChange);
      }

      if (profile.requiresPasswordChange) {
        navigation.replace("ChangePassword", { isForced: true });
      }
    };

    syncProfileState();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile, navigation, setTempPassState]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const profile = await fetchProfile();
    if (profile?.requiresPasswordChange === true) {
      setTempPassState(true);
      setRefreshing(false);
      navigation.replace("ChangePassword", { isForced: true });
      return;
    }

    if (profile?.requiresPasswordChange === false) {
      setTempPassState(false);
    }

    await Promise.all([
      statsRefetch(),
      insightsRefetch(),
      goalsRefetch()
    ]);
    setRefreshing(false);
  };

  const displayName = [firstName, lastName].filter(Boolean).join(" ") || name || "User";

  const handleRetry = () => {
    handleRefresh();
  };

  const mainGoal = useMemo(() => {
    if (!goals.length) return undefined;
    return [...goals].sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0];
  }, [goals]);

  const categories = useMemo(() => {
    if (!insights?.breakdown) return [];

    const iconMap: Record<string, any> = {
      "Food & Drink": Utensils,
      "Travel": Plane,
      "Utilities": Zap,
    };

    const colorMap: Record<string, string> = {
      "Food & Drink": theme.colors.warning,
      "Travel": theme.colors.info,
      "Utilities": theme.colors.primary,
    };

    return (insights?.breakdown || []).map((item: any, idx: number) => ({
      id: String(idx),
      title: item.category,
      count: "EXPENSE TOTAL",
      amount: `${currencySymbol}${convertAmount(item.amount).toLocaleString()}`,
      icon: iconMap[item.category] || Zap,
      color: (colorMap[item.category] || theme.colors.primary) + "20",
      iconColor: colorMap[item.category] || theme.colors.primary
    }));
  }, [insights, theme, currencySymbol, convertAmount]);

  const isNoSpendToday = useMemo(() => {
    if (!insights?.trends) return false;
    const todayLabel = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()];
    const todayTrend = insights.trends.find((t: { day: string; }) => t.day === todayLabel);
    return !todayTrend || todayTrend.amount === 0;
  }, [insights]);

  const dynamicStyles = useMemo(() => ({
    welcomeBack: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: "uppercase" as const,
    } as TextStyle,
    greeting: {
      fontSize: theme.typography.fontSize.headlineSm,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      letterSpacing: theme.typography.letterSpacing.heading,
    } as TextStyle,
    mainCard: {
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
      overflow: "hidden" as const,
    } as ViewStyle,
    balanceLabel: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onPrimary + "CC",
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: "uppercase" as const,
    } as TextStyle,
    mainBalance: {
      fontSize: theme.typography.fontSize.displayLg,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onPrimary,
      letterSpacing: theme.typography.letterSpacing.display,
      marginVertical: theme.spacing.sm,
      minHeight: 60,
    } as TextStyle,
    statsRow: {
      flexDirection: "row" as const,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    } as ViewStyle,
    statBox: {
      flex: 1,
      height: 64,
      borderRadius: theme.radius.md,
      backgroundColor: "rgba(255,255,255,0.12)",
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: theme.spacing.sm,
      gap: theme.spacing.sm,
    } as ViewStyle,
    statIconCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center" as const,
      justifyContent: "center" as const,
    } as ViewStyle,
    statLabel: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onPrimary + "AA",
      textTransform: "uppercase" as const,
    } as TextStyle,
    statValue: {
      fontSize: theme.typography.fontSize.titleMd,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onPrimary,
    } as TextStyle,
    sectionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xxl,
      padding: theme.spacing.xl,
      ...theme.effects.shadows.ambient,
    } as ViewStyle,
    goalTitle: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: "uppercase" as const,
      textAlign: "center" as const,
      marginBottom: theme.spacing.lg,
    } as TextStyle,
    goalInner: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginVertical: theme.spacing.md,
    } as ViewStyle,
    goalPercent: {
      fontSize: theme.typography.fontSize.displaySm,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
    } as TextStyle,
    goalName: {
      fontSize: theme.typography.fontSize.titleLg,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
      textAlign: "center" as const,
      marginTop: 8,
    } as TextStyle,
    goalMeta: {
      fontSize: theme.typography.fontSize.bodySm,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center" as const,
      marginTop: theme.spacing.xs,
    } as TextStyle,
    pulseHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-end" as const,
      marginBottom: theme.spacing.lg,
    } as ViewStyle,
    pulseTrend: {
      fontSize: theme.typography.fontSize.bodyMd,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.success,
    } as TextStyle,
    categoryHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: theme.spacing.lg,
    } as ViewStyle,
    categoryItem: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginRight: theme.spacing.md,
    } as ViewStyle,
    catTitle: {
      fontSize: theme.typography.fontSize.titleMd,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
    } as TextStyle,
    catCount: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: 0.5,
      marginTop: 2,
    } as TextStyle,
    catAmount: {
      fontSize: theme.typography.fontSize.titleMd,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
    } as TextStyle,
    fab: {
      position: "absolute" as const,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      zIndex: 1000,
    } as ViewStyle,
    floatingButton: {
      position: "absolute" as const,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    } as ViewStyle,
    floatingLabel: {
      fontSize: 11,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: "#FFFFFF",
      marginTop: 4,
      textAlign: "center" as const,
    } as TextStyle,
    seeAllText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      textTransform: "uppercase" as const,
    } as TextStyle,
    chartContainer: {
      height: 120,
      marginHorizontal: -theme.spacing.xl,
      marginTop: theme.spacing.md,
    } as ViewStyle,
  }), [theme]);

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  // Progress animation for charts
  const chartProgress = useSharedValue(0);
  useEffect(() => {
    chartProgress.value = withTiming(1, { duration: 1500 });
  }, [insights]);

  const { chartPath, areaPath } = useMemo(() => {
    const defaultResult = {
      chartPath: "M0,130 Q30,130 60,110 T120,120 T180,80 T240,110 T300,50 T360,105 T400,60",
      areaPath: "M0,130 Q30,130 60,110 T120,120 T180,80 T240,110 T300,50 T360,105 T400,60 L400,150 L0,150 Z"
    };

    if (!insights?.trends || insights.trends.length < 2) return defaultResult;

    const max = Math.max(...(insights?.trends || []).map((tx: any) => tx.amount), 1);
    const points = insights.trends.map((t: { amount: number; }, i: number) => ({
      x: i * (400 / (insights.trends.length - 1)),
      y: 130 - (t.amount / max) * 100
    }));

    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      d += ` C${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }

    const aD = `${d} L400,150 L0,150 Z`;
    return { chartPath: d, areaPath: aD };
  }, [insights]);

  const animatedAreaProps = useAnimatedProps(() => ({
    d: areaPath,
    opacity: interpolate(chartProgress.value, [0, 1], [0, 0.2]),
  }));

  const animatedLineProps = useAnimatedProps(() => ({
    d: chartPath,
    strokeDashoffset: interpolate(chartProgress.value, [0, 1], [1000, 0]),
  }));

  if (statsLoading || insightsLoading || goalsLoading) {
    return (
      <ScreenWrapper>
        <DashboardSkeleton />
      </ScreenWrapper>
    );
  }

  if (statsError || insightsError || goalsError) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={handleRetry} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      onRefresh={handleRefresh}
      refreshing={refreshing}
      floatingContent={
        <View>
          {/* Action Buttons */}
          {showActionButtons && (
            <>
              <Pressable
                style={[dynamicStyles.floatingButton, { bottom: Platform.OS === 'ios' ? 200 : 180, right: 24 }]}
                onPress={handleOpenExpenseWithReceipt}
              >
                <Camera size={24} color={theme.colors.onPrimary} strokeWidth={2.5} />
                <Text style={dynamicStyles.floatingLabel}>Expense</Text>
              </Pressable>
              <Pressable
                style={[dynamicStyles.floatingButton, { bottom: Platform.OS === 'ios' ? 140 : 120, right: 24 }]}
                onPress={handleOpenIncome}
              >
                <Plus size={24} color={theme.colors.onPrimary} strokeWidth={2.5} />
                <Text style={dynamicStyles.floatingLabel}>Income</Text>
              </Pressable>
            </>
          )}

          {/* Main FAB Button */}
          <Pressable
            style={[dynamicStyles.fab, { bottom: Platform.OS === 'ios' ? 120 : 100, right: 24 }]}
            onPress={handleOpenAdd}
          >
            <Plus size={32} color={theme.colors.onPrimary} strokeWidth={3} />
          </Pressable>
        </View>
      }
    >
      <Text style={dynamicStyles.welcomeBack}>WELCOME BACK</Text>
      <Text style={dynamicStyles.greeting}>Good Evening, {displayName}</Text>

      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={dynamicStyles.mainCard}
      >
        <Text style={dynamicStyles.balanceLabel}>CURRENT WEALTH BALANCE</Text>
        <Text
          style={dynamicStyles.mainBalance}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {`${currencySymbol}${privacyEnabled ? '•••••' : convertAmount(stats?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </Text>

        <View style={dynamicStyles.statsRow}>
          <View style={dynamicStyles.statBox}>
            <View style={dynamicStyles.statIconCircle}>
              <ArrowUp size={18} color={theme.colors.onPrimary} strokeWidth={3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dynamicStyles.statLabel}>INCOME</Text>
              <Text
                style={dynamicStyles.statValue}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {currencySymbol}{privacyEnabled ? '•••••' : (convertAmount(stats?.totalIncome || 0).toLocaleString())}
              </Text>
            </View>
          </View>
          <View style={dynamicStyles.statBox}>
            <View style={dynamicStyles.statIconCircle}>
              <ArrowDown size={18} color={theme.colors.onPrimary} strokeWidth={3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dynamicStyles.statLabel}>EXPENSES</Text>
              <Text
                style={dynamicStyles.statValue}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {currencySymbol}{privacyEnabled ? '•••••' : (convertAmount(stats?.totalExpense || 0).toLocaleString())}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {isNoSpendToday && (
        <View style={[dynamicStyles.sectionCard, { backgroundColor: theme.colors.success + '0D', borderColor: theme.colors.success + '40', borderWidth: 1 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.success + '20', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} color={theme.colors.success} fill={theme.colors.success + '40'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.success, textTransform: 'uppercase', letterSpacing: 1 }}>Zen Challenge Active</Text>
              <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface, marginTop: 4 }}>A Perfect "No-Spend" Day</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 12, lineHeight: 18 }}>
            Your vault is untouched today. This discipline is building your long-term wealth pulse.
          </Text>
        </View>
      )}

      <View style={dynamicStyles.sectionCard}>
        <Text style={dynamicStyles.goalTitle}>SAVINGS PROGRESS</Text>
        <View style={dynamicStyles.goalInner}>
          <Svg height="140" width="140" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="45" stroke={theme.colors.surfaceContainerHigh} strokeWidth="8" fill="none" />
            <Circle
              cx="50" cy="50" r="45" stroke={theme.colors.primary} strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * (stats?.balance ? Math.min(stats.balance / (goals.reduce((s: any, g: { targetAmount: any; }) => s + g.targetAmount, 0) || 1), 1) : 0))}
              strokeLinecap="round" fill="none"
              transform="rotate(-90 50 50)"
            />
            <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
              <Text style={dynamicStyles.goalPercent} adjustsFontSizeToFit numberOfLines={1}>
                {stats?.balance ? Math.round((stats.balance / (goals.reduce((s: any, g: { targetAmount: any; }) => s + g.targetAmount, 0) || 1)) * 100) : 0}%
              </Text>
            </View>
          </Svg>
        </View>
        <Text style={dynamicStyles.goalName}>{goals.length ? (goals.length === 1 ? goals[0].title : `${goals.length} Vault Objectives`) : 'No Active Goals'}</Text>
        <Text style={dynamicStyles.goalMeta}>
          {`${privacyEnabled ? '••••' : (currencySymbol + convertAmount(stats?.balance || 0).toLocaleString())} / ${privacyEnabled ? '••••' : (currencySymbol + convertAmount(goals.reduce((s: any, g: { targetAmount: any; }) => s + g.targetAmount, 0)).toLocaleString())}`}
        </Text>
      </View>

      <View style={dynamicStyles.sectionCard}>
        <View style={dynamicStyles.pulseHeader}>
          <View>
            <Text style={dynamicStyles.goalTitle}>WEALTH PULSE</Text>
            <Text style={[dynamicStyles.goalName, { textAlign: "left" }]}>Last 7 Days</Text>
          </View>
          <Text style={dynamicStyles.pulseTrend}>+12.4%</Text>
        </View>

        <View style={dynamicStyles.chartContainer}>
          <Svg height="100%" width="100%" viewBox="0 0 400 150">
            <Defs>
              <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="1" />
                <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
              </SvgGradient>
            </Defs>
            <AnimatedPath
              animatedProps={animatedAreaProps}
              fill="url(#areaGrad)"
            />
            <AnimatedPath
              animatedProps={animatedLineProps}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="1000"
            />
          </Svg>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          {(insights?.trends || []).map((t: any, i: number) => (
            <Text key={`trend-${i}`} style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceVariant }}>{t.day}</Text>
          )) || ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => (
            <Text key={`day-${i}`} style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceVariant }}>{d}</Text>
          ))}
        </View>
      </View>

      <View style={[dynamicStyles.sectionCard, { marginBottom: 100 }]}>
        <View style={dynamicStyles.categoryHeader}>
          <Text style={[dynamicStyles.goalName, { marginTop: 0 }]}>Categories</Text>
          <Pressable onPress={() => navigation.navigate("HistoryTab")}>
            <Text style={dynamicStyles.seeAllText}>SEE ALL</Text>
          </Pressable>
        </View>

        <View>
          {categories.map((cat: any) => (
            <View key={cat.id} style={dynamicStyles.categoryItem}>
              <View style={[dynamicStyles.iconWrap, { backgroundColor: cat.color }]}>
                <cat.icon size={22} color={cat.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.catTitle}>{cat.title}</Text>
                <Text style={dynamicStyles.catCount}>{cat.count}</Text>
              </View>
              <Text style={dynamicStyles.catAmount}>{cat.amount}</Text>
            </View>
          ))}
          {categories.length === 0 && (
            <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceDim, marginTop: 20 }}>No data for current month</Text>
          )}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};

