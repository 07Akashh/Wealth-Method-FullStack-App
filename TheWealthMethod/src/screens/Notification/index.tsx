import React, { useMemo, useState } from "react";
import { 
  Text, 
  View, 
  Pressable, 
  FlatList, 
  ViewStyle, 
  TextStyle, 
  Dimensions,
  StyleSheet,
  Platform
} from "react-native";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  MessageSquare,
  ChevronRight,
  Clock,
  Filter,
  Zap,
  TrendingUp,
  Shield,
  Search,
  MoreVertical,
  CheckCheck,
  Briefcase,
  User,
  Activity,
  Globe,
  Target
} from "lucide-react-native";
import Animated, { 
  FadeInDown, 
  FadeInRight,
  Layout,
  FadeIn,
  FadeInLeft
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useNotificationStore, NotificationItem, NotificationType } from "../../store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "../../components/common/EmptyState";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// WEALTH_NOTIFS was static data, now replaced by persistent notificationStore

export const NotificationsScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  
  const filters = [
    { label: "All", icon: Globe },
    { label: "Portfolio", icon: Briefcase },
    { label: "Goals", icon: Target },
    { label: "Security", icon: Shield },
    { label: "Transaction", icon: Activity }
  ];

  const filteredNotifs = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter(n => n.category.toLowerCase().includes(activeFilter.toLowerCase()) || n.title.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [activeFilter, notifications]);

  const styles = useThemedStyles((t) => ({
    container: {
      flex: 1,
    } as ViewStyle,
    header: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 10
    } as ViewStyle,
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    } as ViewStyle,
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    } as ViewStyle,
    pulseBadge: {
       paddingHorizontal: 10,
       paddingVertical: 4,
       borderRadius: 12,
       backgroundColor: t.colors.primary,
    } as ViewStyle,
    pulseBadgeText: {
       fontSize: 9,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onPrimary,
       letterSpacing: 1,
    } as TextStyle,
    dateText: {
        fontSize: 10,
        fontFamily: t.typography.fontFamily.headlineBold,
        color: t.colors.onSurfaceDim,
        textTransform: "uppercase",
        letterSpacing: 1,
    } as TextStyle,
    title: {
      fontSize: 34,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      letterSpacing: -1,
      lineHeight: 38,
    } as TextStyle,
    headerActions: {
       flexDirection: "row",
       alignItems: "center",
       gap: 16,
    } as ViewStyle,
    subtitle: {
       fontSize: 14,
       fontFamily: t.typography.fontFamily.bodyRegular,
       color: t.colors.onSurfaceVariant,
       opacity: 0.8,
    } as TextStyle,
    filterScroll: {
      paddingHorizontal: 24,
      alignItems: "center",
      gap: 10,
    } as ViewStyle,
    filterBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 100, // Pill shape
      backgroundColor: isDark ? t.colors.surfaceContainerLow + "80" : t.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant + "20",
      gap: 6,
    } as ViewStyle,
    filterBtnActive: {
      backgroundColor: t.colors.onSurface,
      borderColor: t.colors.onSurface,
      ...t.effects.shadows.ambient,
    } as ViewStyle,
    filterText: {
      fontSize: 13,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceVariant,
    } as TextStyle,
    filterTextActive: {
      color: isDark ? t.colors.surface : t.colors.surfaceContainerLowest,
    } as TextStyle,
    listContainer: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 150,
    } as ViewStyle,
    notifCard: {
      backgroundColor: t.colors.card,
      borderRadius: 24,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      gap: 16,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant + "15",
      ...t.effects.shadows.ambient,
    } as ViewStyle,
    unreadCard: {
      backgroundColor: isDark ? t.colors.surfaceContainerLow + "40" : t.colors.surfaceContainerLowest,
      borderColor: t.colors.primary + "20",
    } as ViewStyle,
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    contentSide: {
      flex: 1,
      justifyContent: "center",
    } as ViewStyle,
    categoryLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    } as ViewStyle,
    categoryName: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceDim,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    } as TextStyle,
    cardTitle: {
      fontSize: 16,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurface,
      marginBottom: 4,
    } as TextStyle,
    message: {
      fontSize: 13,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
      lineHeight: 18,
    } as TextStyle,
    footerLine: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 12,
    } as ViewStyle,
    timeText: {
      fontSize: 11,
      fontFamily: t.typography.fontFamily.headlineSemi,
      color: t.colors.onSurfaceDim,
    } as TextStyle,
    metaBadge: {
      backgroundColor: t.colors.surfaceContainerHigh,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    } as ViewStyle,
    metaText: {
      fontSize: 9,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.primary,
    } as TextStyle,
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: t.colors.primary,
    } as ViewStyle,
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 100,
    } as ViewStyle,
  }));

  const getNotifDetails = (type: NotificationType) => {
    const size = 22;
    switch (type) {
      case "success":
        return { 
          icon: <TrendingUp size={size} color={theme.colors.success} />, 
          bg: theme.colors.success + "15",
          accent: theme.colors.success
        };
      case "priority":
        return { 
          icon: <Zap size={size} color={theme.colors.tertiary} fill={theme.colors.tertiary} />, 
          bg: theme.colors.tertiaryContainer + "20",
          accent: theme.colors.tertiary
        };
      case "alert":
        return { 
          icon: <AlertCircle size={size} color={theme.colors.error} />, 
          bg: theme.colors.error + "15", // Using error directly since we standardized to hex
          accent: theme.colors.error
        };
      case "message":
        return { 
          icon: <MessageSquare size={size} color={theme.colors.info} />, 
          bg: theme.colors.info + "15",
          accent: theme.colors.info
        };
      default:
        return { 
          icon: <Info size={size} color={theme.colors.primary} />, 
          bg: theme.colors.primaryContainer + "15",
          accent: theme.colors.primary
        };
    }
  };

  const renderItem = ({ item, index }: { item: NotificationItem; index: number }) => {
    const details = getNotifDetails(item.type);
    
    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(500)}
        layout={Layout.springify()}
      >
        <Pressable 
          onPress={() => markAsRead(item.id)}
          style={[styles.notifCard, !item.read && styles.unreadCard]}
          android_ripple={{ color: theme.colors.outlineVariant + "20" }}
        >
          <View style={[styles.iconContainer, { backgroundColor: details.bg }]}>
            {details.icon}
          </View>
          
          <View style={styles.contentSide}>
            <View style={styles.categoryLine}>
              <Text style={styles.categoryName}>{item.category}</Text>
              {!item.read && <View style={styles.unreadIndicator} />}
            </View>
            
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            
            <View style={styles.footerLine}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Clock size={12} color={theme.colors.onSurfaceDim} />
                <Text style={styles.timeText}>{formatDistanceToNow(new Date(item.time))} ago</Text>
              </View>
              {item.meta && (
                <View style={[styles.metaBadge, item.type === 'success' && { backgroundColor: theme.colors.success + "10" }]}>
                  <Text style={[styles.metaText, item.type === 'success' && { color: theme.colors.success }]}>{item.meta}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={{ justifyContent: "center" }}>
            <ChevronRight size={18} color={theme.colors.outlineVariant} opacity={0.5} />
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper scrollable={false} contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 0, paddingTop: 10 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
                <View style={styles.badgeRow}>
                    <View style={styles.pulseBadge}>
                        <Text style={styles.pulseBadgeText}>{unreadCount()} NEW UPDATES</Text>
                    </View>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</Text>
                </View>
                <Text style={styles.title}>Wealth Pulse</Text>
            </View>
            <View style={styles.headerActions}>
                <Pressable onPress={markAllAsRead} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary + "10", alignItems: "center", justifyContent: "center" }}>
                    <CheckCheck size={20} color={theme.colors.primary} strokeWidth={2.5} />
                </Pressable>
            </View>
          </View>
        </View>

        <View style={{ height: 50 }}>
            <FlatList
                horizontal
                data={filters}
                renderItem={({ item, index }) => (
                <Animated.View entering={FadeInLeft.delay(index * 50).duration(400)}>
                    <Pressable 
                        onPress={() => setActiveFilter(item.label)}
                        style={[styles.filterBtn, activeFilter === item.label && styles.filterBtnActive]}
                    >
                        <item.icon size={14} color={activeFilter === item.label ? (isDark ? theme.colors.surface : theme.colors.surfaceContainerLowest) : theme.colors.onSurfaceVariant} />
                        <Text style={[styles.filterText, activeFilter === item.label && styles.filterTextActive]}>{item.label}</Text>
                    </Pressable>
                </Animated.View>
                )}
                keyExtractor={item => item.label}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
            />
        </View>

        <FlatList 
          data={filteredNotifs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <EmptyState 
                title="No Updates Yet" 
                message="High-priority alerts and portfolio snapshots will appear here in your Wealth Pulse." 
                Icon={Bell} 
                style={{ paddingTop: 100 }}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};
