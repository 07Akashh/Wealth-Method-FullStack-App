import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import { 
  Target, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  ShieldCheck,
  Zap
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { useUserStore } from '../../../store/userStore';
import { useDeleteGoal, useDashboardStats } from '../../../lib/TanstackQuery/QueryHooks';
import { useBottomSheetStore } from '../../../store/bottomSheetStore';
import { toast } from '@backpackapp-io/react-native-toast';

const { width } = Dimensions.get('window');

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PortalStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<PortalStackParamList, 'GoalDetail'>;

export const GoalDetailScreen = ({ route, navigation }: Props) => {
  const { goal, allocatedAmount: paramAllocated } = route.params as any;
  const { theme, isDark } = useAppTheme();
  const { currencySymbol, privacyEnabled, convertAmount } = useUserStore();
  const { mutate: deleteGoal } = useDeleteGoal();
  const { data: dashboardStats } = useDashboardStats();
  const openBottomSheet = useBottomSheetStore(state => state.open);

  // Use allocatedAmount from params (computed in list) for data consistency
  const allocatedAmount = paramAllocated !== undefined ? paramAllocated : goal.currentAmount;
  const percent = Math.round((allocatedAmount / goal.targetAmount) * 100);
  
  const handleEdit = () => {
    openBottomSheet('add-goal', goal);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Goal",
      `Are you sure you want to remove "${goal.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            const goalId = goal._id || goal.id;
            deleteGoal(goalId, {
              onSuccess: () => {
                navigation.goBack();
              }
            });
          } 
        }
      ]
    );
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 32,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant + '20',
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primaryContainer + '25',
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalIcon: {
        width: 64,
        height: 64,
        borderRadius: 22,
        backgroundColor: theme.colors.primaryContainer + '30',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    goalTitle: {
      fontSize: 28,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    goalMeta: {
      fontSize: 14,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    progressArea: {
      marginVertical: 32,
    },
    progressLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 12,
    },
    progressPercent: {
      fontSize: 48,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.primary,
    },
    progressText: {
      fontSize: 14,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    progressBar: {
      height: 12,
      backgroundColor: theme.colors.outlineVariant + '40',
      borderRadius: 6,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statItem: {
      flex: 1,
      minWidth: (width / 2) - 36,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant + '20',
    },
    statLabel: {
      fontSize: 11,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    statValue: {
      fontSize: 18,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
    },
    insightInfo: {
        backgroundColor: theme.colors.primaryContainer + '10',
        padding: 20,
        borderRadius: 24,
        marginTop: 24,
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary + '15',
    },
    insightTitle: {
        fontSize: 15,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    insightDesc: {
        fontSize: 13,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
    },
    statItemColored: {
        backgroundColor: theme.colors.secondaryContainer + '15',
        borderColor: theme.colors.secondary + '20',
    }
  }), [theme]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Pressable 
            onPress={handleEdit} 
            style={({ pressed }) => [
                dynamicStyles.editBtn, 
                { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Edit3 size={18} color={theme.colors.primary} />
          </Pressable>
          <Pressable 
            onPress={handleDelete} 
            style={({ pressed }) => [
                dynamicStyles.editBtn, 
                { backgroundColor: theme.colors.error + '15', opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </Pressable>
        </View>
      )
    });
  }, [goal, theme, navigation, dynamicStyles]);

  // Derived Values
  const status = percent >= 100 ? 'Funded' : 'Progressing';
  const remaining = Math.max(0, goal.targetAmount - allocatedAmount);

  // Dynamic projection based on real dashboard data
  const monthlySavings = Math.max(0, (dashboardStats?.totalIncome || 0) - (dashboardStats?.totalExpense || 0));
  const projectedGrowth = (monthlySavings > 0 ? (monthlySavings / (goal.targetAmount || 1)) * 100 : ((goal.streak || 0) * 0.4 + 2)).toFixed(1);
  
  // Dynamic target date estimation based on actual saving capacity
  const estimatedTargetDate = useMemo(() => {
    if (percent >= 100) return "ACHIEVED";
    const lastDate = new Date(goal.lastUpdated || new Date());
    const remainingVal = goal.targetAmount - allocatedAmount;
    
    // Estimate months using monthly saving capacity if available, otherwise fallback to 1 year baseline
    const monthsToAdd = monthlySavings > 0 
        ? Math.ceil(remainingVal / monthlySavings) 
        : Math.ceil(((goal.targetAmount - allocatedAmount) / (goal.targetAmount || 1)) * 12);

    lastDate.setMonth(lastDate.getMonth() + (monthsToAdd > 120 ? 120 : monthsToAdd)); // Cap at 10 years for UI
    return lastDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase();
  }, [goal, allocatedAmount, percent, monthlySavings]);

  return (
    <ScreenWrapper scrollable>
      <Animated.View entering={FadeInUp.duration(600)}>
        <View style={dynamicStyles.card}>
            <View style={dynamicStyles.goalIcon}>
                <Target size={32} color={theme.colors.primary} />
            </View>
            <Text style={dynamicStyles.goalTitle}>{goal.title}</Text>
            <View style={dynamicStyles.goalMeta}>
                <ShieldCheck size={16} color={theme.colors.success} />
                <Text style={{ color: theme.colors.success, fontFamily: theme.typography.fontFamily.headlineBold }}>{`${percent >= 100 ? 'FUNDED' : 'PROGRESSING'}`}</Text>
                <Text style={{ color: theme.colors.onSurfaceDim }}>•</Text>
                <Text style={{ color: theme.colors.onSurfaceDim, fontFamily: theme.typography.fontFamily.bodyRegular }}>{`ID: ${goal.id}`}</Text>
            </View>

            <View style={dynamicStyles.progressArea}>
                <View style={dynamicStyles.progressLabelRow}>
                    <Text style={dynamicStyles.progressPercent}>{`${percent}%`}</Text>
                    <Text style={dynamicStyles.progressText}>{`${currencySymbol}${privacyEnabled ? '••••' : convertAmount(allocatedAmount).toLocaleString()} / ${currencySymbol}${privacyEnabled ? '••••' : convertAmount(goal.targetAmount).toLocaleString()}`}</Text>
                </View>
                <View style={dynamicStyles.progressBar}>
                    <View style={[dynamicStyles.progressFill, { width: `${Math.min(100, percent)}%` }]} />
                </View>
            </View>

            <View style={dynamicStyles.statsGrid}>
                <View style={dynamicStyles.statItem}>
                    <Text style={dynamicStyles.statLabel}>Remaining</Text>
                    <Text style={dynamicStyles.statValue}>{`${currencySymbol}${privacyEnabled ? '••••' : convertAmount(remaining).toLocaleString()}`}</Text>
                </View>
                <View style={dynamicStyles.statItem}>
                    <Text style={dynamicStyles.statLabel}>Streak</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Zap size={16} color={theme.colors.tertiary} fill={theme.colors.tertiary} />
                        <Text style={dynamicStyles.statValue}>{`${goal.streak} Days`}</Text>
                    </View>
                </View>
            </View>
        </View>

        <View style={dynamicStyles.statsGrid}>
            <View style={[dynamicStyles.statItem, { backgroundColor: theme.colors.surfaceContainerLowest }]}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.primaryContainer + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Calendar size={20} color={theme.colors.primary} />
                </View>
                <Text style={dynamicStyles.statLabel}>Target Date</Text>
                <Text style={dynamicStyles.statValue}>{estimatedTargetDate}</Text>
            </View>
            <View style={[dynamicStyles.statItem, { backgroundColor: theme.colors.secondaryContainer + '15', borderColor: theme.colors.secondary + '20' }]}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.secondaryContainer + '40', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <TrendingUp size={20} color={theme.colors.secondary} />
                </View>
                <Text style={[dynamicStyles.statLabel, { color: theme.colors.secondary }]}>Proj. Growth</Text>
                <Text style={[dynamicStyles.statValue, { color: theme.colors.onSurface }]}>{`+${projectedGrowth}%`}</Text>
            </View>
        </View>

        <Animated.View entering={FadeIn.delay(400)}>
            <View style={dynamicStyles.insightInfo}>
                <Trophy size={24} color={theme.colors.primary} />
                <View style={{ flex: 1 }}>
                    <Text style={dynamicStyles.insightTitle}>Strategy Note</Text>
                    <Text style={dynamicStyles.insightDesc}>Accelerate this goal by enabling the "Vault Sweep" feature in your settings to auto-allocate leftovers.</Text>
                </View>
            </View>
        </Animated.View>
      </Animated.View>
    </ScreenWrapper>
  );
};
