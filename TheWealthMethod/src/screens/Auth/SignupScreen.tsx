import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { 
  User as UserIcon, 
  AtSign, 
  Phone,
  ArrowLeft,
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
import { AuthStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../theme/ThemeProvider";
import { validateEmail, validateName, validatePhone } from "../../utils/validators";

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const { signup, loading } = useAuthActions();

  // Validation Guard
  const isFormValid = useMemo(() => {
    return (
      validateName(firstName) && 
      validateName(lastName) && 
      validateEmail(email) && 
      validatePhone(phone)
    );
  }, [firstName, lastName, email, phone]);

  const handleSignup = async () => {
    if (!isFormValid) return;
    
    const result = await signup({ 
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      email: email.trim().toLowerCase(), 
      phone: phone.replace(/[^0-9]/g, ""),
      preferredCurrency: "INR"
    });

    if (result) {
      navigation.navigate("Login");
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
    footerLink: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.headlineBold,
    } as TextStyle,
    backBtnText: {
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: 0.5,
    } as TextStyle,
    copyright: {
      fontSize: 10,
      opacity: 0.6,
      color: theme.colors.onSurfaceDim,
      letterSpacing: 1,
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
              <Text style={dynamicStyles.badgeText}>ENROLLMENT GATEWAY</Text>
            </View>
            <Text style={dynamicStyles.heroText}>Start your</Text>
            <Text style={dynamicStyles.heroText}>
              <Text style={{ color: theme.colors.primary }}>Wealth</Text>
              <Text> Odyssey</Text>
            </Text>
            <Text style={dynamicStyles.heroText}>today.</Text>

            <Text style={dynamicStyles.heroDesc}>
              Join the elite digital ecosystem designed for 
              private wealth optimization.
            </Text>
          </View>

          <View style={dynamicStyles.hubCard}>
            <View style={styles.hubHeader}>
              <View>
                <Text style={dynamicStyles.hubTitle}>Create Identity</Text>
                <Text style={dynamicStyles.hubSubtitle}>Your credentials will be sent via email</Text>
              </View>
              <Text style={styles.stepTag}>NEW USER</Text>
            </View>

            <View style={styles.form}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    leftIcon={UserIcon}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    leftIcon={UserIcon}
                  />
                </View>
              </View>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                leftIcon={AtSign}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="Mobile (+91)"
                leftIcon={Phone}
                keyboardType="phone-pad"
              />

              <View style={styles.infoBox}>
                <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                  After signing up, check your inbox for a temporary password to login.
                </Text>
              </View>

              <Button
                title="Request Enrollment"
                onPress={handleSignup}
                loading={loading}
                style={styles.signupBtn}
                disabled={!isFormValid}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.onSurface, fontSize: 14 }}>
              Already have an account?{" "}
              <Text style={dynamicStyles.footerLink} onPress={() => navigation.navigate("Login")}>Login</Text>
            </Text>

            <Pressable 
              onPress={() => navigation.goBack()} 
              style={styles.backBtn}
            >
              <ArrowLeft size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={dynamicStyles.backBtnText}>Navigate Back</Text>
            </Pressable>

            <Text style={dynamicStyles.copyright}>© 2026 THE WEALTH METHOD SYSTEMS</Text>
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
    gap: 12,
  },
  infoBox: {
    padding: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  signupBtn: {
    marginTop: 12,
  },
  footer: {
    marginTop: 48,
    alignItems: "center",
    gap: 32,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
