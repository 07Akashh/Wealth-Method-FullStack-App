import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppTheme } from "../../theme/ThemeProvider";

export const Loader: React.FC = () => {
  const { theme } = useAppTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
