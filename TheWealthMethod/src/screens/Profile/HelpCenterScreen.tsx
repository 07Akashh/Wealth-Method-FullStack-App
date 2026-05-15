import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import {
  MessageSquare,
  Phone,
  Calendar,
  MessageCircle,
  AlertTriangle,
  FileText,
  Globe,
  ChevronRight,
  ShieldCheck,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useUserStore } from "../../store/userStore";

const { width } = Dimensions.get("window");

export const HelpCenterScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { fetchProfile } = useUserStore();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const styles = useThemedStyles((t) => ({
    container: {
      paddingBottom: 40,
    } as ViewStyle,
    topLabel: {
      fontSize: 10,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.primary,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 12,
    } as TextStyle,
    title: {
      fontSize: 32,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      lineHeight: 38,
      marginBottom: 32,
    } as TextStyle,
    highlight: {
      color: t.colors.primary,
      fontStyle: "italic",
    } as TextStyle,
    advisorCard: {
      backgroundColor: t.colors.surfaceContainerLow,
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant + "30",
      ...t.effects.shadows.ambient,
    } as ViewStyle,
    advisorHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    } as ViewStyle,
    onlineBadge: {
      backgroundColor: t.colors.success + "15",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    } as ViewStyle,
    onlineText: {
      fontSize: 9,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.success,
      letterSpacing: 1,
    } as TextStyle,
    advisorProfile: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 24,
    } as ViewStyle,
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 12,
      backgroundColor: t.colors.surfaceContainerHighest,
    } as ImageStyle,
    advisorInfo: {
      flex: 1,
      gap: 4,
    } as ViewStyle,
    advisorName: {
      fontSize: 18,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurface,
    } as TextStyle,
    advisorRole: {
      fontSize: 13,
      fontFamily: t.typography.fontFamily.bodyRegular,
      color: t.colors.onSurfaceVariant,
    } as TextStyle,
    advisorBtnRow: {
      flexDirection: "row",
      gap: 12,
    } as ViewStyle,
    advisorBtnPrimary: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: t.colors.primary,
      borderRadius: 12,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    } as ViewStyle,
    advisorBtnSecondary: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: t.colors.surface,
      borderRadius: 12,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant,
    } as ViewStyle,
    advisorBtnTextPrimary: {
      fontSize: 13,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.surface,
    } as TextStyle,
    advisorBtnTextSecondary: {
       fontSize: 13,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurface,
    } as TextStyle,
    chatCard: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 24,
       padding: 24,
       marginBottom: 24,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
    } as ViewStyle,
    waitTimer: {
       alignSelf: "flex-end",
       alignItems: "flex-end",
       marginBottom: 16,
    } as ViewStyle,
    waitLabel: {
       fontSize: 9,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurfaceDim,
       letterSpacing: 0.5,
    } as TextStyle,
    waitTime: {
       fontSize: 16,
       fontFamily: t.typography.fontFamily.displayBold,
       color: t.colors.primary,
    } as TextStyle,
    whatsAppCard: {
       backgroundColor: t.colors.success + "08",
       borderRadius: 24,
       padding: 24,
       marginBottom: 24,
       borderWidth: 1,
       borderColor: t.colors.success + "20",
       alignItems: "center",
       gap: 12,
    } as ViewStyle,
    rowCards: {
       flexDirection: "row",
       gap: 16,
       marginBottom: 32,
    } as ViewStyle,
    smallCard: {
       flex: 1,
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 24,
       padding: 20,
       gap: 12,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
    } as ViewStyle,
    hubCard: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 24,
       padding: 24,
       gap: 20,
    } as ViewStyle,
    hubCity: {
       flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "center",
    } as ViewStyle,
    cityLabel: {
       fontSize: 10,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurfaceDim,
       textTransform: "uppercase",
       letterSpacing: 1,
    } as TextStyle,
    cityTime: {
       fontSize: 15,
       fontFamily: t.typography.fontFamily.displayBold,
       color: t.colors.onSurface,
    } as TextStyle,
    cityHours: {
       fontSize: 11,
       fontFamily: t.typography.fontFamily.bodyRegular,
       color: t.colors.onSurfaceVariant,
       marginTop: 2,
    } as TextStyle,
  }));

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container} refreshing={refreshing} onRefresh={handleRefresh}>
      <View>
        <Text style={styles.topLabel}>CONCIERGE SERVICES</Text>
        <Text style={styles.title}>
          How can we assist your{" "}
          <Text style={styles.highlight}>wealth journey</Text> today?
        </Text>
      </View>

      {/* Dedicated Advisor */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.advisorCard}>
        <View style={styles.advisorHeader}>
          <View>
            <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Your Dedicated Advisor</Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Direct access to bespoke financial guidance.</Text>
          </View>
          <View style={styles.onlineBadge}>
            <Text style={styles.onlineText}>ONLINE</Text>
          </View>
        </View>

        <View style={styles.advisorProfile}>
          <Image 
            source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male&id=8" }} 
            style={styles.avatar} 
          />
          <View style={styles.advisorInfo}>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.advisorName}>Alexandra Laurent</Text>
                <ShieldCheck size={16} color={theme.colors.success} />
             </View>
             <Text style={styles.advisorRole}>Senior Wealth Partner</Text>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.success }} />
                <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.success, textTransform: "uppercase" }}>Instant Response Active</Text>
             </View>
          </View>
        </View>

        <View style={styles.advisorBtnRow}>
          <Pressable style={styles.advisorBtnPrimary}>
            <Phone size={18} color={theme.colors.surface} />
            <Text style={styles.advisorBtnTextPrimary}>Secure Call</Text>
          </Pressable>
          <Pressable style={styles.advisorBtnSecondary}>
            <Calendar size={18} color={theme.colors.onSurface} />
            <Text style={styles.advisorBtnTextSecondary}>Book Meet</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Priority Live Chat */}
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.chatCard}>
         <View style={styles.waitTimer}>
            <Text style={styles.waitLabel}>CURRENT WAIT</Text>
            <Text style={styles.waitTime}>~ 2 Mins</Text>
         </View>
         
         <View style={{ gap: 12, marginBottom: 24 }}>
            <MessageSquare size={24} color={theme.colors.primary} />
            <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Priority Live Chat</Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, lineHeight: 18 }}>Our digital concierge team is standing by to resolve transaction queries in real-time.</Text>
         </View>

         <Pressable style={{ backgroundColor: theme.colors.surfaceContainerHighest, borderRadius: 12, height: 52, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface, textTransform: "uppercase", letterSpacing: 1 }}>Initialize Chat</Text>
         </Pressable>
      </Animated.View>

      {/* WhatsApp Concierge */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.whatsAppCard}>
         <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.success, alignItems: "center", justifyContent: "center" }}>
            <MessageCircle size={24} color={theme.colors.surface} />
         </View>
         <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.success }}>WhatsApp Concierge</Text>
         <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, textAlign: "center" }}>Official verified channel for quick updates and support.</Text>
         <Pressable style={{ borderBottomWidth: 1.5, borderColor: theme.colors.success }}>
            <Text style={{ fontSize: 14, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.success, paddingBottom: 2 }}>Launch WhatsApp</Text>
         </Pressable>
      </Animated.View>

      {/* Support Actions */}
      <View style={styles.rowCards}>
         <Pressable style={[styles.smallCard, { backgroundColor: theme.colors.tertiaryContainer + "10", borderColor: theme.colors.tertiary + "20" }]}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.surface, alignItems: "center", justifyContent: "center" }}>
               <AlertTriangle size={18} color={theme.colors.tertiary} />
            </View>
            <View>
               <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Report Issue</Text>
               <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Suspicious activity or technical error</Text>
            </View>
         </Pressable>
         <Pressable style={[styles.smallCard, { backgroundColor: theme.colors.primaryContainer + "10" }]}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.surface, alignItems: "center", justifyContent: "center" }}>
               <FileText size={18} color={theme.colors.primary} />
            </View>
            <View>
               <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>File a Claim</Text>
               <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Insurance or transaction dispute</Text>
            </View>
         </Pressable>
      </View>

      {/* Global Support Hubs */}
      <View style={styles.hubCard}>
         <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Globe size={20} color={theme.colors.primary} />
            <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Global Support Hubs</Text>
         </View>
         <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>We provide 24/7 coverage through our specialized wealth centers worldwide.</Text>
         
         <View style={{ gap: 24, marginTop: 8 }}>
            <View style={styles.hubCity}>
               <View>
                  <Text style={styles.cityLabel}>London</Text>
                  <Text style={styles.cityHours}>09:00 - 18:00 GMT</Text>
               </View>
               <Text style={styles.cityTime}>09:00</Text>
            </View>
            <View style={styles.hubCity}>
               <View>
                  <Text style={styles.cityLabel}>New York</Text>
                  <Text style={styles.cityHours}>09:00 - 18:00 EST</Text>
               </View>
               <Text style={styles.cityTime}>04:00</Text>
            </View>
            <View style={styles.hubCity}>
               <View>
                  <Text style={styles.cityLabel}>Singapore</Text>
                  <Text style={styles.cityHours}>09:00 - 18:00 SGT</Text>
               </View>
               <Text style={styles.cityTime}>17:00</Text>
            </View>
         </View>
      </View>

      <View style={{ height: 60 }} />
    </ScreenWrapper>
  );
};
