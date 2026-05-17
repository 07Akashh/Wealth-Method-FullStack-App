import { LinearGradient } from "expo-linear-gradient";
import {
  Asterisk,
  Edit3,
  Flame,
  Home,
  Plane,
  Quote,
  Sparkles,
  Target as TargetIcon,
  Trash2,
  TrendingUp
} from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { ActivityIndicator } from "react-native";
import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";
import { ScreenWrapper } from "../../../components/layout/ScreenWrapper";
import { useDashboardStats, useGoals } from "../../../lib/TanstackQuery/QueryHooks";
import { useUserStore } from "../../../store/userStore";
import { useAppTheme } from "../../../theme/ThemeProvider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Replaced hardcoded objectives with SQLite data
const targetObjectives: any[] = [];

import { toast } from "@backpackapp-io/react-native-toast";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useDeleteGoal } from "../../../lib/TanstackQuery/QueryHooks";
import { useBottomSheetStore } from "../../../store/bottomSheetStore";

export const AssetVaultScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { currencySymbol, privacyEnabled, convertAmount } = useUserStore();
  const { data: goals = [], isLoading: isGoalsLoading, isError: goalsError, refetch: goalsRefetch } = useGoals();
  const { data: dashboardStats, isLoading: isStatsLoading, isError: statsError, refetch: statsRefetch } = useDashboardStats();
  const openBottomSheet = useBottomSheetStore(state => state.open);
  const navigation = useNavigation<any>();
  const { mutate: deleteGoal } = useDeleteGoal();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      goalsRefetch(),
      statsRefetch(),
    ]);
    setRefreshing(false);
  };

  const handleRetry = () => {
    handleRefresh();
  };

  const isLoading = isGoalsLoading || isStatsLoading;

  const stats = useMemo(() => {
    const totalTarget = goals.reduce((sum: number, g: any) => sum + g.targetAmount, 0);
    // Use ACTUAL liquid balance for the main overall saving progress
    const totalCurrent = dashboardStats?.balance || 0;
    const avgStreak = goals.length ? Math.round(goals.reduce((sum: number, g: any) => sum + g.streak, 0) / goals.length) : 0;
    
    // Calculate Monthly Saving Capacity
    const monthlyIncome = dashboardStats?.totalIncome || 0;
    const monthlyExpense = dashboardStats?.totalExpense || 0;
    const monthlySavings = Math.max(0, monthlyIncome - monthlyExpense); // Simplified monthly rate
    
    // Projection: Months to reach all targets
    const remaining = Math.max(0, totalTarget - totalCurrent);
    const monthsToTarget = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : Infinity;

    return { totalTarget, totalCurrent, avgStreak, monthlySavings, monthsToTarget };
  }, [goals, dashboardStats]);

  const goal = goals[0]; // Primary goal for top display if needed, or use stats

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (statsError || goalsError) {
    return (
        <ScreenWrapper>
            <ErrorState onRetry={handleRetry} />
        </ScreenWrapper>
    );
  }

  const dynamicStyles = useMemo(
    () => ({
      topCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xxl,
        padding: theme.spacing.xl,
        alignItems: "center" as const,
        ...theme.effects.shadows.ambient,
      } as ViewStyle,
      topCardLabel: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceDim,
        letterSpacing: theme.typography.letterSpacing.label,
        textTransform: "uppercase" as const,
      } as TextStyle,
      mainTarget: {
        fontSize: theme.typography.fontSize.displaySm,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onSurface,
        letterSpacing: theme.typography.letterSpacing.display,
      } as TextStyle,
      mainTargetTotal: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.typography.fontFamily.displayBold,
      },
      topMessage: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
        textAlign: "center" as const,
        marginTop: 12,
        lineHeight: 18,
        paddingHorizontal: 20,
      } as TextStyle,
      streakBadge: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: theme.colors.tertiaryContainer + "20",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 20,
        gap: 6,
      } as ViewStyle,
      streakText: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.tertiary,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      } as TextStyle,
      quoteCard: {
        borderRadius: 32,
        padding: 32,
        overflow: "hidden" as const,
      } as ViewStyle,
      quoteText: {
        fontSize: theme.typography.fontSize.headlineSm,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onPrimary,
        lineHeight: 28,
        marginTop: 12,
      } as TextStyle,
      quoteAuthor: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onPrimary + "CC",
        marginTop: 16,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
      } as TextStyle,
      sectionHeader: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        paddingHorizontal: 4,
      } as ViewStyle,
      sectionTitle: {
        fontSize: theme.typography.fontSize.titleLg,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onSurface,
      } as TextStyle,
      manageAll: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.primary,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      } as TextStyle,
      objectiveCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        padding: 24,
        // marginBottom: 16,
        borderWidth: 1,
        borderColor: isDark
          ? theme.colors.outlineVariant + "20"
          : "transparent",
        ...theme.effects.shadows.ambient,
      } as ViewStyle,
      objTop: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        marginBottom: 16,
      } as ViewStyle,
      objIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      } as ViewStyle,
      objStatus: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
      } as ViewStyle,
      objStatusText: {
        fontSize: 10,
        fontFamily: theme.typography.fontFamily.headlineBold,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      } as TextStyle,
      objTitle: {
        fontSize: theme.typography.fontSize.titleMd,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurface,
      } as TextStyle,
      objProgress: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
        marginTop: 4,
      } as TextStyle,
      progressBarBg: {
        height: 6,
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 3,
        marginTop: 16,
        overflow: "hidden" as const,
      } as ViewStyle,
      objFooter: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        marginTop: 12,
      } as ViewStyle,
      footerText: {
        fontSize: 9,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceDim,
        letterSpacing: 0.5,
        textTransform: "uppercase" as const,
      } as TextStyle,
      projectionCard: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 32,
        padding: 24,
        marginBottom: 80,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant + "30",
      } as ViewStyle,
      projDesc: {
        fontSize: theme.typography.fontSize.bodySm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 20,
        marginTop: 16,
        marginBottom: 24,
      } as TextStyle,
      projBtns: {
        flexDirection: "row" as const,
        gap: 12,
        marginBottom: 32,
      } as ViewStyle,
      btnPrimary: {
        flex: 3,
        height: 52,
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        justifyContent: "center" as const,
        alignItems: "center" as const,
      } as ViewStyle,
      btnSecondary: {
        flex: 2,
        height: 52,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 16,
        justifyContent: "center" as const,
        alignItems: "center" as const,
      } as ViewStyle,
      btnText: {
        fontSize: 13,
        fontFamily: theme.typography.fontFamily.headlineBold,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
        color: theme.colors.onPrimary,
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
      statRow: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: theme.radius.md,
        marginBottom: 12,
        ...theme.effects.shadows.ambient,
      } as ViewStyle,
      statIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: theme.colors.surfaceContainerHighest,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        marginRight: 12,
      } as ViewStyle,
      statLabel: {
        flex: 1,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.headlineSemi,
        color: theme.colors.onSurfaceDim,
        lineHeight: 18,
      } as TextStyle,
      statVal: {
        fontSize: 15,
        fontFamily: theme.typography.fontFamily.displayBold,
        color: theme.colors.onSurface,
      } as TextStyle,
    }),
    [theme, isDark],
  );

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 1200 });
  }, [goal]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  // Radius for circular progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <ScreenWrapper
      onRefresh={handleRefresh}
      refreshing={refreshing}
      floatingContent={
        <Pressable 
          style={[dynamicStyles.fab, { bottom: Platform.OS === 'ios' ? 120 : 100, right: 24, backgroundColor: theme.colors.primary }]} 
          onPress={() => openBottomSheet('add-goal')}
        >
          <TargetIcon size={32} color={theme.colors.onPrimary} strokeWidth={2.5} />
        </Pressable>
      }
    >
        {/* Monthly Goal Header */}
        <View style={dynamicStyles.topCard}>
          <Text style={dynamicStyles.topCardLabel}>MONTHLY SAVING GOAL</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Svg height="120" width="120" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke={theme.colors.surfaceContainerHigh}
                strokeWidth="8"
                fill="none"
              />
              <AnimatedCircle
                cx="50"
                cy="50"
                r={radius}
                stroke={theme.colors.primary}
                strokeWidth="8"
                strokeDasharray={circumference}
                animatedProps={useAnimatedProps(() => {
                  const percent = stats.totalTarget > 0 ? Math.min(stats.totalCurrent / stats.totalTarget, 1) : 0;
                  const targetOffset = circumference * (1 - percent);
                  return {
                    strokeDashoffset: circumference - (circumference - targetOffset) * progress.value,
                  };
                })}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 50 50)"
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <Text
                  style={[
                    styles.percentText,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: theme.typography.fontFamily.displayBold,
                    },
                  ]}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {`${stats.totalTarget > 0 ? Math.round((stats.totalCurrent / stats.totalTarget) * 100) : 0}%`}
                </Text>
                <Text
                  style={[
                    styles.percentLabel,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontFamily: theme.typography.fontFamily.headlineBold,
                    },
                  ]}
                >
                  COMPLETE
                </Text>
              </View>
            </Svg>
          </View>

          <Text style={[dynamicStyles.mainTarget, { marginTop: 24 }]} adjustsFontSizeToFit numberOfLines={1}>
            {`${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.totalCurrent).toLocaleString()} / ${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.totalTarget).toLocaleString()}`}
          </Text>
          <Text style={dynamicStyles.topMessage}>
            {stats.totalCurrent >= stats.totalTarget 
              ? "Incredible! You've reached your total savings target. Time to optimize and invest."
              : `Your liquid vault balance is ${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.totalCurrent).toLocaleString()}. You need ${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.totalTarget - stats.totalCurrent).toLocaleString()} more to hit all objectives.`}
          </Text>

          <View style={dynamicStyles.streakBadge}>
            <Flame
              size={14}
              color={theme.colors.tertiary}
              fill={theme.colors.tertiary}
            />
            <Text style={dynamicStyles.streakText}>{`${stats.avgStreak} days avg. streak`}</Text>
          </View>
        </View>

        {/* Motivational Quote */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={dynamicStyles.quoteCard}
        >
          <Quote size={32} color={theme.colors.onPrimary + "40"} />
          <Text style={dynamicStyles.quoteText}>
            Financial freedom is a mental, emotional and educational process.
          </Text>
          <Text style={dynamicStyles.quoteAuthor}>— ROBERT KIYOSAKI</Text>
        </LinearGradient>

        {/* Target Objectives */}
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionTitle}>Vault Objectives</Text>
        </View>

        {(() => {
          let remainingBalance = stats.totalCurrent;
          return goals.map((obj: any, idx: number) => {
            const allocatedAmount = Math.min(obj.targetAmount, Math.max(0, remainingBalance));
            remainingBalance -= allocatedAmount;
            const goalKey = obj.id || obj._id || obj.syncId || `${obj.title || 'goal'}-${idx}`;
            
            const percent = Math.round((allocatedAmount / obj.targetAmount) * 100);
            const palette = [
              { color: "#059669", bg: "#05966915", icon: Home },
              { color: "#4f46e5", bg: "#4f46e515", icon: Plane },
              { color: "#be185d", bg: "#be185d15", icon: Asterisk },
            ];
            const style = palette[idx % palette.length];

            return (
              <Pressable 
                  key={goalKey}
                  style={dynamicStyles.objectiveCard}
                  onPress={() => navigation.navigate('GoalDetail', { goal: obj, allocatedAmount })}
                  onLongPress={() => openBottomSheet('add-goal', obj)}
              >
                <View style={dynamicStyles.objTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                        style={[
                        dynamicStyles.objIconBox,
                        { backgroundColor: style.color + "15" },
                        ]}
                    >
                        <style.icon size={22} color={style.color} />
                    </View>
                    <View>
                        <Text style={dynamicStyles.objTitle}>{obj.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Flame size={10} color={theme.colors.tertiary} fill={theme.colors.tertiary} />
                            <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.tertiary }}>{`${obj.streak} DAY STREAK`}</Text>
                        </View>
                    </View>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Pressable 
                        onPress={(e) => {
                            e.stopPropagation();
                            openBottomSheet('add-goal', obj);
                        }}
                        style={{ padding: 6 }}
                    >
                        <Edit3 size={18} color={theme.colors.onSurfaceVariant} />
                    </Pressable>
                    <Pressable 
                        onPress={(e) => {
                            e.stopPropagation();
                            Alert.alert("Delete Goal", "Remove this objective?", [
                                { text: "Cancel", style: "cancel" },
                                { text: "Delete", style: "destructive", onPress: () => deleteGoal(obj.id, { onSuccess: () => toast.success("Goal Deleted") }) }
                            ]);
                        }}
                        style={{ padding: 6 }}
                    >
                        <Trash2 size={18} color={theme.colors.error} />
                    </Pressable>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
                    <Text style={[dynamicStyles.objProgress, { marginTop: 0 }]} adjustsFontSizeToFit numberOfLines={1}>
                    {`${currencySymbol}${privacyEnabled ? '••••' : convertAmount(allocatedAmount).toLocaleString()} of ${currencySymbol}${privacyEnabled ? '••••' : convertAmount(obj.targetAmount).toLocaleString()}`}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.displayBold, color: style.color }}>{`${percent}%`}</Text>
                </View>

                <View style={dynamicStyles.progressBarBg}>
                  <View
                    style={{
                      height: "100%",
                      width: `${percent}%`,
                      backgroundColor: style.color,
                      borderRadius: 3,
                    }}
                  />
                </View>
                <View style={dynamicStyles.objFooter}>
                  <Text style={dynamicStyles.footerText}>{`Auto-allocated from Vault • ${percent >= 100 ? 'FUNDED' : 'PROGRESSING'}`}</Text>
                </View>
              </Pressable>
            );
          });
        })()}

        {goals.length === 0 && (
            <EmptyState 
                title="No Goals Found" 
                message="Your financial vault is ready for its first objective. Set a target to start tracking your wealth trajectory." 
                Icon={TargetIcon} 
                style={{ marginTop: 20 }}
            />
        )}

        {/* Growth Projection Section */}
        <View style={dynamicStyles.projectionCard}>
          <Text
            style={[
              dynamicStyles.sectionTitle,
              { fontSize: theme.typography.fontSize.titleLg },
            ]}
          >
            Growth Projection
          </Text>
          <Text style={dynamicStyles.projDesc}>
            {`Based on your monthly saving rate of `}<Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily.headlineBold }}>{`${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.monthlySavings).toLocaleString()}`}</Text>{`, you are on path to reaching all target objectives in `}
            <Text style={{ color: theme.colors.secondary, fontFamily: theme.typography.fontFamily.displayBold }}>{`${stats.monthsToTarget === Infinity ? "..." : `${stats.monthsToTarget} months`}.`}</Text>
          </Text>

          <View style={dynamicStyles.projBtns}>
            <Pressable style={dynamicStyles.btnPrimary}>
              <Text style={dynamicStyles.btnText}>Optimize Strategy</Text>
            </Pressable>
            <Pressable style={dynamicStyles.btnSecondary}>
              <Text
                style={[
                  dynamicStyles.btnText,
                  { color: theme.colors.onSurface },
                ]}
              >
                View Details
              </Text>
            </Pressable>
          </View>

          <View style={dynamicStyles.statRow}>
            <View style={dynamicStyles.statIcon}>
              <TrendingUp
                size={16}
                color={theme.colors.secondary}
                strokeWidth={3}
              />
            </View>
            <Text style={dynamicStyles.statLabel}>
              Current Monthly Savings
            </Text>
            <Text style={dynamicStyles.statVal} adjustsFontSizeToFit numberOfLines={1}>{`${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.monthlySavings).toLocaleString()}`}</Text>
          </View>

          <View style={[dynamicStyles.statRow, { marginBottom: 0 }]}>
            <View style={dynamicStyles.statIcon}>
              <Sparkles
                size={16}
                color={theme.colors.primary}
                fill={theme.colors.primary}
              />
            </View>
            <Text style={dynamicStyles.statLabel}>
              Potential Interest (APY)
            </Text>
            <Text
              style={[dynamicStyles.statVal, { color: theme.colors.secondary }]}
            >
              {`+${currencySymbol}${privacyEnabled ? '••••' : convertAmount(stats.totalCurrent * 0.05 / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  percentText: {
    fontSize: 24,
    textAlign: "center",
  },
  percentLabel: {
    fontSize: 8,
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: -2,
  },
});
