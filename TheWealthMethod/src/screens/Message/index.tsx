import {
  Search,
  Plus,
  Users,
  ShieldCheck,
  Pin,
  Pencil,
  ChevronRight,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PortalStackParamList } from "../../navigation/types";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";

const { width } = Dimensions.get("window");

const categories = ["ALL", "ADVISORS", "SUPPORT", "GROUPS"];

const chats = [
  {
    id: "1",
    name: "Private Banker",
    role: "ADVISOR",
    snippet: "Your quarterly portfolio review is ready for signature...",
    time: "09:41",
    pinned: true,
    unread: 0,
    online: true,
  },
  {
    id: "2",
    name: "Estate Planning Group",
    role: "GROUP",
    snippet: "Marcus: We've attached the latest trust draft...",
    time: "YESTERDAY",
    pinned: false,
    unread: 3,
    online: false,
  },
  {
    id: "3",
    name: "Vault Alerts",
    role: "BROADCAST",
    snippet: "Security update: New asset detected in your vault",
    time: "",
    pinned: false,
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Support Desk",
    role: "SUPPORT",
    snippet: "Inquiry about bank linking: Your request has been...",
    time: "2D AGO",
    pinned: false,
    unread: 0,
    online: true,
    alert: true,
  },
  {
    id: "5",
    name: "Investment Strategy",
    role: "STRATEGY",
    snippet: "Analyst: New emerging market opportunities...",
    time: "OCT 12",
    pinned: false,
    unread: 0,
    online: false,
  },
  {
    id: "6",
    name: "Tax Compliance",
    role: "GROUP",
    snippet: "Final documents for fiscal year 2024 are ready",
    time: "OCT 10",
    pinned: false,
    unread: 1,
    online: true,
  },
  {
    id: "7",
    name: "Vault Concierge",
    role: "SUPPORT",
    snippet: "Can we have a quick call about your onboarding...",
    time: "OCT 09",
    pinned: false,
    unread: 0,
    online: false,
  },
];

export const MessagesScreen: React.FC<NativeStackScreenProps<PortalStackParamList, "PortalMessages">> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");

  const styles = useThemedStyles((t) => ({
    header: {
      marginBottom: 32,
    } as ViewStyle,
    headerRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    } as ViewStyle,
    title: {
      fontSize: 40,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      lineHeight: 48,
    } as TextStyle,
    secureBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant,
      backgroundColor: t.colors.surfaceContainerLow + "80",
    } as ViewStyle,
    secureText: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceDim,
      letterSpacing: 1,
    } as TextStyle,
    subtitle: {
      fontSize: 15,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
      lineHeight: 24,
      marginTop: 12,
      opacity: 0.8,
    } as TextStyle,
    searchContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: t.colors.surfaceContainerLow,
      height: 60,
      borderRadius: 20,
      paddingHorizontal: 20,
      borderWidth: 1.5,
      borderColor: t.colors.outlineVariant,
    } as ViewStyle,
    searchInput: {
      flex: 1,
      marginLeft: 16,
      color: t.colors.onSurface,
      fontSize: 16,
      fontFamily: t.typography.fontFamily.bodyMedium,
    } as TextStyle,
    tabsScrollContent: {
      gap: 12,
    } as ViewStyle,
    tab: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: t.colors.surfaceContainerLow,
      borderWidth: 1.5,
      borderColor: t.colors.outlineVariant,
    } as ViewStyle,
    tabActive: {
      backgroundColor: t.colors.primary,
      borderColor: t.colors.primary,
    } as ViewStyle,
    tabText: {
      fontSize: 12,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceVariant,
      letterSpacing: 1.2,
    } as TextStyle,
    tabTextActive: {
      color: t.colors.surface,
    } as TextStyle,
    chatListContent: {
      gap: 16,
    } as ViewStyle,
    chatCard: {
      flexDirection: "row" as const,
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: 32,
      padding: 16,
      borderWidth: 1.5,
      borderColor: t.colors.outlineVariant,
      alignItems: "center" as const,
      gap: 16,
    } as ViewStyle,
    avatarInner: {
      width: 68,
      height: 68,
      borderRadius: 24,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,
      borderWidth: 2,
      backgroundColor: t.colors.surfaceContainerHigh,
      borderColor: t.colors.outlineVariant,
    } as ViewStyle,
    chatName: {
      fontSize: 18,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurface,
      maxWidth: width * 0.4,
    } as TextStyle,
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: t.colors.surfaceContainerHighest,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant,
    } as ViewStyle,
    roleText: {
      fontSize: 9,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceVariant,
      letterSpacing: 0.5,
    } as TextStyle,
    timeText: {
      fontSize: 11,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceDim,
      opacity: 0.8,
    } as TextStyle,
    snippetText: {
      flex: 1,
      fontSize: 14,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
      lineHeight: 20,
    } as TextStyle,
    onlineBadge: {
      position: "absolute" as const,
      bottom: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: t.colors.success,
      borderWidth: 3.5,
      borderColor: t.colors.surface,
    } as ViewStyle,
    unreadBadge: {
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 6,
      marginLeft: 8,
      backgroundColor: t.colors.primary,
    } as ViewStyle,
    unreadText: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.surface,
    } as TextStyle,
    fabContainer: {
      position: "absolute" as const,
      bottom: 40,
      right: 24,
    } as ViewStyle,
    fab: {
      width: 64,
      height: 64,
      borderRadius: 24,
      backgroundColor: t.colors.primary,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: t.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    } as ViewStyle,
  }));

  return (
    <ScreenWrapper
      scrollable={true}
      floatingContent={
        <Animated.View entering={FadeIn.delay(600)} style={styles.fabContainer}>
          <Pressable style={styles.fab} hitSlop={12}>
            <Pencil size={24} color={theme.colors.surface} strokeWidth={2.5} />
          </Pressable>
        </Animated.View>
      }
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Messages</Text>
          <View style={styles.secureBadge}>
            <Text style={styles.secureText}>SECURE HUB</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Engage with your financial advisors through our AI-prioritized
          communication lounge.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={22} color={theme.colors.onSurfaceDim} />
        <TextInput
          placeholder="Search chats, advisors or strategy..."
          placeholderTextColor={theme.colors.onSurfaceDim}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
          decelerationRate="fast"
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveTab(cat)}
              style={[styles.tab, activeTab === cat && styles.tabActive]}
              hitSlop={8}
            >
              <Text style={[styles.tabText, activeTab === cat && styles.tabTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </Animated.ScrollView>
      </View>

      <View style={styles.chatListContent}>
        {chats.map((chat, index) => (
          <Animated.View
            key={chat.id}
            entering={FadeInDown.delay(index * 50).duration(400)}
          >
            <Pressable style={styles.chatCard} hitSlop={4}>
              <View style={{ width: 68, height: 68, position: "relative" }}>
                <View style={styles.avatarInner}>
                  {chat.role === "GROUP" ? (
                    <Users size={28} color={theme.colors.primary} />
                  ) : chat.role === "BROADCAST" ? (
                    <Plus size={28} color={theme.colors.primary} />
                  ) : (
                    <ShieldCheck size={32} color={theme.colors.primary} opacity={0.4} />
                  )}
                </View>
                {chat.online && <View style={styles.onlineBadge} />}
                {chat.alert && <View style={[styles.onlineBadge, { backgroundColor: theme.colors.danger }]} />}
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 8 }}>
                  <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                  {chat.role && (
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>{chat.role}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }} />
                  <Text style={styles.timeText}>{chat.time}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <Text style={styles.snippetText} numberOfLines={1}>{chat.snippet}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {chat.pinned && <Pin size={14} color={theme.colors.onSurfaceDim} style={{ marginLeft: 8 }} />}
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                    {chat.role === "BROADCAST" && <ChevronRight size={18} color={theme.colors.primary} style={{ marginLeft: 4 }} />}
                  </View>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScreenWrapper>
  );
};
