import React, { useMemo } from "react";
import { StyleSheet, Text, View, Pressable, StatusBar, ViewStyle, TextStyle } from "react-native";
import { MoveLeft, Bell, UserCircle } from "lucide-react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useNotificationStore } from "../../store/notificationStore";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

type CustomHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
};

export const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  title = "The Wealth Method", 
  subtitle,
  showBack,
  rightComponent
}) => {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useAppTheme();
  const { unreadCount } = useNotificationStore();
  const stackState = useNavigationState(state => state);
  
  // Only show back button if we are deep in a stack (nested screen)
  const canGoBack = showBack ?? (stackState && stackState.index > 0);

  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderColor: theme.colors.outlineVariant,
      paddingBottom: 0,
      paddingHorizontal: 16,
    } as ViewStyle,
    profileCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1.5,
      borderColor: theme.colors.primary + "40",
      padding: 2,
      position: "relative",
    } as ViewStyle,
    avatarInner: {
      flex: 1,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceContainerHigh,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    } as ViewStyle,
    onlineBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.secondary,
      borderWidth: 2,
      borderColor: theme.colors.background,
    } as ViewStyle,
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceContainerLow,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    } as ViewStyle,
    brandTitle: {
      fontSize: theme.typography.fontSize.titleLg,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.primary,
      letterSpacing: theme.typography.letterSpacing.heading,
      lineHeight: 26,
    } as TextStyle,
    portalSub: {
      fontSize: theme.typography.fontSize.labelSm,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: "uppercase",
      marginTop: -2,
    } as TextStyle,
    notificationDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      borderWidth: 1.5,
      borderColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
  }), [theme]);

  const handleProfilePress = () => {
    navigation.navigate("PortalProfile");
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.content}>
        <View style={styles.left}>
          {canGoBack ? (
            <Pressable
              onPress={() => navigation.goBack()}
              style={dynamicStyles.backBtn}
              hitSlop={12}
            >
              <View pointerEvents="none">
                <MoveLeft size={22} color={theme.colors.onSurface} />
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleProfilePress}
              style={styles.profileBox}
              hitSlop={8}
            >
              <Animated.View 
                style={dynamicStyles.profileCircle} 
                pointerEvents="none"
              >
                <View style={dynamicStyles.avatarInner}>
                  <UserCircle size={28} color={theme.colors.onSurfaceVariant} />
                </View>
                <View style={dynamicStyles.onlineBadge} />
              </Animated.View>
            </Pressable>
          )}
        </View>

        <View style={styles.center}>
          <Text style={dynamicStyles.brandTitle}>{title}</Text>
          <Text style={dynamicStyles.portalSub}>{subtitle || "WEALTH HUB"}</Text>
        </View>

        <View style={styles.right}>
          {rightComponent || (
            <Pressable 
              style={styles.iconBtn} 
              hitSlop={10}
              onPress={() => navigation.navigate("PortalNotifications")}
            >
              <View pointerEvents="none" style={styles.bellIconContainer}>
                <Bell size={24} color={theme.colors.onSurface} strokeWidth={1.5} />
                {unreadCount() > 0 && (
                  <View style={dynamicStyles.notificationDot}>
                    <Text style={{ fontSize: 8, color: 'white', fontFamily: theme.typography.fontFamily.headlineBold, textAlign: 'center' }}>
                      {unreadCount() > 9 ? '9+' : unreadCount()}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
  },
  left: {
    width: 48,
    alignItems: "flex-start",
  },
  profileBox: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 4,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellIconContainer: {
    position: "relative",
    width: 24,
    height: 24,
  },
});
