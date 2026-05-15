import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";

import { useAuthStore } from "../store/authStore";
import { OnboardingScreen } from "../screens/Onboarding";
import { SplashScreen } from "../screens/Splash";
import { AuthNavigator } from "./AuthNavigator";
import { PortalNavigator } from "./PortalNavigator";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  // -- Session-level state to ensure Splash is shown on APP REOPEN even if hydrated.
  const [sessionSplashDone, setSessionSplashDone] = useState(false);

  if (!hasHydrated || !sessionSplashDone) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash">
                {(props) => (
                    <SplashScreen 
                        {...props} 
                        onAnimationComplete={() => setSessionSplashDone(true)} 
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isAuthenticated ? (
        <>
          {!hasCompletedOnboarding && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
          <Stack.Screen name="AuthStack" component={AuthNavigator} />
        </>
      ) : (
        <Stack.Screen name="PortalStack" component={PortalNavigator} />
      )}
    </Stack.Navigator>
  );
};
