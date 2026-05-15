import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/layout/ScreenWrapper";
import { useAppTheme } from "../../../theme/ThemeProvider";
import { useAddTransaction } from "../../../lib/TanstackQuery/QueryHooks";
import { ArrowLeft, Check, X } from "lucide-react-native";

export const AddTransactionScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0.");
      return;
    }
    if (!category.trim()) {
      Alert.alert("Category Required", "Please enter a category name.");
      return;
    }

    addTransaction(
      {
        amount: numAmount,
        type,
        category: category.trim(),
        date: new Date().toISOString(),
        note: note.trim(),
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  };

  const categories = type === "income" 
    ? ["Salary", "Dividend", "Gift", "Refund", "Other"]
    : ["Food & Drink", "Travel", "Utilities", "Shopping", "Health", "Other"];

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.colors.onSurface} strokeWidth={2.5} />
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.displayBold }]}>
            New Entry
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: theme.colors.surfaceContainerLow }]}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>AMOUNT</Text>
          <View style={styles.amountInputRow}>
            <Text style={[styles.currency, { color: theme.colors.onSurface }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: theme.colors.onSurface, fontFamily: theme.typography.fontFamily.displayBold }]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.onSurfaceDim}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
        </View>

        <View style={styles.typeSelector}>
          {(["expense", "income"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[
                styles.typeBtn,
                { backgroundColor: type === t ? (t === 'income' ? theme.colors.secondary : theme.colors.tertiary) : theme.colors.surfaceContainerLow }
              ]}
            >
              <Text style={[
                styles.typeBtnText,
                { color: type === t ? theme.colors.onPrimary : theme.colors.onSurfaceVariant, fontFamily: theme.typography.fontFamily.headlineBold }
              ]}>
                {t.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>CATEGORY</Text>
          <View style={styles.chipGrid}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.chip,
                  { 
                    backgroundColor: category === cat ? theme.colors.primary : theme.colors.surfaceContainerLow,
                    borderColor: theme.colors.outlineVariant,
                    borderWidth: 1
                  }
                ]}
              >
                <Text style={[
                  styles.chipText,
                  { color: category === cat ? theme.colors.onPrimary : theme.colors.onSurface, fontFamily: theme.typography.fontFamily.headlineSemi }
                ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, marginTop: 12 }]}
            placeholder="Or type custom category..."
            placeholderTextColor={theme.colors.onSurfaceDim}
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>NOTE (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="Add a reminder..."
            placeholderTextColor={theme.colors.onSurfaceDim}
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        <Pressable 
          onPress={handleSubmit}
          disabled={isPending}
          style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
        >
          {isPending ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={[styles.submitBtnText, { color: theme.colors.onPrimary, fontFamily: theme.typography.fontFamily.headlineBold }]}>
              SAVE TRANSACTION
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
  },
  inputGroup: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 32,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  typeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBtnText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 32,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 13,
  },
  input: {
    padding: 16,
    borderRadius: 16,
    fontSize: 15,
  },
  submitBtn: {
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
