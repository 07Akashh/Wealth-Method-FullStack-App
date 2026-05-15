import React, { useMemo, useCallback, useEffect } from "react";
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  interpolate,
  useAnimatedStyle,
  SharedValue
} from "react-native-reanimated";
import { 
  Text, 
  View, 
  ScrollView, 
  Pressable, 
  TextStyle, 
  ViewStyle, 
} from "react-native";
import { DashboardSkeleton } from "../../../components/common/Skeleton";
import { 
  TrendingUp, 
  Lightbulb, 
  ArrowRight,
} from "lucide-react-native";
import Svg, { Circle, Rect, Path, G } from "react-native-svg";

import { ScreenWrapper } from "../../../components/layout/ScreenWrapper";
import { useAppTheme } from "../../../theme/ThemeProvider";
import { useInsights, useDashboardStats } from "../../../lib/TanstackQuery/QueryHooks";
import { useUserStore } from "../../../store/userStore";
import { ErrorState } from "../../../components/common/ErrorState";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DonutSector = ({ s, progress }: { s: any, progress: SharedValue<number> }) => {
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: 251.2 - (251.2 * (s.val / 100) * progress.value),
        opacity: progress.value,
    }));

    return (
        <AnimatedCircle 
            cx="50" cy="50" r="40" 
            stroke={s.color} strokeWidth="15" 
            fill="none" 
            strokeDasharray="251.2" 
            animatedProps={animatedProps}
            transform={`rotate(${s.rotation} 50 50)`}
            strokeLinecap="round"
        />
    );
};

const AnimatedBar = ({ t, max, i, count, progress, dynamicStyles }: any) => {
    const targetHeight = (t.amount / max) * 100;
    const animatedBar = useAnimatedStyle(() => ({
        height: withTiming(Math.max(targetHeight * progress.value, 8), { duration: 800 + (i * 100) }),
        opacity: withTiming(progress.value, { duration: 500 }),
    }));

    return (
        <Animated.View 
            style={[
                dynamicStyles.bar, 
                animatedBar,
                i === count - 1 && dynamicStyles.barActive
            ]}
        >
            <Text style={dynamicStyles.barLabel}>{t.day}</Text>
        </Animated.View>
    );
};

export const InsightsScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { currencySymbol, privacyEnabled, convertAmount } = useUserStore();
  const { data: insights, isLoading: insightsLoading, isError: insightsError, refetch: insightsRefetch } = useInsights();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: statsRefetch } = useDashboardStats();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      insightsRefetch(),
      statsRefetch(),
    ]);
    setRefreshing(false);
  };

  const handleRetry = () => {
    handleRefresh();
  };

  const dynamicStyles = useMemo(() => ({
    subtitle: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: "uppercase" as const,
    } as TextStyle,
    mainTitle: {
      fontSize: theme.typography.fontSize.displaySm,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      letterSpacing: theme.typography.letterSpacing.display,
    } as TextStyle,
    card: {
       backgroundColor: theme.colors.card,
       borderRadius: 32,
       padding: 24,
       ...theme.effects.shadows.ambient,
    } as ViewStyle,
    cardHeader: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "flex-start" as const,
        marginBottom: 24,
    } as ViewStyle,
    cardTitle: {
        fontSize: theme.typography.fontSize.titleLg,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurface,
        flex: 1,
    } as TextStyle,
    periodBadge: {
        backgroundColor: theme.colors.secondaryContainer + "1A",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.radius.md,
    } as ViewStyle,
    periodText: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.secondary,
        textTransform: "uppercase" as const,
        textAlign: "right" as const,
        letterSpacing: 0.5,
    } as TextStyle,
    chartBox: {
        height: 200,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        marginVertical: 12,
    } as ViewStyle,
    totalBox: {
        position: "absolute" as const,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.surfaceContainerLowest,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        zIndex: 2,
    } as ViewStyle,
    totalLabel: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceVariant,
        textTransform: "uppercase" as const,
    } as TextStyle,
    totalVal: {
        fontSize: theme.typography.fontSize.titleLg,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onSurface,
    } as TextStyle,
    legendRow: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
        paddingVertical: 8,
    } as ViewStyle,
    legendLabel: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
    } as ViewStyle,
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    } as ViewStyle,
    legendText: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurface,
    } as TextStyle,
    legendPercent: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurface,
    } as TextStyle,
    weekChart: {
        height: 100,
        flexDirection: "row" as const,
        alignItems: "flex-end" as const,
        justifyContent: "space-between" as const,
        paddingHorizontal: 8,
        marginVertical: 20,
    } as ViewStyle,
    bar: {
        width: 40,
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 8,
    } as ViewStyle,
    barActive: {
        backgroundColor: theme.colors.primary,
    } as ViewStyle,
    barLabel: {
        position: "absolute" as const,
        top: -20,
        width: "100%",
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceVariant,
        textAlign: "center" as const,
    } as TextStyle,
    trendInfo: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: theme.colors.tertiaryContainer + "1A",
        padding: 16,
        borderRadius: 16,
        gap: 12,
    } as ViewStyle,
    trendText: {
        flex: 1,
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurface,
    } as TextStyle,
    alertCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 32,
        padding: 32,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: "center" as const,
        ...theme.effects.shadows.ambient,
    } as ViewStyle,
    alertIconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primaryContainer + "20",
        alignItems: "center" as const,
        justifyContent: "center" as const,
        marginBottom: 20,
    } as ViewStyle,
    alertTitle: {
        fontSize: theme.typography.fontSize.titleLg,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onSurface,
        textAlign: "center" as const,
        marginBottom: 16,
    } as TextStyle,
    alertDesc: {
        fontSize: theme.typography.fontSize.bodyMd,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
        textAlign: "center" as const,
        lineHeight: 22,
        marginBottom: 32,
    } as TextStyle,
    alertBtn: {
        width: "100%",
        height: 52,
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    } as ViewStyle,
    projectionCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 32,
        padding: 32,
        ...theme.effects.shadows.ambient,
    } as ViewStyle,
    projHeader: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        marginBottom: 16,
    } as ViewStyle,
    projIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.secondaryContainer + "1A",
        alignItems: "center" as const,
        justifyContent: "center" as const,
    } as ViewStyle,
    projVal: {
        fontSize: theme.typography.fontSize.displaySm,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onSurface,
        marginBottom: 16,
    } as TextStyle,
    limitBar: {
        height: 8,
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 4,
        overflow: "hidden" as const,
        marginBottom: 12,
    } as ViewStyle,
    limitText: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceVariant,
        letterSpacing: 0.5,
    } as TextStyle,
    statusText: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.secondary,
    } as TextStyle,
    tipCard: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 32,
        padding: 32,
        marginBottom: 80,
    } as ViewStyle,
    tipTitle: {
        fontSize: theme.typography.fontSize.titleMd,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurface,
        marginBottom: 12,
    } as TextStyle,
    tipDesc: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 20,
        marginBottom: 20,
    } as TextStyle,
    tipLink: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 8,
    } as ViewStyle,
    tipLinkText: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.primary,
    } as TextStyle,
    btnText: {
        fontSize: theme.typography.fontSize.bodyMd,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onPrimary,
    } as TextStyle,
  }), [theme, isDark]);

    const progress = useSharedValue(0);
    useEffect(() => {
        progress.value = withTiming(1, { duration: 1000 });
    }, [insights]);

    const sectors = useMemo(() => {
        if (!insights?.breakdown || insights.breakdown.length === 0) return [];
        
        const palette = [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary, theme.colors.warning, theme.colors.info];
        
        let currentRotation = -90;
        return insights.breakdown.map((item: { category: string; amount: number; percentage: number }, i: number) => {
            const val = Math.round(item.percentage);
            const rotation = currentRotation;
            currentRotation += (val * 3.6);
            return {
                label: item.category,
                val: val,
                color: palette[i % palette.length],
                rotation: rotation
            };
        });
    }, [insights, theme]);

  if (insightsLoading || statsLoading) {
    return (
      <ScreenWrapper>
        <DashboardSkeleton />
      </ScreenWrapper>
    )
  }

  if (insightsError || statsError) {
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
    >
        <Text style={dynamicStyles.subtitle}>FINANCIAL PERFORMANCE</Text>
        <Text style={dynamicStyles.mainTitle}>Monthly Insights</Text>

        {/* Spending by Category */}
        <View style={dynamicStyles.card}>
          <View style={dynamicStyles.cardHeader}>
             <Text style={dynamicStyles.cardTitle}>Spending by Category</Text>
             <View style={dynamicStyles.periodBadge}>
                <Text style={dynamicStyles.periodText}>{new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()).toUpperCase()}</Text>
             </View>
          </View>
          
          <View style={dynamicStyles.chartBox}>
              <Svg width="180" height="180" viewBox="0 0 100 100">
                <G transform="scale(1)">
                    {sectors.map((s: { color: string; val: number; rotation: number }, i: number) => (
                        <DonutSector key={`sector-${i}`} s={s} progress={progress} />
                    ))}
                </G>
                <Circle cx="50" cy="50" r="28" fill={theme.colors.card} />
              </Svg>
             <View style={dynamicStyles.totalBox}>
                <Text style={dynamicStyles.totalLabel}>TOTAL</Text>
                <Text style={dynamicStyles.totalVal} adjustsFontSizeToFit numberOfLines={1}>{currencySymbol}{privacyEnabled ? '••••' : convertAmount(stats?.totalExpense || 0).toLocaleString()}</Text>
             </View>
          </View>

          <View style={{ marginTop: 12 }}>
             {insights?.breakdown.map((item: { category: string; amount: number; percentage: number }, i: number) => (
                <View key={`legend-${i}`} style={dynamicStyles.legendRow}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: sectors[i]?.color }} />
                  <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>{item.category.toUpperCase()}</Text>
                </View>
                <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface }}>{currencySymbol}{privacyEnabled ? '••••' : convertAmount(item.amount).toLocaleString()}</Text>
              </View>
             ))}
          </View>
        </View>

        {/* Weekly Comparison */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Weekly Distribution</Text>
          <Text style={[dynamicStyles.subtitle, { marginTop: 4, marginBottom: 0 }]}>Trend of last 7 unique days</Text>
          
          <View style={dynamicStyles.weekChart}>
              {insights?.trends.map((t: { date: string; amount: number; day: string }, i: number) => (
                  <AnimatedBar 
                     key={`trend-${i}`} 
                     t={t} 
                     max={Math.max(...insights.trends.map((x: { amount: number }) => x.amount), 1)} 
                     i={i} 
                     count={insights.trends.length} 
                     progress={progress} 
                     dynamicStyles={dynamicStyles} 
                  />
              ))}
           </View>

           <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <View>
                    <Text style={dynamicStyles.subtitle}>THIS WEEK</Text>
                    <Text style={dynamicStyles.totalVal}>{currencySymbol}{privacyEnabled ? '••••' : (convertAmount(insights?.comparison.thisWeekTotal || 0).toLocaleString())}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={dynamicStyles.subtitle}>VS LAST WEEK</Text>
                    {(() => {
                        const diff = (insights?.comparison.thisWeekTotal || 0) - (insights?.comparison.lastWeekTotal || 0);
                        const percent = insights?.comparison.lastWeekTotal ? Math.round((diff / insights.comparison.lastWeekTotal) * 100) : 0;
                        const isUp = diff > 0;
                        return (
                            <Text style={[dynamicStyles.totalVal, { color: isUp ? theme.colors.tertiary : theme.colors.success }]}>
                                {isUp ? '+' : ''}{percent}% {isUp ? 'INCREASE' : 'SAVED'}
                            </Text>
                        );
                    })()}
                </View>
           </View>

          <View style={dynamicStyles.trendInfo}>
             <TrendingUp size={16} color={theme.colors.tertiary} />
             <Text style={dynamicStyles.trendText}>
                <Text style={{ fontFamily: theme.typography.fontFamily.headlineBold }}>Data sync complete. </Text>
                Your spending patterns are synchronized from the live vault.
             </Text>
          </View>
        </View>

        {/* Top Spending Alert Card */}
        <View style={dynamicStyles.alertCard}>
            <View style={dynamicStyles.alertIconBox}>
                <Lightbulb size={28} color={theme.colors.primary} fill={theme.colors.primary + "40"} />
            </View>
            <Text style={dynamicStyles.alertTitle}>AI Financial Insight</Text>
            <Text style={dynamicStyles.alertDesc}>
               Based on your transaction history, <Text style={{ color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.headlineBold }}>You are following a healthy saving pattern</Text>. Your utilities are stable this month. Consider allocating <Text style={{ color: theme.colors.secondary, fontFamily: theme.typography.fontFamily.headlineBold }}>{currencySymbol}{privacyEnabled ? '••••' : convertAmount(250).toLocaleString()}</Text> more to your Emergency Fund next month.
            </Text>
            <Pressable style={dynamicStyles.alertBtn}>
               <Text style={dynamicStyles.btnText}>Optimize Plan</Text>
            </Pressable>
        </View>

        {/* Projected End of Month */}
        <View style={dynamicStyles.projectionCard}>
            <View style={dynamicStyles.projHeader}>
               <View>
                  <Text style={dynamicStyles.cardTitle}>Estimated Projection</Text>
                  <Text style={[dynamicStyles.subtitle, { textTransform: "none", fontSize: 11, marginBottom: 0 }]}>Based on average daily velocity</Text>
               </View>
               <View style={dynamicStyles.projIcon}>
                  <TrendingUp size={20} color={theme.colors.secondary} />
               </View>
            </View>
            {(() => {
                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const currentDay = now.getDate();
                const dailyVelocity = (stats?.totalExpense || 0) / Math.max(currentDay, 1);
                const projectedExpense = dailyVelocity * daysInMonth;

                return (
                  <Text style={dynamicStyles.projVal}>{currencySymbol}{privacyEnabled ? '••••' : (convertAmount(projectedExpense).toLocaleString(undefined, { maximumFractionDigits: 0 }))}</Text>
                );
            })()}
            <View style={dynamicStyles.limitBar}>
                <View style={{ 
                    width: `${Math.min(100, (insights?.comparison.thisMonthTotal || 0) / (insights?.comparison.lastMonthTotal || 1) * 100)}%`, 
                    height: "100%", 
                    backgroundColor: (insights?.comparison.thisMonthTotal || 0) > (insights?.comparison.lastMonthTotal || 0) ? theme.colors.tertiary : theme.colors.success, 
                    borderRadius: 4 
                }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
               <Text style={dynamicStyles.limitText}>MONTH OVER MONTH TREND</Text>
               <Text style={[dynamicStyles.statusText, { color: (insights?.comparison.thisMonthTotal || 0) > (insights?.comparison.lastMonthTotal || 0) ? theme.colors.tertiary : theme.colors.success }]}>
                  {(insights?.comparison.thisMonthTotal || 0) > (insights?.comparison.lastMonthTotal || 0) ? 'OVER-RUNNING' : 'LOCAL SAVING'}
               </Text>
            </View>
        </View>

        <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};
