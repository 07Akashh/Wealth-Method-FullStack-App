import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { 
  ArrowLeft, 
  Briefcase, 
  Info 
} from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useAuthActions } from "../../features/auth/useAuthActions";
import { validateEmail } from "../../utils/validators";

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [email, setEmail] = useState("");
  const { forgotPassword, loading } = useAuthActions();

  const handleSendReset = async () => {
    if (!validateEmail(email)) return;
    
    const success = await forgotPassword(email);
    if (success) {
      setTimeout(() => navigation.navigate("ResetPin", { identifier: email }), 1000);
    }
  };

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    glow: {
      position: "absolute" as const,
      top: -100,
      right: -100,
      width: width * 0.8,
      height: width * 0.8,
      borderRadius: (width * 0.8) / 2,
      backgroundColor: theme.colors.primary,
      opacity: isDark ? 0.08 : 0.12,
    } as ViewStyle,
    glowSecondary: {
      top: height * 0.4,
      left: -100,
      opacity: isDark ? 0.05 : 0.08,
      backgroundColor: theme.colors.info,
    } as ViewStyle,
    logoSquare: {
      width: 32,
      height: 32,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginRight: 12,
    } as ViewStyle,
    logoCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.colors.surface,
    } as ViewStyle,
    brandTitle: {
      fontSize: 22,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
      letterSpacing: -0.5,
    } as TextStyle,
    badge: {
      alignSelf: "flex-start" as const,
      backgroundColor: theme.colors.primary + "1A",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      marginBottom: 20,
    } as ViewStyle,
    badgeText: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.primary,
      letterSpacing: 1.2,
    } as TextStyle,
    heroText: {
      fontSize: 42,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      lineHeight: 48,
    } as TextStyle,
    heroDesc: {
      fontSize: 15,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 22,
      marginTop: 16,
      opacity: 0.8,
    } as TextStyle,
    hubCard: {
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: 32,
      padding: 24,
      borderWidth: 1.5,
      borderColor: theme.colors.outlineVariant + "20",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: isDark ? 0.4 : 0.06,
      shadowRadius: 24,
      elevation: 12,
    } as ViewStyle,
    hubTitle: {
      fontSize: 20,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
    } as TextStyle,
    hubSubtitle: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      marginTop: 2,
    } as TextStyle,
    infoBox: {
      flexDirection: "row" as const,
      backgroundColor: theme.colors.surfaceContainerLow,
      padding: 16,
      borderRadius: 20,
      marginTop: 8,
      gap: 12,
    } as ViewStyle,
    infoText: {
      flex: 1,
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 18,
    } as TextStyle,
    backToLogin: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: 24,
    } as ViewStyle,
    backToLoginText: {
      fontSize: 14,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.onSurfaceVariant,
      marginLeft: 8,
    } as TextStyle,
  }), [theme, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={dynamicStyles.glow} />
      <View style={[dynamicStyles.glow, dynamicStyles.glowSecondary]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.branding}>
            <View style={dynamicStyles.logoSquare}>
              <View style={dynamicStyles.logoCircle} />
            </View>
            <Text style={dynamicStyles.brandTitle}>The Wealth Method</Text>
          </View>

          <View style={styles.heroBlock}>
            <View style={dynamicStyles.badge}>
              <Text style={dynamicStyles.badgeText}>SECURITY GATEWAY</Text>
            </View>

            <Text style={dynamicStyles.heroText}>Recover your</Text>
            <Text style={dynamicStyles.heroText}>
               <Text style={{ color: theme.colors.primary }}>Account</Text>
               <Text> Access</Text>
            </Text>

            <Text style={dynamicStyles.heroDesc}>
              Enter your registered email address to receive a 
              secure account recovery link.
            </Text>
          </View>

          <View style={dynamicStyles.hubCard}>
            <View style={styles.hubHeader}>
              <View>
                <Text style={dynamicStyles.hubTitle}>Access Recovery</Text>
                <Text style={dynamicStyles.hubSubtitle}>Validation of account identity</Text>
              </View>
              <Text style={styles.stepTag}>RECOVERY</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="EMAIL ADDRESS"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                leftIcon={Briefcase}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={dynamicStyles.infoBox}>
                 <Info size={18} color={theme.colors.primary} />
                 <Text style={dynamicStyles.infoText}>
                   Recovery instructions will be dispatched immediately to your authenticated email portal.
                 </Text>
              </View>

              <Button
                title="Send Recovery Link"
                onPress={handleSendReset}
                loading={loading}
                style={styles.actionBtn}
                disabled={!validateEmail(email)}
              />

              <Pressable 
                onPress={() => navigation.navigate("Login")} 
                style={dynamicStyles.backToLogin}
              >
                <ArrowLeft size={18} color={theme.colors.onSurfaceVariant} />
                <Text style={dynamicStyles.backToLoginText}>Back to Secure Login</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.copyright, { color: theme.colors.onSurfaceDim }]}>
              © 2026 THE WEALTH METHOD SYSTEMS
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
    paddingBottom: 40,
    paddingTop: 12,
  },
  branding: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  heroBlock: {
    marginBottom: 40,
  },
  hubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  stepTag: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
    letterSpacing: 1,
    marginTop: 6,
  },
  form: {
    gap: 16,
    marginTop: 8,
  },
  actionBtn: {
    marginTop: 12,
  },
  footer: {
    marginTop: 60,
    alignItems: "center",
  },
  copyright: {
    fontSize: 10,
    opacity: 0.6,
    letterSpacing: 1,
  },
});
