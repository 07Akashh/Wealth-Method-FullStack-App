import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import {
  Activity,
  Calendar as CalendarIcon,
  Car,
  ChevronDown,
  ChevronUp,
  FilePlus,
  Film,
  Gift,
  GraduationCap,
  Home,
  Landmark,
  MoreHorizontal,
  PawPrint,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Tv,
  Utensils,
  Wallet,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAddTransaction, useUpdateTransaction } from '../../lib/TanstackQuery/QueryHooks';
import { useBottomSheetStore } from '../../store/bottomSheetStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useUserStore } from '../../store/userStore';
import { useAppTheme } from '../../theme/ThemeProvider';

const CATEGORIES = [
  { id: 'food', name: 'DINING', icon: Utensils },
  { id: 'groceries', name: 'GROCERS', icon: ShoppingBag },
  { id: 'rent', name: 'RENT', icon: Home },
  { id: 'salary', name: 'SALARY', icon: Wallet },
  { id: 'fuel', name: 'FUEL', icon: Car },
  { id: 'parking', name: 'PARKING', icon: Car },
  { id: 'hotel', name: 'HOTEL', icon: Home },
  { id: 'bills', name: 'BILLS', icon: Tv },
  { id: 'subs', name: 'SUBS.', icon: Tv },
  { id: 'fun', name: 'FUN', icon: Film },
  { id: 'shop', name: 'SHOP', icon: ShoppingBag },
  { id: 'auto', name: 'AUTO', icon: Car },
  { id: 'health', name: 'HEALTH', icon: Activity },
  { id: 'insurance', name: 'INS.', icon: ShieldCheck },
  { id: 'edu', name: 'LEARN', icon: GraduationCap },
  { id: 'pet', name: 'PETS', icon: PawPrint },
  { id: 'gift', name: 'GIFT', icon: Gift },
  { id: 'travel', name: 'TRAVEL', icon: Plane },
  { id: 'tax', name: 'TAXES', icon: Landmark },
  { id: 'other', name: 'OTHER', icon: MoreHorizontal },
];

export const AddTransactionBottomSheet = () => {
  const { theme, isDark } = useAppTheme();
  const { isOpened, close, editData, type: sheetType } = useBottomSheetStore();
  const { currencySymbol, convertAmount, monthlyLimit } = useUserStore();
  const { mutate: addTransaction, isPending: isAdding } = useAddTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } = useUpdateTransaction();

  const isPending = isAdding || isUpdating;
  const isEditing = !!editData;
  const [saveStage, setSaveStage] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const saveScale = useRef(new Animated.Value(1)).current;

  // Bottom Sheet Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const datePickerModalRef = useRef<BottomSheetModal>(null);

  // Snaps
  const snapPoints = useMemo(() => ['92%'], []);

  useEffect(() => {
    if (isOpened && sheetType === 'add-transaction') {
      setSaveStage('idle');
      if (editData) {
        const transactionId = editData.id || editData._id;
        setAmount(editData.amount.toString());
        setType(editData.type);
        setCategory(CATEGORIES.find(c => c.name === editData.category)?.id || 'other');
        setNote(editData.note || '');
        setDate(new Date(editData.date));
        setReceipt(editData.receipt || null);
        if (transactionId) {
          editData.id = transactionId;
        }
      } else {
        // Reset for new
        setAmount('');
        setType('expense');
        setCategory('food');
        setNote('');
        setDate(new Date());
        setReceipt(null);
      }
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      setSaveStage('idle');
    }
  }, [isOpened, editData]);

  useEffect(() => {
    if (isPending) {
      setSaveStage('saving');
      Animated.loop(
        Animated.sequence([
          Animated.timing(saveScale, {
            toValue: 1.03,
            duration: 550,
            useNativeDriver: true,
          }),
          Animated.timing(saveScale, {
            toValue: 0.98,
            duration: 550,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      saveScale.stopAnimation();
      Animated.spring(saveScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      if (saveStage === 'saving') setSaveStage('idle');
    }
  }, [isPending, saveScale, saveStage]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsAt={-1}
        appearsAt={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('[Processing] Starting transaction save...', { isEditing, amount, type, category });
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      console.log('[Processing] Save failed: Invalid amount', amount);
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    const catName = CATEGORIES.find(c => c.id === category)?.name || 'Other';

    const payload = {
      amount: numAmount,
      type,
      category: catName,
      date: date.toISOString(),
      note: note.trim(),
      receipt: receipt || undefined,
    };

    if (isEditing) {
      const transactionId = editData.id || editData._id;
      console.log('[Processing] Updating existing transaction...', transactionId);
      updateTransaction(
        { ...payload, id: transactionId },
        {
          onSuccess: () => {
            console.log('[Processing] Transaction update successful');
            setSaveStage('success');
            handleClose();
          },
          onError: (error: any) => {
            console.error('[Processing] Transaction update failed', error);
            setSaveStage('error');
          }
        }
      );
    } else {
      console.log('[Processing] Adding new transaction...');
      addTransaction(
        payload,
        {
          onSuccess: () => {
            console.log('[Processing] Transaction add successful');
            setSaveStage('success');

            // Add System Notification
            useNotificationStore.getState().addNotification({
              type: 'success',
              category: 'Transaction',
              title: `${type === 'income' ? 'Income' : 'Expense'} Logged`,
              message: `Successfully added ${catName} ${type === 'income' ? 'credit' : 'debit'} of ${currencySymbol}${numAmount.toFixed(2)}.`,
              meta: type === 'income' ? `+${currencySymbol}${numAmount}` : `-${currencySymbol}${numAmount}`
            });

            // Check for Limit Warn (if expense)
            if (type === 'expense') {
              const { monthlyLimit } = useUserStore.getState();
              if (numAmount > monthlyLimit * 0.4) {
                useNotificationStore.getState().addNotification({
                  type: 'priority',
                  category: 'Security',
                  title: 'High Spend Alert',
                  message: `This transaction represents ${((numAmount / monthlyLimit) * 100).toFixed(0)}% of your monthly $${monthlyLimit} limit.`,
                });
              }
            }

            handleClose();
          },
          onError: (error) => {
            console.error('[Processing] Transaction add failed', error);
            setSaveStage('error');
          }
        }
      );
    }
  };

  const pickImage = async () => {
    console.log('[Processing] Opening image library...');
    const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Gallery Permission', 'Please allow photo access to pick a receipt from your gallery.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log('[Processing] Image selected:', result.assets[0].uri);
      setReceipt(result.assets[0].uri);
    } else {
      console.log('[Processing] Image picking canceled');
    }
  };

  const handleAmountChange = useCallback((text: string) => {
    // Allow numbers and a single decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) return;

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) return;

    setAmount(cleaned);
  }, []);

  const adjustAmount = useCallback((delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current = parseFloat(amount) || 0;
    const next = Math.max(0, current + delta);
    setAmount(next.toFixed(2));
  }, [amount]);

  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    handleIndicator: {
      backgroundColor: theme.colors.outlineVariant,
      width: 40,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    title: {
      fontSize: 18,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
    },
    historyLink: {
      fontSize: 15,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.primary,
    },
    sectionLabel: {
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center' as const,
      letterSpacing: 1,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
    },
    amountContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginVertical: 20,
    },
    currency: {
      fontSize: 42,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurfaceDim,
      marginRight: 8,
    },
    amountInput: {
      fontSize: 64,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      minWidth: 150,
      textAlign: 'center' as const,
    },
    stepper: {
      marginLeft: 20,
      gap: 12,
    },
    tabContainer: {
      flexDirection: 'row' as const,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 16,
      marginHorizontal: 24,
      padding: 4,
      marginBottom: 32,
    },
    tab: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    activeTab: {
      backgroundColor: theme.colors.surfaceContainerLowest,
      ...theme.effects.shadows.ambient,
    },
    tabText: {
      fontSize: 14,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    grid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      paddingHorizontal: 24,
      justifyContent: 'space-between' as const,
    },
    catItem: {
      width: '23%' as const,
      alignItems: 'center' as const,
      marginBottom: 12,
    },
    catIconBox: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceContainerLow,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    activeCatIcon: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer + '20',
    },
    catName: {
      fontSize: 9,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
    },
    activeCatName: {
      color: theme.colors.primary,
    },
    formSection: {
      marginBottom: 32,
    },
    datePicker: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.surfaceContainerLow,
      marginHorizontal: 24,
      padding: 16,
      borderRadius: 16,
      gap: 12,
    },
    dateText: {
      fontSize: 15,
      fontFamily: theme.typography.fontFamily.headlineSemi,
      color: theme.colors.onSurface,
    },
    noteInput: {
      backgroundColor: theme.colors.surfaceContainerLow,
      marginHorizontal: 24,
      padding: 16,
      borderRadius: 16,
      fontSize: 15,
      fontFamily: theme.typography.fontFamily.bodyRegular,
      color: theme.colors.onSurface,
      height: 100,
      textAlignVertical: 'top' as const,
    },
    attachBox: {
      borderWidth: 1.5,
      borderColor: theme.colors.primary + '40',
      borderStyle: 'dashed' as const,
      marginHorizontal: 24,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 8,
      backgroundColor: theme.colors.primaryContainer + '08',
    },
    attachText: {
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.primary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      marginHorizontal: 24,
      height: 64,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginTop: 20,
      marginBottom: 40,
      ...theme.effects.shadows.ambient,
    },
    saveButtonPending: {
      backgroundColor: theme.colors.primary + 'E6',
    },
    saveButtonSuccess: {
      backgroundColor: theme.colors.success,
    },
    saveButtonError: {
      backgroundColor: theme.colors.error,
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: '#FFFFFF',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    statusBanner: {
      marginHorizontal: 24,
      marginTop: 10,
      marginBottom: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
    },
    statusBannerText: {
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurface,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.4,
      flex: 1,
    },
  }), [theme, isDark, amount, type, category]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      onDismiss={handleClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={dynamicStyles.container}
      handleIndicatorStyle={dynamicStyles.handleIndicator}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={handleClose}>
          <X size={24} color={theme.colors.onSurface} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={dynamicStyles.title}>{isEditing ? 'Edit' : 'Add'} Transaction</Text>
        <TouchableOpacity>
          <Text style={dynamicStyles.historyLink}>History</Text>
        </TouchableOpacity>
      </View>

      {saveStage !== 'idle' && (
        <View
          style={[
            dynamicStyles.statusBanner,
            {
              backgroundColor:
                saveStage === 'saving'
                  ? theme.colors.primaryContainer + 'B0'
                  : saveStage === 'success'
                    ? theme.colors.success + '22'
                    : theme.colors.errorContainer + 'C0',
            },
          ]}
        >
          {saveStage === 'saving' ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: saveStage === 'success' ? theme.colors.success : theme.colors.error,
              }}
            />
          )}
          <Text style={dynamicStyles.statusBannerText}>
            {saveStage === 'saving'
              ? `${isEditing ? 'Updating' : 'Saving'} transaction...`
              : saveStage === 'success'
                ? 'Transaction saved successfully.'
                : 'Something went wrong. Please try again.'}
          </Text>
        </View>
      )}

      <BottomSheetScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Amount Section */}
        <View style={{ marginTop: 24 }}>
          <Text style={dynamicStyles.sectionLabel}>ENTER AMOUNT</Text>
          <View style={[
            dynamicStyles.amountContainer,
            amountFocused && { borderColor: theme.colors.primary, borderBottomWidth: 2, paddingBottom: 10 }
          ]}>
            <Text style={dynamicStyles.currency}>{currencySymbol}</Text>
            <BottomSheetTextInput
              style={dynamicStyles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={theme.colors.onSurfaceDim}
              autoFocus
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
            />
            <View style={dynamicStyles.stepper}>
              <TouchableOpacity onPress={() => adjustAmount(10)}>
                <ChevronUp size={24} color={theme.colors.onSurfaceDim} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => adjustAmount(-10)}>
                <ChevronDown size={24} color={theme.colors.onSurfaceDim} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Type Selector */}
        <View style={dynamicStyles.tabContainer}>
          <Pressable
            onPress={() => setType('expense')}
            style={[dynamicStyles.tab, type === 'expense' && dynamicStyles.activeTab]}
          >
            <Text style={[dynamicStyles.tabText, type === 'expense' && dynamicStyles.activeTabText]}>Expense</Text>
          </Pressable>
          <Pressable
            onPress={() => setType('income')}
            style={[dynamicStyles.tab, type === 'income' && dynamicStyles.activeTab]}
          >
            <Text style={[dynamicStyles.tabText, type === 'income' && dynamicStyles.activeTabText]}>Income</Text>
          </Pressable>
        </View>

        {/* Category Grid */}
        <View style={dynamicStyles.formSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 12 }}>
            <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left', marginBottom: 0 }]}>SELECT CATEGORY</Text>
          </View>
          <View style={dynamicStyles.grid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={dynamicStyles.catItem}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCategory(cat.id);
                }}
              >
                <View style={[dynamicStyles.catIconBox, category === cat.id && dynamicStyles.activeCatIcon]}>
                  <cat.icon size={26} color={category === cat.id ? theme.colors.primary : theme.colors.onSurfaceVariant} />
                </View>
                <Text style={[dynamicStyles.catName, category === cat.id && dynamicStyles.activeCatName]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selector */}
        <View style={dynamicStyles.formSection}>
          <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left', paddingHorizontal: 24 }]}>TRANSACTION DATE</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
            style={[
              dynamicStyles.datePicker,
              showDatePicker && { borderColor: theme.colors.primary, borderWidth: 1.5, backgroundColor: theme.colors.primaryContainer + '10' }
            ]}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[dynamicStyles.dateText, { fontSize: 13, color: theme.colors.onSurfaceVariant, marginBottom: 2 }]}>Selected Date</Text>
              <Text style={dynamicStyles.dateText}>
                {date.toDateString() === new Date().toDateString() ? 'Today, ' : ''}
                {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <View style={{
              backgroundColor: theme.colors.surfaceContainerLow,
              marginHorizontal: 24,
              marginTop: 12,
              borderRadius: 24,
              padding: 10,
              overflow: 'hidden'
            }}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                accentColor={theme.colors.primary}
                themeVariant={isDark ? 'dark' : 'light'}
                onChange={(event: any, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) setDate(selectedDate);
                }}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={{ alignSelf: 'flex-end', padding: 12 }}
                >
                  <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily.headlineBold }}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Notes Section */}
        <View style={dynamicStyles.formSection}>
          <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left', paddingHorizontal: 24 }]}>NOTES & MEMO</Text>
          <BottomSheetTextInput
            style={[dynamicStyles.noteInput, noteFocused && { borderColor: theme.colors.primary, borderWidth: 1.5, backgroundColor: theme.colors.primaryContainer + '10' }]}
            placeholder="What was this for?"
            placeholderTextColor={theme.colors.onSurfaceDim}
            multiline
            value={note}
            onChangeText={setNote}
            onFocus={() => setNoteFocused(true)}
            onBlur={() => setNoteFocused(false)}
          />
        </View>

        {/* Attach Receipt */}
        <View style={dynamicStyles.formSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 12 }}>
            <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left', marginBottom: 0 }]}>RECEIPT & PROOF</Text>
            {receipt && (
              <TouchableOpacity onPress={() => setReceipt(null)}>
                <Text style={[dynamicStyles.historyLink, { fontSize: 13, color: '#ef4444' }]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={pickImage}
            style={[
              dynamicStyles.attachBox,
              receipt && { borderStyle: 'solid', padding: 0, overflow: 'hidden', height: 200 }
            ]}
          >
            {receipt ? (
              <Image source={{ uri: receipt }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <>
                <FilePlus size={24} color={theme.colors.primary} />
                <Text style={dynamicStyles.attachText}>ATTACH RECEIPT</Text>
                <Text style={{ fontSize: 10, color: theme.colors.onSurfaceVariant, opacity: 0.6 }}>Tap to open gallery</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <Animated.View
          style={{
            transform: [{ scale: saveScale }],
          }}
        >
        <TouchableOpacity
          style={[
            dynamicStyles.saveButton,
            isPending && dynamicStyles.saveButtonPending,
            saveStage === 'success' && dynamicStyles.saveButtonSuccess,
            saveStage === 'error' && dynamicStyles.saveButtonError,
          ]}
          onPress={handleSave}
          disabled={isPending}
        >
          {isPending ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={dynamicStyles.saveButtonText}>{isEditing ? 'UPDATING...' : 'SAVING...'}</Text>
            </View>
          ) : (
            <Text style={dynamicStyles.saveButtonText}>{isEditing ? 'UPDATE TRANSACTION' : 'SAVE TRANSACTION'}</Text>
          )}
        </TouchableOpacity>
        </Animated.View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
