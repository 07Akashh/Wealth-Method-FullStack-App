import React, { useRef, useState, useEffect, useMemo } from "react";
import { StyleSheet, TextInput, View, Pressable, Animated, ViewStyle, TextStyle } from "react-native";
import { useAppTheme } from "../../theme/ThemeProvider";

type OtpInputProps = {
  length?: number;
  value: string;
  onValueChange: (value: string) => void;
  onComplete?: (otp: string) => void;
};

export const OtpInput: React.FC<OtpInputProps> = ({ length = 4, value, onValueChange, onComplete }) => {
  const { theme } = useAppTheme();
  const inputs = useRef<TextInput[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const animations = useRef(Array.from({ length }, () => new Animated.Value(0))).current;

  useEffect(() => {
    // Auto focus the first empty input
    const firstEmpty = value.length;
    if (firstEmpty < length) {
      inputs.current[firstEmpty]?.focus();
    }
  }, []);

  const animateCell = (index: number, focused: boolean) => {
    Animated.spring(animations[index], {
      toValue: focused ? 1 : 0,
      useNativeDriver: false, // Color interpolation doesn't support native driver in some cases
      friction: 8,
      tension: 100,
    }).start();
  };

  const dynamicStyles = useMemo(() => ({
    cell: {
      width: 60,
      height: 68,
      backgroundColor: theme.colors.surfaceContainerHighest,
      borderRadius: 16,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderWidth: 2,
    } as ViewStyle,
    cellFilled: {
      backgroundColor: theme.colors.surfaceContainerHigh,
    } as ViewStyle,
    input: {
      fontSize: 28,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      textAlign: "center" as const,
      width: "100%" as const,
      height: "100%" as const,
    } as TextStyle,
  }), [theme]);

  const handleTextChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pasteValue = text.slice(0, length);
      onValueChange(pasteValue);
      if (pasteValue.length === length) {
        onComplete?.(pasteValue);
      }
      return;
    }

    const newValue = value.split("");
    newValue[index] = text;
    const finalValue = newValue.join("");
    onValueChange(finalValue);

    if (text.length > 0 && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (finalValue.length === length) {
      onComplete?.(finalValue);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (value[index] !== "") {
        const newValue = value.split("");
        newValue[index] = "";
        onValueChange(newValue.join(""));
      } else if (index > 0) {
        const newValue = value.split("");
        newValue[index - 1] = "";
        onValueChange(newValue.join(""));
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    animateCell(index, true);
  };

  const handleBlur = (index: number) => {
    animateCell(index, false);
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const scale = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        });

        const borderColor = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.outlineVariant, theme.colors.primary],
        });

        return (
          <Animated.View
            key={index}
            style={[
              dynamicStyles.cell,
              {
                transform: [{ scale }],
                borderColor,
              },
              value[index] ? dynamicStyles.cellFilled : null,
            ]}
          >
            <TextInput
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
              style={dynamicStyles.input}
              maxLength={index === 0 && value.length === 0 ? length : 1}
              keyboardType="number-pad"
              value={value[index] || ""}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              selectionColor={theme.colors.primary}
              selectTextOnFocus
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginVertical: 32,
  },
});
