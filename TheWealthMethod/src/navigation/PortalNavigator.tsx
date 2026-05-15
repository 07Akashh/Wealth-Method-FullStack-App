import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { CustomHeader } from "../components/layout/CustomHeader";
import { ProfileScreen } from "../screens/Profile";
import { WealthOverviewScreen } from "../screens/Portal/WealthOverview";
import { ChangePasswordScreen } from "../screens/Profile/ChangePasswordScreen";
import { InsightsScreen } from "../screens/Portal/Insight";
import { HistoryScreen } from "../screens/Portal/History";
import { AssetVaultScreen } from "../screens/Portal/Goals";
import { NotificationsScreen } from "../screens/Notification";
import { PersonalInfoScreen } from "../screens/Profile/PersonalInfoScreen";
import { HelpCenterScreen } from "../screens/Profile/HelpCenterScreen";
import { ContactUsScreen } from "../screens/Profile/ContactUsScreen";
import { GoalDetailScreen } from "../screens/Portal/Goals/GoalDetailScreen";
import { MessagesScreen } from "../screens/Message";
import { NotificationSettingsScreen } from "../screens/Profile/NotificationSettingsScreen";
import { SecurityScreen } from "../screens/Profile/SecurityScreen";
import { IndigoVaultScreen } from "../screens/Profile/IndigoVaultScreen";
import { ReceiptCaptureScreen } from "../screens/Portal/ReceiptCapture";
import { ReceiptPreviewScreen } from "../screens/Portal/ReceiptPreview";
import { CustomTabBar } from "../components/layout/CustomTabBar";
import { PortalStackParamList, PortalTabParamList } from "./types";

const PlaceholderGoals = () => <AssetVaultScreen />;

const Tab = createBottomTabNavigator<PortalTabParamList>();
const Stack = createNativeStackNavigator<PortalStackParamList>();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{ header: () => <CustomHeader subtitle="PORTAL HUB" /> }}
  >
    <Stack.Screen
      name="PortalHome"
      component={WealthOverviewScreen}
      options={{ title: "Wealth Overview" }}
    />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator
    screenOptions={{ header: () => <CustomHeader subtitle="TRANSACTIONS" /> }}
  >
    <Stack.Screen
      name="PortalHistory"
      component={HistoryScreen}
      options={{ title: "History" }}
    />
  </Stack.Navigator>
);

// AddStack removed, now using BottomSheetModal globally

const GoalsStack = () => (
  <Stack.Navigator
    screenOptions={{ header: () => <CustomHeader subtitle="SAVINGS GOALS" /> }}
  >
    <Stack.Screen
      name="PortalGoals"
      component={PlaceholderGoals}
      options={{ title: "Strategy" }}
    />
  </Stack.Navigator>
);

const AnalyticsStack = () => (
  <Stack.Navigator
    screenOptions={{ header: () => <CustomHeader subtitle="ANALYTICS" /> }}
  >
    <Stack.Screen
      name="PortalAnalytics"
      component={InsightsScreen}
      options={{ title: "Insights" }}
    />
  </Stack.Navigator>
);

import {
  LayoutGrid,
  ReceiptText,
  PlusCircle,
  Target,
  BarChart3,
} from "lucide-react-native";

const PortalTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "HOME",
          tabBarIcon: (props) => <LayoutGrid {...props} />,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          tabBarLabel: "HISTORY",
          tabBarIcon: (props) => <ReceiptText {...props} />,
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={View} // Placeholder as it's intercepted by the tab bar
        options={{
          tabBarLabel: "ADD",
          tabBarIcon: (props) => <PlusCircle {...props} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // handled in CustomTabBar, but good to have a backup here
          },
        }}
      />
      <Tab.Screen
        name="GoalsTab"
        component={GoalsStack}
        options={{
          tabBarLabel: "GOALS",
          tabBarIcon: (props) => <Target {...props} />,
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsStack}
        options={{
          tabBarLabel: "INSIGHTS",
          tabBarIcon: (props) => <BarChart3 {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const PortalNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={PortalTabs} />
      <Stack.Screen
        name="PortalProfile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="My Profile" subtitle="IDENTITY" />
          ),
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="PortalMessages"
        component={MessagesScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Messages" subtitle="COMMUNICATIONS" />
          ),
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Notif Settings" subtitle="ALERTS" />
          ),
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="SecurityHub"
        component={SecurityScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              showBack
              title="Security"
              subtitle="VAULT PROTECTION"
            />
          ),
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="IndigoVault"
        component={IndigoVaultScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Indigo Vault" subtitle="PORTFOLIO" />
          ),
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="PortalNotifications"
        component={NotificationsScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Alerts" subtitle="NOTIFICATIONS" />
          ),
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Security" subtitle="PASSWORD" />
          ),
        }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: ({ options }) => (
            <CustomHeader
              showBack
              title="Personal Info"
              subtitle="ACCOUNT"
              rightComponent={options.headerRight?.({ canGoBack: true })}
            />
          ),
        })}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Help Center" subtitle="SUPPORT" />
          ),
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader showBack title="Contact Us" subtitle="SUPPORT" />
          ),
        }}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={({ route }: any) => ({
          headerShown: true,
          header: ({ options }) => (
            <CustomHeader
              showBack
              title={route.params?.goal?.title || "Goal Details"}
              subtitle="STRATEGY"
              rightComponent={options.headerRight?.({ canGoBack: true })}
            />
          ),
          animation: "slide_from_right",
        })}
      />
      <Stack.Screen
        name="ReceiptCapture"
        component={ReceiptCaptureScreen}
        options={{
          headerShown: false,
          // animationEnabled: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ReceiptPreview"
        component={ReceiptPreviewScreen}
        options={{
          headerShown: false,
          // animationEnabled: true,
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
};
