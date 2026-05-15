import React, { useMemo, useState, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  ViewStyle,
} from "react-native";
import { HistorySkeleton } from "../../../components/common/Skeleton";
import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";
import {
  Search,
  ShoppingBag,
  Wallet,
  Utensils,
  TrendingUp,
  Fuel,
  ArrowRight,
  Trash2,
  Zap,
  Plane,
  Plus,
  Download,
  Filter,
} from "lucide-react-native";
import { Platform } from "react-native";

import { ScreenWrapper } from "../../../components/layout/ScreenWrapper";
import { useAppTheme } from "../../../theme/ThemeProvider";
import { useTransactions, useDeleteTransaction } from "../../../lib/TanstackQuery/QueryHooks";
import { useFilterStore } from "../../../store/filterStore";
import { useBottomSheetStore } from "../../../store/bottomSheetStore";
import { useUserStore } from "../../../store/userStore";
import { exportToCSV } from "../../../utils/exportUtils";
import { Alert } from "react-native";

export const HistoryScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const openBottomSheet = useBottomSheetStore(state => state.open);
  const { selectedType, setFilter } = useFilterStore();
  const [search, setSearch] = useState("");
  const { currencySymbol, privacyEnabled, convertAmount } = useUserStore();

  const { data: transactions = [], isLoading, isError, refetch } = useTransactions({ 
    type: selectedType === 'all' ? undefined : selectedType 
  });
  
  const { mutate: deleteTx } = useDeleteTransaction();

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx: { category: string; note?: string }) => 
      tx.category.toLowerCase().includes(search.toLowerCase()) || 
      (tx.note || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to remove this record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTx(id) }
      ]
    );
  }, [deleteTx]);

  const handleOpenEdit = useCallback((tx: any) => {
    openBottomSheet('add-transaction', tx);
  }, [openBottomSheet]);

  const dynamicStyles = useMemo(
    () => ({
      headerRow: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
      } as ViewStyle,
      headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center" as const,
        alignItems: "center" as const,
      } as ViewStyle,
      searchBar: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: theme.colors.surfaceContainerLowest,
        height: 56,
        borderRadius: theme.radius.md,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      } as ViewStyle,
      searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: theme.typography.fontSize.bodyMd,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurface,
      } as TextStyle,
      filterRow: {
        flexDirection: "row" as const,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: theme.radius.md,
        padding: 4,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      } as ViewStyle,
      filterButton: {
        flex: 1,
        height: 40,
        borderRadius: theme.radius.sm,
        justifyContent: "center" as const,
        alignItems: "center" as const,
      } as ViewStyle,
      filterButtonActive: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        ...theme.effects.shadows.ambient,
      } as ViewStyle,
      filterText: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceVariant,
        letterSpacing: 1,
      } as TextStyle,
      filterTextActive: {
        color: theme.colors.primary,
      } as TextStyle,
      sectionCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 32,
        padding: 24,
        // marginBottom: 24,
        ...theme.effects.shadows.ambient,
      } as ViewStyle,
      sectionTitle: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceVariant,
        letterSpacing: theme.typography.letterSpacing.label,
        textTransform: "uppercase" as const,
        // marginBottom: 20,
      } as TextStyle,
      txItem: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingVertical: 16,
        borderBottomColor: theme.colors.outlineVariant,
      } as ViewStyle,
      iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        marginRight: 16,
      } as ViewStyle,
      txBody: {
        flex: 1,
      } as ViewStyle,
      txTitle: {
        fontSize: theme.typography.fontSize.bodyMd,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurface,
      } as TextStyle,
      txMeta: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurfaceVariant,
        marginTop: 2,
      } as TextStyle,
      txRight: {
        alignItems: "flex-end" as const,
      } as ViewStyle,
      txAmount: {
        fontSize: theme.typography.fontSize.bodyMd,
        fontFamily: theme.typography.fontFamily.displayBold,
      } as TextStyle,
      txStatus: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.bodyRegular,
        color: theme.colors.onSurfaceVariant,
        marginTop: 2,
      } as TextStyle,
      viewPast: {
        flexDirection: "row" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        paddingVertical: 16,
        gap: 8,
      } as ViewStyle,
      viewPastText: {
        fontSize: theme.typography.fontSize.labelSm,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.primary,
        textTransform: "uppercase" as const,
        letterSpacing: 0.5,
      } as TextStyle,
    }),
    [theme, selectedType, isDark],
  );

  const getCategoryIcon = (cat: string) => {
    const map: Record<string, any> = {
      'Food & Drink': Utensils,
      'Travel': Plane,
      'Utilities': Zap,
      'Salary': Wallet,
      'Dividend': TrendingUp,
    };
    return map[cat] || ShoppingBag;
  };

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      'Food & Drink': theme.colors.warning,
      'Travel': theme.colors.info,
      'Utilities': theme.colors.primary,
      'Salary': theme.colors.secondary,
      'Dividend': theme.colors.secondary,
    };
    return map[cat] || theme.colors.tertiary;
  };

  return (
    <ScreenWrapper
      onRefresh={handleRefresh}
      refreshing={refreshing}
      floatingContent={
        <Pressable 
          style={{
            position: "absolute" as const,
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.colors.primary, 
            bottom: Platform.OS === 'ios' ? 120 : 100,
            right: 24,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            ...theme.effects.shadows.ambient,
            zIndex: 1000,
          }} 
          onPress={() => openBottomSheet('add-transaction')}
        >
          <Plus size={32} color={theme.colors.onPrimary} strokeWidth={3} />
        </Pressable>
      }
    >
        <View style={dynamicStyles.headerRow}>
          <Text style={{ fontSize: 24, fontFamily: theme.typography.fontFamily.headlineBold, color: theme.colors.onSurface }}>History</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable 
              onPress={() => exportToCSV(transactions, `wealth_ledger_${new Date().toISOString().split('T')[0]}`)}
              style={[dynamicStyles.headerBtn, { backgroundColor: theme.colors.surfaceContainerHigh }]}
            >
              <Download size={20} color={theme.colors.onSurface} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <View style={dynamicStyles.searchBar}>
          <Search size={20} color={theme.colors.onSurfaceVariant} />
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            style={dynamicStyles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={dynamicStyles.filterRow}>
          {(["all", "income", "expense"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter({ selectedType: f })}
              style={[
                dynamicStyles.filterButton,
                selectedType === f && dynamicStyles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  dynamicStyles.filterText,
                  selectedType === f && dynamicStyles.filterTextActive,
                ]}
              >
                {f.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>RECENT ACTIVITY</Text>

          {isLoading ? (
            <HistorySkeleton />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState 
                title="No History" 
                message={search ? "No records match your search criteria." : "Your transaction vault is waiting for its first record."} 
                Icon={Search} 
            />
          ) : (
            filteredTransactions.map((tx: { id: string; category: string; note?: string; date: string; amount: number; type: string }, index: number) => {
              const Icon = getCategoryIcon(tx.category);
              const color = getCategoryColor(tx.category);
              return (
                <Pressable
                  key={`tx-${tx.id || index}`}
                  onPress={() => handleOpenEdit(tx)}
                  style={[
                    dynamicStyles.txItem,
                    {
                      borderBottomWidth:
                        index === filteredTransactions.length - 1 ? 0 : 1.5,
                    },
                  ]}
                >
                  <View
                    style={[dynamicStyles.iconBox, { backgroundColor: color + "1A" }]}
                  >
                    <Icon size={22} color={color} strokeWidth={2.5} />
                  </View>
                  <View style={dynamicStyles.txBody}>
                    <Text style={dynamicStyles.txTitle}>{tx.note || tx.category}</Text>
                    <Text style={dynamicStyles.txMeta}>
                      {tx.category} • {new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </Text>
                  </View>
                  <View style={dynamicStyles.txRight}>
                    <Text
                      style={[
                        dynamicStyles.txAmount,
                        {
                          color:
                            tx.type === "income"
                              ? theme.colors.secondary
                              : theme.colors.tertiary,
                        },
                      ]}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {`${tx.type === "income" ? "+" : "-"}${currencySymbol}${privacyEnabled ? '••••' : convertAmount(tx.amount).toLocaleString()}`}
                    </Text>
                    <Pressable onPress={() => handleDelete(tx.id)}>
                      <Trash2 size={16} color={theme.colors.onSurfaceDim} style={{ marginTop: 4 }} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })
          )}

          <Pressable style={dynamicStyles.viewPast}>
            <Text style={dynamicStyles.viewPastText}>VIEW PAST MONTHS</Text>
            <ArrowRight size={14} color={theme.colors.primary} />
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};
