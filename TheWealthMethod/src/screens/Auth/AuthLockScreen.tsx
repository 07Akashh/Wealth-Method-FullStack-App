import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Vibration,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";
import { Lock, Fingerprint, ShieldCheck, Delete } from "lucide-react-native";
import Animated, { 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  useSharedValue,
  FadeIn
} from "react-native-reanimated";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useUserStore } from "../../store/userStore";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

const { width } = Dimensions.get("window");

const PIN_LENGTH = 6;

export const AuthLockScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { setAppLocked, name, pin: storedPin, biometricsEnabled } = useUserStore();
  
  const [pinEntry, setPinEntry] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const shakeOffset = useSharedValue(0);

  const handleShake = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, [shakeOffset]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const handleAuthenticate = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);

      const enrolledLevel = await LocalAuthentication.getEnrolledLevelAsync();
      const hasSecurity = enrolledLevel !== LocalAuthentication.SecurityLevel.NONE;

      if (!hasSecurity) {
        setIsAuthenticating(false);
        setError("Please use your Security PIN to unlock.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock your Wealth Vault",
        fallbackLabel: "Enter PIN",
        disableDeviceFallback: false,
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setAppLocked(false);
      } else {
        setIsAuthenticating(false);
      }
    } catch (e) {
      setError("Please use your Security PIN to unlock.");
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (biometricsEnabled) {
      handleAuthenticate();
    }
  }, []);

  const handleKeyPress = (num: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pinEntry.length < PIN_LENGTH) {
      const nextPin = pinEntry + num;
      setPinEntry(nextPin);
      setError(null);
      
      if (nextPin.length === PIN_LENGTH) {
        if (nextPin === storedPin) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setAppLocked(false);
        } else {
          handleShake();
          setPinEntry("");
          setError("Incorrect PIN. Please try again.");
        }
      }
    }
  };

  const handleBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPinEntry(prev => prev.slice(0, -1));
  };

  const renderKey = (val: string) => (
    <Pressable
      key={val}
      style={({ pressed }) => [
        styles.key,
        { backgroundColor: pressed ? theme.colors.surfaceContainerHighest : "transparent" }
      ]}
      onPress={() => handleKeyPress(val)}
    >
      <Text style={[styles.keyText, { color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.displayBold }]}>
        {val}
      </Text>
    </Pressable>
  );

  return (
    <ScreenWrapper hideHeader>
      <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
        <View style={styles.header}>
             <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + "15" }]}>
                <ShieldCheck size={40} color={theme.colors.primary} />
             </View>
             <Text style={[styles.title, { color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.displayBold }]}>
               {name}
             </Text>
             <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fontFamily.bodyRegular }]}>
               Enter your security PIN or authenticate to unlock
             </Text>
        </View>

        <Animated.View style={[styles.pinDotsContainer, shakeStyle]}>
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { 
                  borderColor: theme.colors.outlineVariant,
                  backgroundColor: i < pinEntry.length ? theme.colors.primary : "transparent" 
                }
              ]}
            />
          ))}
        </Animated.View>

        <View style={styles.feedbackContainer}>
          {error ? (
              <Animated.Text entering={FadeIn} style={[styles.errorText, { color: theme.colors.error, fontFamily: theme.typography.fontFamily.headlineSemi }]}>
                  {error}
              </Animated.Text>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>

        <View style={styles.pad}>
          <View style={styles.row}>
            {[ "1", "2", "3" ].map(renderKey)}
          </View>
          <View style={styles.row}>
            {[ "4", "5", "6" ].map(renderKey)}
          </View>
          <View style={styles.row}>
            {[ "7", "8", "9" ].map(renderKey)}
          </View>
          <View style={styles.row}>
            <Pressable
              style={styles.key}
              onPress={handleAuthenticate}
              disabled={isAuthenticating}
            >
              <Fingerprint size={28} color={theme.colors.primary} />
            </Pressable>
            {renderKey("0")}
            <Pressable
              style={styles.key}
              onPress={handleBackspace}
            >
              <Delete size={28} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Lock size={14} color={theme.colors.onSurfaceDim} />
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceDim, fontFamily: theme.typography.fontFamily.headlineSemi }]}>
            VAULT SECURED BY AES-256
          </Text>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
      alignItems: "center",
      marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 60,
    opacity: 0.7,
  },
  pinDotsContainer: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 40,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  feedbackContainer: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  errorText: {
      fontSize: 13,
      textAlign: "center",
  },
  pad: {
    width: "100%",
    paddingHorizontal: 40,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 28,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  footerText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
