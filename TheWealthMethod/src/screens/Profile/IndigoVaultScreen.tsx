import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import {
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Wallet,
  Landmark,
  CreditCard,
  Home,
  Plus,
  Scan,
  MoreVertical,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useUserStore } from "../../store/userStore";

const { width } = Dimensions.get("window");

const VaultValueCard = ({ label, value, sub, icon: Icon, color, synced }: any) => {
  const { theme } = useAppTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.outlineVariant + "30" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
         <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: color + "10", alignItems: "center", justifyContent: "center" }}>
            <Icon size={24} color={color} />
         </View>
         <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 20, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface }}>{value}</Text>
            {sub && <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.success }}>{sub}</Text>}
         </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
         <View>
            <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>{label}</Text>
            <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>{label.includes('Fidelity') ? '401(k) Plan •••• 0192' : 'Brokerage •••• 8829'}</Text>
         </View>
         <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.success }} />
            <Text style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceVariant, textTransform: "uppercase" }}>SYNCED {synced}</Text>
         </View>
      </View>
    </View>
  );
};

export const IndigoVaultScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { fetchProfile } = useUserStore();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const styles = useThemedStyles((t) => ({
    container: {
      paddingBottom: 40,
    } as ViewStyle,
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 32,
    } as ViewStyle,
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: t.colors.surfaceContainerHigh,
    } as ImageStyle,
    brand: {
      fontSize: 20,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.primary,
    } as TextStyle,
    vaultSummary: {
      marginBottom: 32,
    } as ViewStyle,
    summaryLabel: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceDim,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    } as TextStyle,
    totalRow: {
       flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "center",
    } as ViewStyle,
    totalValue: {
       fontSize: 38,
       fontFamily: t.typography.fontFamily.displayBold,
       color: t.colors.onSurface,
    } as TextStyle,
    refreshBtn: {
       flexDirection: "row",
       alignItems: "center",
       backgroundColor: t.colors.surfaceContainerHighest,
       paddingHorizontal: 12,
       paddingVertical: 10,
       borderRadius: 12,
       gap: 6,
    } as ViewStyle,
    refreshText: {
       fontSize: 11,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurface,
       textAlign: "center",
       width: 48,
    } as TextStyle,
    chartCard: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 32,
       padding: 24,
       marginBottom: 40,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
       overflow: "hidden",
    } as ViewStyle,
    perfBadge: {
       flexDirection: "row",
       alignItems: "center",
       backgroundColor: t.colors.success + "15",
       paddingHorizontal: 10,
       paddingVertical: 6,
       borderRadius: 12,
       alignSelf: "flex-start",
       gap: 4,
       marginBottom: 16,
    } as ViewStyle,
    perfText: {
       fontSize: 11,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.success,
    } as TextStyle,
    sectionHeader: {
       flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "baseline",
       marginBottom: 20,
    } as ViewStyle,
    sectionTitle: {
       fontSize: 22,
       fontFamily: t.typography.fontFamily.displayBold,
       color: t.colors.onSurface,
    } as TextStyle,
    sectionMeta: {
       fontSize: 10,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurfaceDim,
       textTransform: "uppercase",
    } as TextStyle,
    cashBox: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 24,
       padding: 24,
       marginBottom: 40,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
    } as ViewStyle,
    cashRow: {
       flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "center",
       marginTop: 16,
       paddingTop: 16,
       borderTopWidth: 1,
       borderColor: t.colors.outlineVariant + "20",
    } as ViewStyle,
    otherCard: {
       backgroundColor: t.colors.surfaceContainerLow, 
       borderRadius: 24, 
       padding: 20, 
       marginBottom: 16,
       borderWidth: 1, 
       borderColor: t.colors.outlineVariant + "30"
    } as ViewStyle,
    addBtn: {
       height: 80,
       borderRadius: 20,
       borderWidth: 2,
       borderColor: t.colors.outlineVariant + "40",
       borderStyle: "dashed",
       justifyContent: "center",
       alignItems: "center",
       gap: 8,
       marginTop: 24,
    } as ViewStyle,
  }));

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container} refreshing={refreshing} onRefresh={handleRefresh}>
      {/* Custom Hub Header */}


      {/* Vault Summary */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.vaultSummary}>
         <Text style={styles.summaryLabel}>Total Vault Value</Text>
         <View style={styles.totalRow}>
            <Text style={styles.totalValue}>$1,482,934.12</Text>
            <Pressable style={styles.refreshBtn}>
               <RefreshCw size={14} color={theme.colors.onSurface} />
               <Text style={styles.refreshText}>Refresh{"\n"}All</Text>
            </Pressable>
         </View>
      </Animated.View>

      {/* Performance Chart */}
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.chartCard}>
         <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={styles.perfBadge}>
               <TrendingUp size={12} color={theme.colors.success} />
               <Text style={styles.perfText}>+12.4%</Text>
            </View>
            <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>Past 30 days performance</Text>
         </View>
         
         <View style={{ height: 100, width: '100%', marginTop: 20 }}>
            <Svg height="100" width={width - 88}>
               <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                     <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.2" />
                     <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
                  </LinearGradient>
               </Defs>
               <Path
                  d="M0,80 Q30,70 60,85 T120,40 T180,60 T240,20 T300,50"
                  fill="none"
                  stroke={theme.colors.primary}
                  strokeWidth="3"
               />
               <Path
                  d="M0,80 Q30,70 60,85 T120,40 T180,60 T240,20 T300,50 V100 H0 Z"
                  fill="url(#grad)"
               />
            </Svg>
         </View>
      </Animated.View>

      {/* Investment Accounts */}
      <View style={styles.sectionHeader}>
         <Text style={styles.sectionTitle}>Investment Accounts</Text>
         <Text style={styles.sectionMeta}>3 CONNECTIONS ACTIVE</Text>
      </View>
      <VaultValueCard 
        label="Goldman Sachs Private" 
        value="$842,102.50" 
        sub="+$4,203.11 today" 
        icon={Landmark} 
        color={theme.colors.primary} 
        synced="3M AGO" 
      />
      <VaultValueCard 
        label="Fidelity Investments" 
        value="$412,050.00" 
        sub="+$1,120.00 today" 
        icon={TrendingUp} 
        color={theme.colors.tertiary} 
        synced="12M AGO" 
      />

      {/* Cash Liquidity */}
      <View style={[styles.cashBox, { marginTop: 24 }]}>
         <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.success + "10", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Wallet size={24} color={theme.colors.success} />
         </View>
         <Text style={styles.summaryLabel}>Cash Liquidity</Text>
         <Text style={[styles.totalValue, { fontSize: 32 }]}>$228,781.62</Text>
         
         <View style={styles.cashRow}>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyMedium, color: theme.colors.onSurfaceVariant }}>Chase Private Client</Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>$182k</Text>
         </View>
         <View style={[styles.cashRow, { borderTopWidth: 0, paddingTop: 8 }]}>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyMedium, color: theme.colors.onSurfaceVariant }}>Marcus Savings</Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>$46k</Text>
         </View>

         <Pressable style={{ alignSelf: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.primary, textTransform: "uppercase", letterSpacing: 1 }}>Manage Cash</Text>
         </Pressable>
      </View>

      {/* Other Liabilities */}
      <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Other Liabilities & Credit</Text>
      
      {/* AMEX Platinum */}
      <View style={styles.otherCard}>
         <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <View style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
               <Text style={{ fontSize: 8, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.surface }}>AMEX</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
               <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.success }} />
               <Text style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceVariant }}>CONNECTED</Text>
            </View>
         </View>
         <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, textTransform: "uppercase" }}>PLATINUM CARD</Text>
         <Text style={{ fontSize: 24, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.danger }}>-$4,212.45</Text>
      </View>

      {/* Rocket Mortgage */}
      <View style={styles.otherCard}>
         <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Home size={20} color={theme.colors.primary} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
               <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.success }} />
               <Text style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceVariant }}>VERIFIED</Text>
            </View>
         </View>
         <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, textTransform: "uppercase" }}>ROCKET MORTGAGE</Text>
         <Text style={{ fontSize: 24, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface }}>$1,250,000.00</Text>
         <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>Property Value Estimate</Text>
      </View>

      <Pressable style={styles.addBtn}>
         <Plus size={24} color={theme.colors.onSurfaceDim} />
         <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim }}>Add Institutional Asset</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};
