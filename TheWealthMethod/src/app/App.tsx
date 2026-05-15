import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

import { AppProviders } from "./providers";

import { useAppReady } from "../hooks/useAppReady";
import { SplashScreen as CustomSplashScreen } from "../screens/Splash";
import { ThemeProvider } from "../theme/ThemeProvider";
import { View } from "react-native";

void SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { ready: appReady, progress } = useAppReady();
  const fontsReady = interLoaded;
  const isReady = appReady && fontsReady;

  useEffect(() => {
    if (fontsReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!isReady) {
    return (
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <CustomSplashScreen realtimeProgress={progress} />
        </View>
      </ThemeProvider>
    );
  }

  return <AppProviders />;
};

export default App;
