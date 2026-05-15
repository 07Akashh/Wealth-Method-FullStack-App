import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MoveLeft,
  ShieldCheck,
  RefreshCw,
} from "lucide-react-native";
import React, { useState, useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OtpInput } from "../../components/auth/OtpInput";
import { Button } from "../../components/ui/Button";
import { useAuthActions } from "../../features/auth/useAuthActions";
import { AuthStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../theme/ThemeProvider";

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

export const OTPScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // Extended for production
  const [canResend, setCanResend] = useState(false);

  const phone = route.params?.phone ?? "";
  const { verifyOtp, loading } = useAuthActions();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onVerify = async (code = otp) => {
    if (code.length < 4) return;
    
    const result = await verifyOtp(phone, code);
    if (result) {
      // Redirection usually handled by state listener, 
      // but we can force reset stack here if needed
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "PortalStack" }],
      });
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    // Add real resend call if available in authService
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    ambientGlow: {
      position: "absolute" as const,
      width: width * 0.8,
      height: width * 0.8,
      borderRadius: (width * 0.8) / 2,
      backgroundColor: theme.colors.primary,
      top: -100,
      right: -100,
      opacity: isDark ? 0.08 : 0.12,
    } as ViewStyle,
    glowSecondary: {
      top: height * 0.4,
      left: -100,
      backgroundColor: theme.colors.info,
      opacity: isDark ? 0.05 : 0.08,
    } as ViewStyle,
    backIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceContainer,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    } as ViewStyle,
    headerTag: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: 1.5,
    } as TextStyle,
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 24,
      position: "relative" as const,
    } as ViewStyle,
    heroTitle: {
      fontSize: 34,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      textAlign: "center" as const,
      marginBottom: 12,
      letterSpacing: -0.5,
    } as TextStyle,
    heroSubtitle: {
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center" as const,
      lineHeight: 24,
      opacity: 0.8,
    } as TextStyle,
    phoneHighlight: {
      fontFamily: theme.typography.fontFamily.bodySemibold,
      color: theme.colors.primary,
    } as TextStyle,
    timerBox: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
      backgroundColor: theme.colors.surfaceContainerLow,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    } as ViewStyle,
    infoCard: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      marginBottom: 60,
    } as ViewStyle,
  }), [theme, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={dynamicStyles.ambientGlow} />
      <View style={[dynamicStyles.ambientGlow, dynamicStyles.glowSecondary]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <View style={dynamicStyles.backIconCircle}>
                <MoveLeft size={18} color={theme.colors.onSurface} />
              </View>
            </Pressable>
            <Text style={dynamicStyles.headerTag}>SECURITY STEP 02</Text>
          </View>

          <View style={styles.heroSection}>
            <View style={dynamicStyles.iconContainer}>
              <View style={[styles.pulseInner, { borderColor: theme.colors.primary + "40" }]} />
              <ShieldCheck size={32} color={theme.colors.primary} />
            </View>

            <Text style={dynamicStyles.heroTitle}>Verify Identity</Text>
            <Text style={dynamicStyles.heroSubtitle}>
              We've dispatched a secure portal key to {"\n"}
              <Text style={dynamicStyles.phoneHighlight}>{phone}</Text>
            </Text>
          </View>

          <View style={styles.otpModule}>
            <OtpInput
              value={otp}
              onValueChange={setOtp}
              length={4}
              onComplete={(code) => onVerify(code)}
            />

            <View style={styles.timerRow}>
              {canResend ? (
                <Pressable style={styles.resendBtn} onPress={handleResend}>
                  <RefreshCw size={14} color={theme.colors.primary} />
                  <Text style={[styles.resendLink, { color: theme.colors.primary }]}>Request New Key</Text>
                </Pressable>
              ) : (
                <View style={dynamicStyles.timerBox}>
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>Resend available in</Text>
                  <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: 'bold' }}>{formatTimer(timer)}</Text>
                </View>
              )}
            </View>
          </View>

          <Button
            title="Authenticate Session"
            onPress={() => onVerify()}
            loading={loading}
            style={styles.verifyBtn}
            disabled={otp.length < 4}
          />

          <View style={dynamicStyles.infoCard}>
            <View style={styles.helpHeader}>
              <ShieldCheck size={18} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>Security Assistance</Text>
            </View>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, marginTop: 8 }}>
              If you haven't received the code, please check your network connection or 
              ensure the phone number is correct.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 9, opacity: 0.5, letterSpacing: 1.2 }}>
              ENCRYPTED SESSION • THE WEALTH METHOD IDENTITY SERVICE
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  backBtn: {
    padding: 4,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  pulseInner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    opacity: 0.5,
  },
  otpModule: {
    marginBottom: 32,
  },
  timerRow: {
    alignItems: "center",
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(13, 148, 136, 0.1)",
    borderRadius: 20,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  verifyBtn: {
    marginBottom: 40,
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
    marginTop: 'auto',
  },
});
