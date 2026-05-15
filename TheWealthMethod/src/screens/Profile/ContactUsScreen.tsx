import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextStyle,
  ViewStyle,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  MessageSquare,
  Mail,
  Calendar,
  Send,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useUserStore } from "../../store/userStore";

const { width } = Dimensions.get("window");

const ContactCard = ({ 
  icon: Icon, 
  title, 
  desc, 
  actionLabel, 
  actionValue, 
  variant = 'default',
  isOnline = false 
}: any) => {
  const { theme } = useAppTheme();
  return (
    <View style={{ 
      backgroundColor: variant === 'dark' ? theme.colors.surfaceContainerLow : theme.colors.surfaceContainerLow, 
      borderRadius: 24, 
      padding: 24, 
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant + "30",
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <View style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 14, 
          backgroundColor: variant === 'chat' ? theme.colors.success + "15" : (variant === 'email' ? theme.colors.primary + "10" : theme.colors.tertiary + "10"),
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <Icon size={24} color={variant === 'chat' ? theme.colors.success : (variant === 'email' ? theme.colors.primary : theme.colors.tertiary)} />
        </View>
        {isOnline && (
          <View style={{ backgroundColor: theme.colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.surface }} />
            <Text style={{ fontSize: 9, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.surface, textTransform: "uppercase", letterSpacing: 0.5 }}>ONLINE</Text>
          </View>
        )}
      </View>
      
      <Text style={{ fontSize: 20, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>{title}</Text>
      <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4, opacity: 0.8 }}>{desc}</Text>
      
      <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 24 }}>
        <Text style={{ fontSize: 14, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.primary }}>{actionLabel || actionValue}</Text>
        {actionLabel && <ArrowRight size={14} color={theme.colors.primary} />}
        {!actionLabel && actionValue && actionValue.includes('@') && <ArrowRight size={14} color={theme.colors.primary} />}
      </Pressable>
    </View>
  );
};

export const ContactUsScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const [priority, setPriority] = useState('Standard');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('Investment Inquiry');
  
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
      fontSize: 34,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      lineHeight: 40,
    } as TextStyle,
    highlight: {
      color: t.colors.primary,
    } as TextStyle,
    subtitle: {
       fontSize: 14,
       fontFamily: t.typography.fontFamily.bodyRegular,
       color: t.colors.onSurfaceVariant,
       lineHeight: 22,
       marginTop: 16,
       marginBottom: 32,
    } as TextStyle,
    formCard: {
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 32,
       padding: 24,
       marginTop: 16,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "20",
    } as ViewStyle,
    formTitle: {
       fontSize: 20,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurface,
       marginBottom: 24,
    } as TextStyle,
    inputLabel: {
       fontSize: 10,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurfaceDim,
       letterSpacing: 0.5,
       textTransform: "uppercase",
       marginBottom: 8,
    } as TextStyle,
    pickerTrigger: {
       backgroundColor: t.colors.surfaceContainerLowest,
       borderRadius: 16,
       padding: 16,
       flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "center",
       marginBottom: 24,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
    } as ViewStyle,
    toggleRow: {
       flexDirection: "row",
       backgroundColor: t.colors.surfaceContainerLowest,
       borderRadius: 16,
       padding: 4,
       marginBottom: 24,
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
    } as ViewStyle,
    toggleBtn: {
       flex: 1,
       height: 44,
       borderRadius: 12,
       justifyContent: "center",
       alignItems: "center",
    } as ViewStyle,
    toggleBtnActive: {
       backgroundColor: t.colors.primary,
    } as ViewStyle,
    toggleText: {
       fontSize: 13,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.onSurfaceVariant,
    } as TextStyle,
    toggleTextActive: {
       color: t.colors.surface,
    } as TextStyle,
    textArea: {
       backgroundColor: t.colors.surfaceContainerLowest,
       borderRadius: 16,
       padding: 16,
       height: 120,
       fontSize: 14,
       fontFamily: t.typography.fontFamily.bodyRegular,
       color: t.colors.onSurface,
       textAlignVertical: "top",
       borderWidth: 1,
       borderColor: t.colors.outlineVariant + "30",
       marginBottom: 32,
    } as TextStyle,
    sendBtn: {
       backgroundColor: t.colors.primary,
       height: 56,
       borderRadius: 20,
       flexDirection: "row",
       justifyContent: "center",
       alignItems: "center",
       gap: 10,
    } as ViewStyle,
    sendBtnText: {
       fontSize: 15,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.surface,
    } as TextStyle,
    hqCard: {
       borderRadius: 32,
       marginTop: 40,
       overflow: "hidden",
       height: 240,
    } as ViewStyle,
    hqOverlay: {
       flex: 1,
       backgroundColor: t.colors.primary + "90",
       padding: 32,
       justifyContent: "flex-end",
    } as ViewStyle,
    hqBox: {
       backgroundColor: t.colors.surface + "E0",
       borderRadius: 20,
       padding: 24,
       gap: 8,
    } as ViewStyle,
  }));

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container} refreshing={refreshing} onRefresh={handleRefresh}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <Text style={styles.topLabel}>DIRECT CONCIERGE</Text>
        <Text style={styles.title}>
          How can we assist your{"\n"}
          <Text style={styles.highlight}>financial journey?</Text>
        </Text>
        <Text style={styles.subtitle}>
          Experience white-glove support tailored to your wealth management needs. Our team is ready to assist you across any channel.
        </Text>
      </Animated.View>

      {/* Support Options */}
      <View>
        <ContactCard 
          icon={MessageSquare}
          variant="chat"
          title="Live Chat"
          desc="Average response time: < 2 minutes"
          actionLabel="Start conversation"
          isOnline
        />
        <ContactCard 
          icon={Mail}
          variant="email"
          title="Email Support"
          desc="For complex inquiries requiring documentation."
          actionValue="concierge@privatebank.com"
        />
        <ContactCard 
          icon={Calendar}
          variant="default"
          title="Schedule a Call"
          desc="Book a 15-minute slot with a wealth advisor."
          actionLabel="View availability"
        />
      </View>

      {/* Message Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Send a Message</Text>
        
        <Text style={styles.inputLabel}>Subject</Text>
        <Pressable style={styles.pickerTrigger}>
          <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.bodyMedium, color: theme.colors.onSurface }}>{subject}</Text>
          <ChevronRight size={18} color={theme.colors.onSurfaceDim} />
        </Pressable>

        <Text style={styles.inputLabel}>Priority</Text>
        <View style={styles.toggleRow}>
           {['Standard', 'Urgent'].map((p) => (
              <Pressable 
                key={p} 
                onPress={() => setPriority(p)}
                style={[styles.toggleBtn, priority === p && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, priority === p && styles.toggleTextActive]}>{p}</Text>
              </Pressable>
           ))}
        </View>

        <Text style={styles.inputLabel}>Message</Text>
        <TextInput 
          style={styles.textArea}
          placeholder="How can we help you today?"
          placeholderTextColor={theme.colors.onSurfaceDim}
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <Pressable style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send Message</Text>
          <Send size={18} color={theme.colors.surface} />
        </Pressable>
      </View>

      {/* Global HQ */}
      <View style={styles.hqCard}>
         <ImageBackground 
           source={{ uri: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop" }} 
           style={{ flex: 1 }}
         >
            <View style={styles.hqOverlay}>
               <View style={styles.hqBox}>
                  <Text style={{ fontSize: 18, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Global Headquarters</Text>
                  <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant }}>Bahnhofstrasse 45, 8001 Zürich,{"\n"}Switzerland</Text>
                  <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 }}>
                     <Text style={{ fontSize: 12, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.primary, textTransform: "uppercase" }}>Get Directions</Text>
                     <ExternalLink size={12} color={theme.colors.primary} />
                  </Pressable>
               </View>
            </View>
         </ImageBackground>
      </View>
      
      <View style={{ height: 60 }} />
    </ScreenWrapper>
  );
};
