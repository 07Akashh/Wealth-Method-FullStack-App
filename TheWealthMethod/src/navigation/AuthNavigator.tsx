import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { ForgotPasswordScreen } from "../screens/Auth/ForgotPasswordScreen";
import { LoginScreen } from "../screens/Auth/LoginScreen";
import { OTPScreen } from "../screens/Auth/OTPScreen";
import { ResetPinScreen } from "../screens/Auth/ResetPinScreen";
import { SignupScreen } from "../screens/Auth/SignupScreen";
import { useAppTheme } from "../theme/ThemeProvider";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { theme } = useAppTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.semibold },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPin" component={ResetPinScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
