import {
  Pencil,
  User,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  Landmark,
  CircleDashed,
  HelpCircle,
  Mail,
  Moon,
  Sun,
  Layout,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Text, View, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PortalStackParamList } from "../../navigation/types";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAuthActions } from "../../features/auth/useAuthActions";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useUserStore, CURRENCIES } from "../../store/userStore";
import { Image, Modal, ScrollView as NativeScrollView } from "react-native";
import * as Haptics from "expo-haptics";

export const ProfileScreen: React.FC<
  NativeStackScreenProps<PortalStackParamList, "PortalProfile">
> = ({ navigation }) => {
  const { logout } = useAuthActions();
  const { theme, themeMode, setThemeMode, isDark } = useAppTheme();
  const { name, email, avatar, currency, currencySymbol, updateProfile, fetchProfile } = useUserStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);

  const handleCurrencySelect = (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateProfile({ currency: code });
    setShowCurrencyModal(false);
  };

  const dynamicStyles = useMemo(
    () =>
      ({
        headerContainer: {
          alignItems: "center",
          marginTop: theme.spacing.lg,
          marginBottom: theme.spacing.xl,
        } as ViewStyle,
        avatarContainer: {
          position: "relative",
          marginBottom: theme.spacing.md,
        } as ViewStyle,
        avatarRing: {
          width: 140,
          height: 140,
          borderRadius: 70,
          borderWidth: 2,
          borderColor: theme.colors.primary + "33",
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
        } as ViewStyle,
        avatarImage: {
          width: 124,
          height: 124,
          borderRadius: 62,
          backgroundColor: theme.colors.surfaceContainerHigh,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        } as ViewStyle,
        editIconBox: {
          position: "absolute",
          bottom: 5,
          right: 5,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: theme.colors.surface,
        } as ViewStyle,
        userName: {
          fontSize: theme.typography.fontSize.headlineSm,
          fontFamily: theme.typography.fontFamily.displayBold,
          color: theme.colors.onSurface,
          letterSpacing: theme.typography.letterSpacing.display,
        } as TextStyle,
        userEmail: {
          fontSize: theme.typography.fontSize.bodyMd,
          fontFamily: theme.typography.fontFamily.bodyRegular,
          color: theme.colors.onSurfaceVariant,
          marginTop: 4,
        } as TextStyle,
        badgeRow: {
          flexDirection: "row",
          gap: 12,
          marginTop: theme.spacing.md,
        } as ViewStyle,
        badgeGreen: {
          backgroundColor: theme.colors.secondaryContainer + "1A", // Ghost fill (10%)
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: theme.radius.md,
        } as ViewStyle,
        badgeGray: {
          backgroundColor: theme.colors.surfaceContainerHigh,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: theme.radius.md,
        } as ViewStyle,
        badgeText: {
          fontSize: theme.typography.fontSize.labelSm,
          fontFamily: theme.typography.fontFamily.headlineBold,
          letterSpacing: theme.typography.letterSpacing.label,
        } as TextStyle,
        sectionLabel: {
          fontSize: theme.typography.fontSize.labelSm,
          fontFamily: theme.typography.fontFamily.headlineBold,
          color: theme.colors.onSurfaceDim,
          letterSpacing: theme.typography.letterSpacing.label,
          marginLeft: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          textTransform: "uppercase",
        } as TextStyle,
        card: {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.xl,
          marginHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          marginBottom: theme.spacing.xl,
          ...theme.effects.shadows.ambient,
        } as ViewStyle,
        item: {
          flexDirection: "row",
          alignItems: "center",
          padding: theme.spacing.md,
        } as ViewStyle,
        iconBox: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surfaceContainerLow,
          justifyContent: "center",
          alignItems: "center",
          marginRight: theme.spacing.md,
        } as ViewStyle,
        itemBody: {
          flex: 1,
        } as ViewStyle,
        itemTitle: {
          fontSize: theme.typography.fontSize.bodyMd,
          fontFamily: theme.typography.fontFamily.headlineBold,
          color: theme.colors.onSurface,
        } as TextStyle,
        itemSub: {
          fontSize: theme.typography.fontSize.labelSm,
          fontFamily: theme.typography.fontFamily.headlineSemi,
          color: theme.colors.onSurfaceDim,
          marginTop: 2,
          textTransform: "uppercase",
        } as TextStyle,
        logoutBtn: {
          flexDirection: "row",
          backgroundColor: theme.colors.tertiaryContainer + "1A", // Ghost fill (10%)
          marginHorizontal: theme.spacing.md,
          height: 56,
          borderRadius: theme.radius.lg,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          marginBottom: theme.spacing.xl,
        } as ViewStyle,
        logoutText: {
          fontSize: theme.typography.fontSize.bodyMd,
          fontFamily: theme.typography.fontFamily.headlineBold,
          color: theme.colors.tertiary,
          letterSpacing: theme.typography.letterSpacing.label,
          textTransform: "uppercase",
        } as TextStyle,
        footer: {
          alignItems: "center",
          paddingBottom: 40,
        } as ViewStyle,
        footerText: {
          fontSize: 9,
          fontFamily: theme.typography.fontFamily.headlineBold,
          color: theme.colors.onSurfaceDim,
          letterSpacing: theme.typography.letterSpacing.label,
          textTransform: "uppercase",
        } as TextStyle,
        appearanceToggle: {
          flexDirection: "row",
          backgroundColor: theme.colors.surfaceContainerLow,
          borderRadius: theme.radius.md,
          padding: 4,
          marginHorizontal: theme.spacing.md,
          marginTop: 8,
          marginBottom: theme.spacing.md,
        } as ViewStyle,
        toggleOption: {
          flex: 1,
          height: 38,
          borderRadius: theme.radius.sm,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        } as ViewStyle,
        toggleOptionActive: {
          backgroundColor: theme.colors.surfaceContainerLowest,
          ...theme.effects.shadows.ambient,
        } as ViewStyle,
        toggleText: {
          fontSize: theme.typography.fontSize.labelSm,
          fontFamily: theme.typography.fontFamily.headlineBold,
          color: theme.colors.onSurfaceVariant,
          textTransform: "uppercase",
        } as TextStyle,
        toggleTextActive: {
          color: theme.colors.onSurface,
        } as TextStyle,
        divider: {
          height: 1,
          backgroundColor: theme.colors.outlineVariant,
          marginLeft: 72,
        } as ViewStyle,
        modalContainer: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        } as ViewStyle,
        modalContent: {
          backgroundColor: theme.colors.surfaceContainer,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: 24,
          maxHeight: "70%",
        } as ViewStyle,
        currencyItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        } as ViewStyle,
      }) as const,
    [theme, isDark],
  );

  const MenuItem = ({
    icon: Icon,
    title,
    sub,
    action,
    isLast = false,
  }: any) => (
    <View>
      <Pressable onPress={action} style={dynamicStyles.item}>
        <View style={dynamicStyles.iconBox}>
          <Icon size={20} color={theme.colors.primary} />
        </View>
        <View style={dynamicStyles.itemBody}>
          <Text style={dynamicStyles.itemTitle}>{title}</Text>
          <Text style={dynamicStyles.itemSub}>{sub}</Text>
        </View>
        <ChevronRight size={18} color={theme.colors.onSurfaceDim} />
      </Pressable>
      {!isLast && <View style={dynamicStyles.divider} />}
    </View>
  );

  return (
    <ScreenWrapper
      scrollable={true}
      contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      {/* Profile Header */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={dynamicStyles.headerContainer}
      >
        <View style={dynamicStyles.avatarContainer}>
          <View style={dynamicStyles.avatarRing}>
            <View style={dynamicStyles.avatarImage}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: 124, height: 124 }} />
              ) : (
                <User size={80} color={theme.colors.onSurfaceDim} />
              )}
            </View>
          </View>
          <Pressable 
            onPress={() => navigation.navigate("PersonalInfo")}
            style={dynamicStyles.editIconBox}
          >
            <Pencil size={14} color={theme.colors.onPrimary} />
          </Pressable>
        </View>
        <Text style={dynamicStyles.userName}>{name}</Text>
        <Text style={dynamicStyles.userEmail}>{email}</Text>
        <View style={dynamicStyles.badgeRow}>
          <View style={dynamicStyles.badgeGreen}>
            <Text
              style={[
                dynamicStyles.badgeText,
                { color: theme.colors.secondary },
              ]}
            >
              PREMIUM MEMBER
            </Text>
          </View>
          <View style={dynamicStyles.badgeGray}>
            <Text
              style={[
                dynamicStyles.badgeText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              KYC VERIFIED
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Account Settings */}
      <Text style={dynamicStyles.sectionLabel}>Account Settings</Text>
      <View style={dynamicStyles.card}>
        <MenuItem
          icon={User}
          title="Personal Info"
          sub="NAME, DOB, ADDRESS"
          action={() => navigation.navigate("PersonalInfo")}
        />
        <MenuItem
          icon={Landmark}
          title="Indigo Vault"
          sub="3 LINKED ACCOUNTS"
          action={() => navigation.navigate("IndigoVault")}
        />
        <MenuItem
          icon={Shield}
          title="Security"
          sub="2FA, PASSWORD, BIOMETRICS"
          action={() => navigation.navigate("SecurityHub")}
          isLast
        />
      </View>

      {/* App Settings */}
      <Text style={dynamicStyles.sectionLabel}>App Settings</Text>
      <View style={dynamicStyles.card}>
        <MenuItem
          icon={Bell}
          title="Notifications"
          sub="ALERTS, NEWS, TRANSACTIONS"
          action={() => navigation.navigate("NotificationSettings")}
        />
        <MenuItem
          icon={CircleDashed}
          title="Currency"
          sub={`${currency} (${currencySymbol})`}
          action={() => setShowCurrencyModal(true)}
        />
        <View style={[dynamicStyles.item, { paddingBottom: 0 }]}>
          <View style={dynamicStyles.iconBox}>
            <CircleDashed size={20} color={theme.colors.primary} />
          </View>
          <View style={dynamicStyles.itemBody}>
            <Text style={dynamicStyles.itemTitle}>Appearance</Text>
            <Text style={dynamicStyles.itemSub}>
              {themeMode === "system"
                ? "SYSTEM DEFAULT"
                : themeMode.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.appearanceToggle}>
          {(["light", "dark", "system"] as const).map((mode) => {
            const Icon =
              mode === "light" ? Sun : mode === "dark" ? Moon : Layout;
            return (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={[
                  dynamicStyles.toggleOption,
                  themeMode === mode && dynamicStyles.toggleOptionActive,
                ]}
              >
                <Icon
                  size={14}
                  color={
                    themeMode === mode
                      ? theme.colors.onSurface
                      : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    dynamicStyles.toggleText,
                    themeMode === mode && dynamicStyles.toggleTextActive,
                  ]}
                >
                  {mode}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Support */}
      <Text style={dynamicStyles.sectionLabel}>Support</Text>
      <View style={dynamicStyles.card}>
        <MenuItem
          icon={HelpCircle}
          title="Help Center"
          sub="FAQS & DOCUMENTATION"
          action={() => navigation.navigate("HelpCenter")}
        />
        <MenuItem
          icon={Mail}
          title="Contact Us"
          sub="SPEAK WITH AN ADVISOR"
          action={() => navigation.navigate("ContactUs")}
          isLast
        />
      </View>

      {/* Logout Button */}
      <Pressable onPress={() => logout()} style={dynamicStyles.logoutBtn}>
        <LogOut size={20} color={theme.colors.tertiary} />
        <Text style={dynamicStyles.logoutText}>Logout Securely</Text>
      </Pressable>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide" onRequestClose={() => setShowCurrencyModal(false)}>
        <View style={dynamicStyles.modalContainer}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowCurrencyModal(false)} />
          <View style={dynamicStyles.modalContent}>
             <Text style={{ fontSize: 20, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface, marginBottom: 20 }}>Select Currency</Text>
             <NativeScrollView showsVerticalScrollIndicator={false}>
                {CURRENCIES.map((curr) => (
                   <Pressable 
                      key={curr.code} 
                      onPress={() => handleCurrencySelect(curr.code)}
                      style={dynamicStyles.currencyItem}
                    >
                      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: currency === curr.code ? theme.colors.primary + "15" : theme.colors.surfaceContainerHigh, alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                         <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: currency === curr.code ? theme.colors.primary : theme.colors.onSurface }}>{curr.symbol}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                         <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>{curr.name}</Text>
                         <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineSemi, color: theme.colors.onSurfaceDim }}>{curr.code}</Text>
                      </View>
                      {currency === curr.code && (
                         <Shield size={20} color={theme.colors.primary} />
                      )}
                   </Pressable>
                ))}
             </NativeScrollView>
             <View style={{ height: 20 }} />
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={dynamicStyles.footer}>
        <Text style={dynamicStyles.footerText}>
          VERSION 4.12.0 • SECURED BY INDIGO VAULT
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};
