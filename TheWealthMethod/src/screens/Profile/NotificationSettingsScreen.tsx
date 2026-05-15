import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  Switch,
  TextStyle,
  ViewStyle,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import {
  Bell,
  ChevronRight,
  Shield,
  Zap,
  Coffee,
  Wallet,
  Check,
  Plus,
  Moon,
  Sun,
  Layout,
  BarChart3,
  Target,
  PlusCircle,
  ReceiptText,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useUserStore } from "../../store/userStore";

const NotificationSettingItem = ({ 
  label, 
  value, 
  onValueChange, 
  isCheckbox = false 
}: { 
  label: string; 
  value: boolean; 
  onValueChange: (v: boolean) => void;
  isCheckbox?: boolean;
}) => {
  const { theme } = useAppTheme();
  
  return (
    <Pressable 
      onPress={() => onValueChange(!value)}
      style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        paddingVertical: 14,
      }}
    >
      <Text style={{ 
        fontSize: 14, 
        fontFamily: theme.typography.fontFamily.bodyMedium, 
        color: theme.colors.onSurface 
      }}>
        {label}
      </Text>
      
      {isCheckbox ? (
        <View style={{ 
          width: 22, 
          height: 22, 
          borderRadius: 6, 
          borderWidth: 2, 
          borderColor: value ? theme.colors.primary : theme.colors.outlineVariant,
          backgroundColor: value ? theme.colors.primary : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {value && <Check size={14} color={theme.colors.surface} strokeWidth={3} />}
        </View>
      ) : (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }}
          thumbColor={Platform.OS === 'ios' ? undefined : (value ? theme.colors.surface : theme.colors.onSurfaceVariant)}
        />
      )}
    </Pressable>
  );
};

export const NotificationSettingsScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { monthlyLimit, updateProfile, fetchProfile } = useUserStore();
  const [limitInput, setLimitInput] = useState(monthlyLimit.toString());

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);
  
  // Silence Ritual
  const [silenceRitual, setSilenceRitual] = useState(true);
  
  // Smart Alerts Logic
  const [caffeineGuard, setCaffeineGuard] = useState(true);
  const [vaultSweep, setVaultSweep] = useState(true);
  
  // Wealth & Ops
  const [largeTransactions, setLargeTransactions] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [portfolioRebalance, setPortfolioRebalance] = useState(false);
  
  // Security
  const [newDeviceLogin, setNewDeviceLogin] = useState(true);
  const [passwordChanges, setPasswordChanges] = useState(true);
  const [atmWithdrawals, setAtmWithdrawals] = useState(true);
  
  // Marketing
  const [partnerOffers, setPartnerOffers] = useState(false);
  const [newFeatures, setNewFeatures] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const styles = useThemedStyles((t) => ({
    container: {
      paddingBottom: 40,
    } as ViewStyle,
    header: {
      marginBottom: 32,
    } as ViewStyle,
    title: {
      fontSize: 36,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      letterSpacing: -0.5,
    } as TextStyle,
    subtitle: {
      fontSize: 14,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
      lineHeight: 20,
      marginTop: 8,
      opacity: 0.8,
    } as TextStyle,
    section: {
      marginBottom: 32,
    } as ViewStyle,
    sectionCard: {
      backgroundColor: t.colors.surfaceContainerLow,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant + "40",
    } as ViewStyle,
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    } as ViewStyle,
    sectionLabel: {
      fontSize: 12,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceDim,
      letterSpacing: 1,
      textTransform: "uppercase",
    } as TextStyle,
    ritualTimeBox: {
      flexDirection: "row",
      gap: 12,
      marginVertical: 20,
    } as ViewStyle,
    timeCard: {
      flex: 1,
      backgroundColor: t.colors.surfaceContainerHigh,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    } as ViewStyle,
    timeLabel: {
      fontSize: 9,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceDim,
      textTransform: "uppercase",
      letterSpacing: 1,
    } as TextStyle,
    timeValue: {
       flexDirection: "row",
       alignItems: "center",
       gap: 8,
    } as ViewStyle,
    timeText: {
       fontSize: 20,
       fontFamily: t.typography.fontFamily.displayBold,
       color: t.colors.onSurface,
    } as TextStyle,
    dayPill: {
       paddingHorizontal: 12,
       paddingVertical: 8,
       borderRadius: 12,
       marginRight: 8,
    } as ViewStyle,
    dayPillActive: {
       backgroundColor: t.colors.primary,
    } as ViewStyle,
    dayPillInactive: {
       backgroundColor: "transparent",
    } as ViewStyle,
    dayText: {
       fontSize: 10,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurface,
    } as TextStyle,
    dayTextActive: {
       color: t.colors.surface,
    } as TextStyle,
    insightCard: {
       backgroundColor: t.colors.primary,
       borderRadius: 24,
       padding: 24,
       marginBottom: 32,
       gap: 16,
       position: "relative",
       overflow: "hidden",
    } as ViewStyle,
    insightTitle: {
       fontSize: 18,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.surface,
    } as TextStyle,
    insightDesc: {
       fontSize: 13,
       fontFamily: t.typography.fontFamily.bodyRegular,
       color: t.colors.surface,
       opacity: 0.9,
       lineHeight: 18,
    } as TextStyle,
    insightBtn: {
       backgroundColor: t.colors.surface,
       borderRadius: 12,
       paddingVertical: 12,
       alignItems: "center",
    } as ViewStyle,
    insightBtnText: {
       fontSize: 12,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.primary,
    } as TextStyle,
    alertSubtext: {
       fontSize: 12,
       fontFamily: t.typography.fontFamily.bodyRegular,
       color: t.colors.onSurfaceVariant,
       marginTop: 2,
    } as TextStyle,
    priceTag: {
       fontSize: 18,
       fontFamily: t.typography.fontFamily.displayBold,
       color: t.colors.tertiary,
       marginRight: 8,
    } as TextStyle,
    statusTag: {
       fontSize: 16,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.success,
       marginRight: 8,
    } as TextStyle,
  }));

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container} refreshing={refreshing} onRefresh={handleRefresh}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notification Logic</Text>
        <Text style={styles.subtitle}>
          Curate your digital banking experience with editorial precision and intelligent spend tracking.
        </Text>
      </View>

      {/* Spending Controls Section */}
      <View style={styles.section}>
         <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Spending Controls</Text>
         </View>
         <View style={styles.sectionCard}>
            <View style={{ marginBottom: 16 }}>
               <Text style={styles.sectionLabel}>GLOBAL MONTHLY LIMIT</Text>
               <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: 16, paddingHorizontal: 16, marginTop: 8, height: 56 }}>
                  <Text style={{ fontSize: 20, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurfaceDim, marginRight: 8 }}>$</Text>
                  <TextInput 
                    style={{ flex: 1, fontSize: 24, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.primary }}
                    value={limitInput}
                    onChangeText={setLimitInput}
                    keyboardType="numeric"
                    placeholder="5,000"
                    placeholderTextColor={theme.colors.onSurfaceDim}
                    onBlur={() => {
                        const val = parseFloat(limitInput);
                        if (!isNaN(val) && val > 0) {
                            updateProfile({ monthlyLimit: val });
                        } else {
                            setLimitInput(monthlyLimit.toString());
                        }
                    }}
                  />
               </View>
               <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 8 }}>Smart Alerts will trigger when single transactions exceed 40% of this vault limit.</Text>
            </View>
         </View>
      </View>

      {/* Silence Ritual Section */}
      <View style={styles.section}>
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Silence Ritual</Text>
              <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Automate your focus periods</Text>
            </View>
            <Switch 
              value={silenceRitual} 
              onValueChange={setSilenceRitual} 
              trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }}
            />
          </View>

          <View style={styles.ritualTimeBox}>
             <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Starts at</Text>
                <View style={styles.timeValue}>
                   <Moon size={18} color={theme.colors.primary} />
                   <Text style={styles.timeText}>22:00</Text>
                </View>
             </View>
             <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Ends at</Text>
                <View style={styles.timeValue}>
                   <Sun size={20} color={theme.colors.success} />
                   <Text style={styles.timeText}>07:30</Text>
                </View>
             </View>
          </View>

          <View style={{ flexDirection: "row" }}>
             {["Monday", "Tuesday", "Wednesday"].map((day, idx) => (
                <View key={day} style={[styles.dayPill, idx < 3 ? styles.dayPillActive : styles.dayPillInactive]}>
                   <Text style={[styles.dayText, idx < 3 ? styles.dayTextActive : { color: theme.colors.onSurfaceDim }]}>{day}</Text>
                </View>
             ))}
          </View>
        </View>
      </View>

      {/* Insight Engine Card */}
      <View style={styles.insightCard}>
         <Zap size={40} color={theme.colors.surface} style={{ opacity: 0.5, position: "absolute", top: 10, left: 10 }} />
         <View style={{ gap: 8 }}>
            <Text style={styles.insightTitle}>Insight Engine</Text>
            <Text style={styles.insightDesc}>Get curated wealth suggestions based on your cash flow.</Text>
         </View>
         <Pressable style={styles.insightBtn}>
            <Text style={styles.insightBtnText}>Enable Marketing</Text>
         </Pressable>
      </View>

      {/* Smart Alerts Logic */}
      <View style={styles.section}>
         <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Smart Alerts Logic</Text>
            <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
               <Plus size={14} color={theme.colors.primary} />
               <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.primary }}>New Rule</Text>
            </Pressable>
         </View>

         <View style={{ gap: 16 }}>
            {/* Caffeine Guard */}
            <View style={[styles.sectionCard, { paddingVertical: 16 }]}>
               <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: theme.colors.tertiaryContainer + "1A", alignItems: "center", justifyContent: "center" }}>
                     <Coffee size={24} color={theme.colors.tertiary} />
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Caffeine Guard</Text>
                     <Text style={styles.alertSubtext}>Alerting if monthly spend on Coffee exceeds <Text style={{ color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.headlineBold }}>$50.00</Text></Text>
                  </View>
               </View>
               <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, borderTopWidth: 1, borderColor: theme.colors.outlineVariant + "20", paddingTop: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                     <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, marginRight: 8 }}>CURRENT</Text>
                     <Text style={styles.priceTag}>$42.50</Text>
                  </View>
                  <Switch value={caffeineGuard} onValueChange={setCaffeineGuard} trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }} />
               </View>
            </View>

            {/* Vault Sweep */}
            <View style={[styles.sectionCard, { paddingVertical: 16 }]}>
               <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: theme.colors.secondaryContainer + "1A", alignItems: "center", justifyContent: "center" }}>
                     <Wallet size={24} color={theme.colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Vault Sweep</Text>
                     <Text style={styles.alertSubtext}>Notify when balance is above <Text style={{ color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.headlineBold }}>$10,000.00</Text> to move to ISA</Text>
                  </View>
               </View>
               <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, borderTopWidth: 1, borderColor: theme.colors.outlineVariant + "20", paddingTop: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                     <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, marginRight: 8 }}>STATUS</Text>
                     <Text style={styles.statusTag}>Active</Text>
                  </View>
                  <Switch value={vaultSweep} onValueChange={setVaultSweep} trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }} />
               </View>
            </View>
         </View>
      </View>

      {/* Wealth & Ops Checklist */}
      <View style={styles.section}>
         <Text style={[styles.sectionLabel, { marginBottom: 16 }]}>Wealth & Ops</Text>
         <View style={styles.sectionCard}>
            <NotificationSettingItem label="Large Transactions" value={largeTransactions} onValueChange={setLargeTransactions} isCheckbox />
            <NotificationSettingItem label="Daily Summary" value={dailySummary} onValueChange={setDailySummary} isCheckbox />
            <NotificationSettingItem label="Portfolio Rebalance" value={portfolioRebalance} onValueChange={setPortfolioRebalance} isCheckbox />
         </View>
      </View>

      {/* Security Checklist */}
      <View style={styles.section}>
         <Text style={[styles.sectionLabel, { marginBottom: 16 }]}>Security</Text>
         <View style={styles.sectionCard}>
            <NotificationSettingItem label="New Device Login" value={newDeviceLogin} onValueChange={setNewDeviceLogin} isCheckbox />
            <NotificationSettingItem label="Password Changes" value={passwordChanges} onValueChange={setPasswordChanges} isCheckbox />
            <NotificationSettingItem label="ATM Withdrawals" value={atmWithdrawals} onValueChange={setAtmWithdrawals} isCheckbox />
         </View>
      </View>

      {/* Marketing Checklist */}
      <View style={styles.section}>
         <Text style={[styles.sectionLabel, { marginBottom: 16 }]}>Marketing</Text>
         <View style={styles.sectionCard}>
            <NotificationSettingItem label="Partner Offers" value={partnerOffers} onValueChange={setPartnerOffers} isCheckbox />
            <NotificationSettingItem label="New Features" value={newFeatures} onValueChange={setNewFeatures} isCheckbox />
            <NotificationSettingItem label="Newsletter" value={newsletter} onValueChange={setNewsletter} isCheckbox />
         </View>
      </View>
      
      <View style={{ height: 60 }} />
    </ScreenWrapper>
  );
};
