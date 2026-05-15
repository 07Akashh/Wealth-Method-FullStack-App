import React, { useState, useMemo, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Pressable, ViewStyle, TextStyle } from "react-native";
import { 
  ShieldCheck, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldPlus
} from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";
import { PortalStackParamList, RootStackParamList } from "../../navigation/types";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthActions } from "../../features/auth/useAuthActions";
import { useUserStore } from "../../store/userStore";

type Props = CompositeScreenProps<
  NativeStackScreenProps<PortalStackParamList, "ChangePassword">,
  NativeStackScreenProps<RootStackParamList>
>;

export const ChangePasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme, isDark } = useAppTheme();
  // @ts-ignore - isForced is passed during temp pass redirect
  const isForced = route.params?.isForced || false;
  
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const { changePassword, loading } = useAuthActions();
  const { fetchProfile } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  // Configure header options dynamically
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isForced ? "Security Update" : "Change Password",
      headerLeft: isForced ? () => null : undefined, // Hide back button if forced
      gestureEnabled: !isForced, // Disable swipe back if forced
    });
  }, [navigation, isForced]);

  const styles = useThemedStyles((t) => ({
    container: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 40,
    } as ViewStyle,
    heroCard: {
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: 32,
      padding: 24,
      marginBottom: 24,
      overflow: "hidden",
      position: "relative",
    } as ViewStyle,
    heroIconBox: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    } as ViewStyle,
    heroTitle: {
      fontSize: 32,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      lineHeight: 38,
    } as TextStyle,
    heroDesc: {
      fontSize: 14,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
      lineHeight: 20,
      marginTop: 12,
      opacity: 0.8,
    } as TextStyle,
    practicesCard: {
      backgroundColor: t.colors.surfaceContainerLow,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1.5,
      borderColor: t.colors.outlineVariant,
      marginBottom: 32,
    } as ViewStyle,
    practicesHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    } as ViewStyle,
    practicesTitle: {
      fontSize: 16,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurface,
    } as TextStyle,
    practiceItem: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    } as ViewStyle,
    practiceText: {
      flex: 1,
      fontSize: 13,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
      lineHeight: 18,
    } as TextStyle,
    formCard: {
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: 32,
      padding: 24,
      borderWidth: 1.5,
      borderColor: t.colors.outlineVariant + "20",
    } as ViewStyle,
    label: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.primary,
      letterSpacing: 1.5,
      marginBottom: 8,
    } as TextStyle,
    title: {
      fontSize: 36,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      marginBottom: 32,
    } as TextStyle,
    form: {
      gap: 20,
    } as ViewStyle,
    changeBtn: {
      marginTop: 24,
    } as ViewStyle,
    forcedAlert: {
      padding: 16,
      backgroundColor: t.colors.error + "15",
      borderRadius: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: t.colors.error + "30",
    } as ViewStyle,
    forcedText: {
      color: t.colors.error,
      fontSize: 12,
      fontFamily: t.typography.fontFamily.headlineBold,
      textAlign: "center",
    } as TextStyle,
  }));

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) return;
    
    const success = await changePassword(currentPass, newPass);
    if (success) {
      if (isForced) {
        // If it was a forced change, go to dashboard (MainTabs)
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        navigation.goBack();
      }
    }
  };

  return (
    <ScreenWrapper 
      scrollable 
      contentContainerStyle={styles.container}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroIconBox}>
          <ShieldPlus size={80} color={theme.colors.primary} style={{ opacity: 0.15, position: "absolute", top: -10 }} />
          <ShieldCheck size={64} color={theme.colors.primary} />
        </View>
        <Text style={styles.heroTitle}>{isForced ? "Initial Setup" : "Secure Your\nPresence"}</Text>
        <Text style={styles.heroDesc}>
          {isForced 
            ? "Your account was accessed via temporary credentials. Please establish a permanent secure password to continue."
            : "Ensure your financial journey remains protected with a robust, updated passphrase."}
        </Text>
      </View>

      {isForced && (
        <View style={styles.forcedAlert}>
          <Text style={styles.forcedText}>SECURITY ACTION REQUIRED</Text>
        </View>
      )}

      <View style={styles.practicesCard}>
        <View style={styles.practicesHeader}>
          <Shield size={18} color={theme.colors.success} />
          <Text style={styles.practicesTitle}>Requirements</Text>
        </View>
        
        <View style={styles.practiceItem}>
          <View style={{ marginTop: 4 }}>
             <Check size={14} color={theme.colors.success} />
          </View>
          <Text style={styles.practiceText}>
            Minimum 7 characters including symbols.
          </Text>
        </View>

        <View style={[styles.practiceItem, { marginBottom: 0 }]}>
          <View style={{ marginTop: 4 }}>
             <Check size={14} color={theme.colors.success} />
          </View>
          <Text style={styles.practiceText}>
            This password will replace your temporary login key.
          </Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>SECURITY GATEWAY</Text>
        <Text style={styles.title}>{isForced ? "Finalize\nSetup" : "Change\nPassword"}</Text>

        <View style={styles.form}>
          <Input
            label={isForced ? "TEMPORARY PASSWORD" : "CURRENT PASSWORD"}
            value={currentPass}
            onChangeText={setCurrentPass}
            placeholder="Check your email"
            secureTextEntry={!showCurrent}
            rightElement={
              <Pressable onPress={() => setShowCurrent(!showCurrent)}>
                 {showCurrent ? <EyeOff size={18} color={theme.colors.onSurfaceVariant} /> : <Eye size={18} color={theme.colors.onSurfaceVariant} />}
              </Pressable>
            }
          />

          <Input
            label="NEW PERMANENT PASSWORD"
            value={newPass}
            onChangeText={setNewPass}
            placeholder="Enter strong password"
            secureTextEntry
            rightElement={<Lock size={18} color={theme.colors.onSurfaceDim} />}
          />

          <Input
            label="CONFIRM NEW PASSWORD"
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Repeat new password"
            secureTextEntry
            rightElement={<Check size={18} color={theme.colors.onSurfaceDim} />}
          />

          <Button
            title={isForced ? "Update and Continue" : "Change Password"}
            onPress={handleChangePassword}
            loading={loading}
            style={styles.changeBtn}
            disabled={!currentPass || !newPass || (newPass !== confirmPass)}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};
