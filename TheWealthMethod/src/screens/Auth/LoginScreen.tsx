import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { 
  AtSign, 
  ShieldCheck, 
  User,
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
import { useAuthActions } from "../../features/auth/useAuthActions";
import { useAppTheme } from "../../theme/ThemeProvider";
import { validateEmail, validatePassword, validatePhone } from "../../utils/validators";

const { width, height } = Dimensions.get("window");

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [identity, setIdentity] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthActions();

  // Optimized Validation Guard for Universal Login
  const isFormValid = useMemo(() => {
    const isEmail = validateEmail(identity);
    const isPhone = validatePhone(identity);
    return (isEmail || isPhone) && validatePassword(password);
  }, [identity, password]);

  const handleLogin = async () => {
    if (!isFormValid || loading) return;
    
    // Determine if identity is email or phone for slightly better backend hinting
    const isPhone = validatePhone(identity);
    
    const result = await login({ 
      email: identity.trim().toLowerCase(), // The backend now checks both fields via this param
      pass: password 
    });

    // Navigation is handled automatically by RootNavigator based on isAuthenticated state
    // isTempPass routing will be handled by PortalNavigator on mount
  };

  const dynamicStyles = useMemo(() => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    heroGlow: {
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
      fontSize: 48,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      lineHeight: 52,
    } as TextStyle,
    heroDesc: {
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 24,
      marginTop: 20,
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
    forgotText: {
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.primary,
      letterSpacing: 0.5,
    } as TextStyle,
  }), [theme, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={dynamicStyles.heroGlow} />
      <View style={[dynamicStyles.heroGlow, dynamicStyles.glowSecondary]} />

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
              <Text style={dynamicStyles.badgeText}>FINANCIAL GATEWAY</Text>
            </View>
            <Text style={dynamicStyles.heroText}>Your</Text>
            <Text style={dynamicStyles.heroText}>
              <Text style={{ color: theme.colors.primary, fontStyle: "italic" }}>financial</Text>
              <Text> hub</Text>
            </Text>
            <Text style={dynamicStyles.heroText}>awaits.</Text>

            <Text style={dynamicStyles.heroDesc}>
              Elevate your financial journey with high-fidelity 
              wealth management tools.
            </Text>
          </View>

          <View style={dynamicStyles.hubCard}>
            <View style={styles.form}>
              <Input
                value={identity}
                onChangeText={setIdentity}
                placeholder="Email or Phone Number"
                leftIcon={identity.includes('@') ? AtSign : User}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                leftIcon={ShieldCheck}
                rightElement={
                  <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={dynamicStyles.forgotText}>FORGOT?</Text>
                  </Pressable>
                }
              />

              <Button
                title="Secure Login"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginBtn}
                disabled={!isFormValid}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.onSurface, fontSize: 14 }}>
              Don't have an account?{" "}
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }} onPress={() => navigation.navigate("Signup")}>Sign Up</Text>
            </Text>
            <Text style={[styles.copyright, { color: theme.colors.onSurfaceDim }]}>© 2026 THE WEALTH METHOD SYSTEMS</Text>
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
  form: {
    gap: 12,
  },
  loginBtn: {
    marginTop: 12,
  },
  footer: {
    marginTop: 48,
    alignItems: "center",
    gap: 32,
  },
  copyright: {
    fontSize: 10,
    opacity: 0.6,
  },
});
