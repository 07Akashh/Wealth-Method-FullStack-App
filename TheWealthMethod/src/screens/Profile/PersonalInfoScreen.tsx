import React, { useState, useLayoutEffect } from "react";
import {
  Text,
  View,
  Pressable,
  TextStyle,
  ViewStyle,
  Image,
  ImageStyle,
  Dimensions,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  ShieldCheck,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Download,
  LogOut,
  CheckCircle2,
  Plus,
  Camera,
  User,
  Edit2,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { useAppTheme, useThemedStyles } from "../../theme/ThemeProvider";
import { useAuthActions } from "../../features/auth/useAuthActions";
import { useUserStore } from "../../store/userStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PortalStackParamList } from "../../navigation/types";

const { width } = Dimensions.get("window");

const InfoSection = ({ label, value, verified = false, icon: Icon, isEditing, onChangeText, keyboardType, placeholder }: any) => {
  const { theme } = useAppTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: isEditing ? theme.colors.surfaceContainerLowest : theme.colors.surfaceContainerLow, borderRadius: 16, padding: isEditing ? 8 : 16, borderWidth: 1, borderColor: isEditing ? theme.colors.primary : theme.colors.outlineVariant + "20" }}>
        {isEditing ? (
          <TextInput
            style={{ flex: 1, height: 40, fontSize: 16, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface, paddingHorizontal: 8 }}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.onSurfaceDim}
          />
        ) : (
          <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.displayBold, color: theme.colors.onSurface }}>{value}</Text>
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {verified && !isEditing && <CheckCircle2 size={18} color={theme.colors.success} />}
          {Icon && <Icon size={18} color={theme.colors.onSurfaceDim} />}
        </View>
      </View>
    </View>
  );
};

export const PersonalInfoScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { logout } = useAuthActions();
  const navigation = useNavigation<NativeStackNavigationProp<PortalStackParamList>>();
  const { firstName, lastName, name, email, phone, avatar, updateProfile, fetchProfile } = useUserStore();
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const [form, setForm] = useState({
    firstName,
    lastName,
    email,
    phone,
    avatar,
  });

  React.useEffect(() => {
    setForm({
      firstName,
      lastName,
      email,
      phone,
      avatar,
    });
  }, [firstName, lastName, email, phone, avatar]);

  const pickImage = async () => {
    if (!isEditing) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.email) {
      Alert.alert("Input Required", "First name, last name, and email are required");
      return;
    }
    updateProfile(form);
    setIsEditing(false);
  };

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(" ") || name;

  const styles = useThemedStyles((t) => ({
    container: {
      paddingBottom: 40,
    } as ViewStyle,
    header: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 32,
    } as ViewStyle,
    avatarRing: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: t.colors.primary,
      padding: 4,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    } as ViewStyle,
    avatar: {
      width: 108,
      height: 108,
      borderRadius: 54,
      backgroundColor: t.colors.surfaceContainerHigh,
    } as ImageStyle,
    verifiedBadge: {
       position: "absolute",
       bottom: 5,
       right: 5,
       width: 28,
       height: 28,
       borderRadius: 14,
       backgroundColor: t.colors.primary,
       alignItems: "center",
       justifyContent: "center",
       borderWidth: 3,
       borderColor: t.colors.background,
    } as ViewStyle,
    name: {
      fontSize: 32,
      fontFamily: t.typography.fontFamily.displayBold,
      color: t.colors.onSurface,
      textAlign: "center",
      marginTop: 8,
    } as TextStyle,
    editHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
    } as ViewStyle,
    editBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: t.colors.primaryContainer + "20",
    } as ViewStyle,
    editBtnText: {
        fontSize: 13,
        fontFamily: t.typography.fontFamily.headlineBold,
        color: t.colors.primary,
    } as TextStyle,
    cameraBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: t.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: t.colors.background,
    } as ViewStyle,
    tierBadgeRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    } as ViewStyle,
    tierBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: t.colors.surfaceContainerHighest,
    } as ViewStyle,
    tierBadgeElite: {
      backgroundColor: t.colors.secondaryContainer + "1A",
    } as ViewStyle,
    tierText: {
      fontSize: 9,
      fontFamily: t.typography.fontFamily.headlineBold,
      color: t.colors.onSurfaceVariant,
      letterSpacing: 0.5,
    } as TextStyle,
    managedBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: t.colors.surfaceContainerLow,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      marginTop: 16,
      gap: 10,
      borderWidth: 1,
      borderColor: t.colors.outlineVariant + "20",
    } as ViewStyle,
    managedAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: t.colors.surfaceContainerHighest,
    } as ImageStyle,
    strengthContainer: {
       width: "100%",
       marginTop: 24,
       alignItems: "center",
    } as ViewStyle,
    strengthLabel: {
       fontSize: 12,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.primary,
       marginBottom: 8,
    } as TextStyle,
    strengthTrack: {
       width: 160,
       height: 4,
       backgroundColor: t.colors.outlineVariant + "40",
       borderRadius: 2,
       overflow: "hidden",
    } as ViewStyle,
    strengthFill: {
       height: "100%",
       backgroundColor: t.colors.primary,
    } as ViewStyle,
    designationRow: {
       flexDirection: "row",
       gap: 8,
       marginTop: 8,
    } as ViewStyle,
    designationTag: {
       backgroundColor: t.colors.primaryContainer + "15",
       paddingHorizontal: 16,
       paddingVertical: 8,
       borderRadius: 12,
       borderWidth: 1,
       borderColor: t.colors.primary + "10",
    } as ViewStyle,
    designationText: {
       fontSize: 11,
       fontFamily: t.typography.fontFamily.headlineBold,
       color: t.colors.primary,
    } as TextStyle,
    kycBtn: {
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "center",
       gap: 12,
       height: 56,
       backgroundColor: t.colors.surfaceContainerLow,
       borderRadius: 20,
       marginTop: 24,
       borderWidth: 1,
       borderColor: t.colors.primary + "20",
    } as ViewStyle,
    logoutBtn: {
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "center",
       gap: 12,
       height: 56,
       marginTop: 32,
    } as ViewStyle,
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable 
          onPress={() => isEditing ? handleSave() : setIsEditing(true)} 
          style={[styles.editBtn, isEditing && { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.editBtnText, isEditing && { color: theme.colors.onPrimary }]}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </Pressable>
      )
    });
  }, [isEditing, form, theme, styles]);

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container} refreshing={refreshing} onRefresh={handleRefresh}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Header Profile */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View style={styles.avatarRing}>
            <Pressable onPress={pickImage} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                {form.avatar ? (
                  <Image source={{ uri: form.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
                    <User size={60} color={theme.colors.onSurfaceVariant} fill={theme.colors.surfaceContainerHigh} />
                  </View>
                )}
                {isEditing && (
                  <View style={styles.cameraBtn}>
                    <Camera size={18} color="white" />
                  </View>
                )}
            </Pressable>
            {!isEditing && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={14} color="white" />
              </View>
            )}
          </View>
          <Text style={styles.name}>{isEditing ? "Profile Customization" : displayName}</Text>
          <View style={styles.tierBadgeRow}>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>PRIVATE WEALTH</Text>
            </View>
            <View style={[styles.tierBadge, styles.tierBadgeElite]}>
              <Text style={[styles.tierText, { color: theme.colors.secondary }]}>ELITE TIER</Text>
            </View>
          </View>

          {!isEditing && (
            <Pressable style={styles.managedBox}>
              <Image 
                source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=female&id=22" }} 
                style={styles.managedAvatar} 
              />
              <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceVariant }}>Managed by <Text style={{ color: theme.colors.primary }}>Sarah Jenkins, CFA</Text></Text>
              <ChevronRight size={14} color={theme.colors.onSurfaceDim} />
            </Pressable>
          )}

          <View style={styles.strengthContainer}>
            <Text style={styles.strengthLabel}>Profile Strength: {isEditing ? "95%" : "75%"}</Text>
            <View style={styles.strengthTrack}>
              <View style={[styles.strengthFill, { width: isEditing ? "95%" : "75%" }]} />
            </View>
          </View>
        </Animated.View>

        {/* Info Sections */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <InfoSection 
              label="First Name" 
              value={form.firstName} 
              verified 
              isEditing={isEditing}
              onChangeText={(t: string) => setForm({ ...form, firstName: t })}
              placeholder="Enter first name"
            />
          </View>
          <View style={{ flex: 1 }}>
            <InfoSection 
              label="Last Name" 
              value={form.lastName} 
              verified 
              isEditing={isEditing}
              onChangeText={(t: string) => setForm({ ...form, lastName: t })}
              placeholder="Enter last name"
            />
          </View>
        </View>
        
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 10, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurfaceDim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Designations</Text>
          <View style={styles.designationRow}>
            <View style={styles.designationTag}>
              <Text style={styles.designationText}>MBA</Text>
            </View>
            <View style={styles.designationTag}>
              <Text style={styles.designationText}>PHD</Text>
            </View>
            <Pressable 
              style={[styles.designationTag, { backgroundColor: theme.colors.surfaceContainerHighest, borderColor: "transparent", flexDirection: "row", alignItems: "center", gap: 6 }]}
            >
              <Plus size={14} color={theme.colors.onSurfaceDim} />
              <Text style={[styles.designationText, { color: theme.colors.onSurfaceVariant }]}>ADD</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <InfoSection 
            label="Primary Email Address" 
            value={form.email} 
            verified
            isEditing={isEditing}
            onChangeText={(t: string) => setForm({ ...form, email: t })}
            keyboardType="email-address"
            icon={Mail}
          />
          {!isEditing && <Text style={{ fontSize: 11, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.success, marginTop: -16 }}>Verified for encrypted communications</Text>}
        </View>

        <InfoSection 
          label="Mobile Number" 
          value={form.phone} 
          isEditing={isEditing}
          onChangeText={(t: string) => setForm({ ...form, phone: t })}
          keyboardType="phone-pad"
          icon={Phone}
        />
        
        <InfoSection label="Date Of Birth" value="November 24, 1978" icon={Calendar} isEditing={isEditing} />

        {/* Biometric Toggle Section */}
        <View style={{ backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 24, padding: 20, marginTop: 12, borderWidth: 1, borderColor: theme.colors.outlineVariant + "20" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Biometric Authentication</Text>
              <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Required for transfers over $50k</Text>
            </View>
            <Switch 
              value={biometricAuth} 
              onValueChange={setBiometricAuth} 
              trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }}
            />
          </View>
        </View>

        {/* Actions */}
        <Pressable style={styles.kycBtn}>
          <Download size={20} color={theme.colors.primary} />
          <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>Download KYC Certificate</Text>
        </Pressable>

        <Pressable style={styles.logoutBtn} onPress={() => logout()}>
          <LogOut size={20} color={theme.colors.tertiary} />
          <Text style={{ fontSize: 15, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.tertiary }}>Secure Log Out</Text>
        </Pressable>

        {isEditing && (
          <TouchableOpacity 
            style={[styles.kycBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, height: 60, marginTop: 40 }]}
            onPress={handleSave}
          >
             <Text style={{ fontSize: 16, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onPrimary }}>SAVE CHANGES</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
