import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import {
    Activity,
    Calendar as CalendarIcon,
    Car,
    ChevronDown,
    ChevronUp,
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
    X
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAddTransaction } from '../../../lib/TanstackQuery/QueryHooks';
import { PortalStackParamList } from '../../../navigation/types';
import { useNotificationStore } from '../../../store/notificationStore';
import { useReceiptCaptureStore } from '../../../store/receiptCaptureStore';
import { useUserStore } from '../../../store/userStore';
import { useAppTheme } from '../../../theme/ThemeProvider';

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

type Props = NativeStackScreenProps<PortalStackParamList, 'ReceiptPreview'>;

export const ReceiptPreviewScreen: React.FC<Props> = ({ navigation }) => {
    const { theme, isDark } = useAppTheme();
    const { close, receiptImage, transactionType, setTransactionType, clearReceiptImage } = useReceiptCaptureStore();
    const { currencySymbol, convertAmount, monthlyLimit } = useUserStore();
    const { mutate: addTransaction, isPending: isAdding } = useAddTransaction();

    // Form State
    const [amount, setAmount] = useState('');
    const [amountFocused, setAmountFocused] = useState(false);
    const [noteFocused, setNoteFocused] = useState(false);
    const [category, setCategory] = useState('food');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleAmountChange = useCallback((text: string) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) return;
        if (parts[1] && parts[1].length > 2) return;
        setAmount(cleaned);
    }, []);

    const adjustAmount = useCallback((delta: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const current = parseFloat(amount) || 0;
        const next = Math.max(0, current + delta);
        setAmount(next.toFixed(2));
    }, [amount]);

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount.');
            return;
        }

        const catName = CATEGORIES.find(c => c.id === category)?.name || 'Other';

        const payload = {
            amount: numAmount,
            type: transactionType,
            category: catName,
            date: date.toISOString(),
            note: note.trim(),
            receipt: receiptImage || undefined,
        };

        addTransaction(payload, {
            onSuccess: () => {
                useNotificationStore.getState().addNotification({
                    type: 'success',
                    category: 'Transaction',
                    title: `${transactionType === 'income' ? 'Income' : 'Expense'} Logged`,
                    message: `Successfully added ${catName} ${transactionType === 'income' ? 'credit' : 'debit'} of ${currencySymbol}${numAmount.toFixed(2)}.`,
                    meta: transactionType === 'income' ? `+${currencySymbol}${numAmount}` : `-${currencySymbol}${numAmount}`
                });

                if (transactionType === 'expense' && numAmount > monthlyLimit * 0.4) {
                    useNotificationStore.getState().addNotification({
                        type: 'priority',
                        category: 'Security',
                        title: 'High Spend Alert',
                        message: `This transaction represents ${((numAmount / monthlyLimit) * 100).toFixed(0)}% of your monthly $${monthlyLimit} limit.`,
                    });
                }

                clearReceiptImage();
                close();
                navigation.popToTop();
            },
            onError: (error) => {
                console.error('Transaction add failed', error);
                Alert.alert('Error', 'Failed to save transaction');
            }
        });
    };

    const handleCancel = () => {
        Alert.alert(
            'Discard Receipt?',
            'This will remove the receipt and return to the home screen.',
            [
                { text: 'Keep', onPress: () => { } },
                {
                    text: 'Discard',
                    onPress: () => {
                        clearReceiptImage();
                        close();
                        navigation.goBack();
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const dynamicStyles = useMemo(() => ({
        container: {
            flex: 1,
            backgroundColor: theme.colors.surface,
        } as any,
        header: {
            flexDirection: 'row' as const,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outlineVariant,
        } as any,
        title: {
            fontSize: 16,
            fontFamily: theme.typography.fontFamily.displayBold,
            color: theme.colors.onSurface,
        } as any,
        imageContainer: {
            height: 280,
            backgroundColor: theme.colors.surfaceContainerLow,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            overflow: 'hidden' as const,
        } as any,
        receiptImage: {
            width: '100%',
            height: '100%',
        } as any,
        scrollContent: {
            padding: 24,
        } as any,
        sectionLabel: {
            fontSize: 12,
            fontFamily: theme.typography.fontFamily.headlineBold,
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center' as const,
            letterSpacing: 1,
            marginBottom: 8,
            textTransform: 'uppercase' as const,
        } as any,
        amountContainer: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            marginVertical: 20,
        } as any,
        currency: {
            fontSize: 42,
            fontFamily: theme.typography.fontFamily.displayBold,
            color: theme.colors.onSurfaceDim,
            marginRight: 8,
        } as any,
        amountInput: {
            fontSize: 56,
            fontFamily: theme.typography.fontFamily.displayBold,
            color: theme.colors.onSurface,
            minWidth: 140,
            textAlign: 'center' as const,
            paddingVertical: 6,
        } as any,
        stepper: {
            marginLeft: 20,
            gap: 8,
        } as any,
        tabContainer: {
            flexDirection: 'row' as const,
            backgroundColor: theme.colors.surfaceContainerLow,
            borderRadius: 14,
            padding: 4,
            marginBottom: 24,
        } as any,
        tab: {
            flex: 1,
            height: 42,
            borderRadius: 10,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        } as any,
        activeTab: {
            backgroundColor: theme.colors.surfaceContainerLowest,
            ...theme.effects.shadows.ambient,
        } as any,
        tabText: {
            fontSize: 13,
            fontFamily: theme.typography.fontFamily.headlineBold,
            color: theme.colors.onSurfaceVariant,
        } as any,
        activeTabText: {
            color: theme.colors.primary,
        } as any,
        catGrid: {
            flexDirection: 'row' as const,
            flexWrap: 'wrap' as const,
            justifyContent: 'space-between' as const,
            marginBottom: 24,
        } as any,
        catItem: {
            width: '23%',
            alignItems: 'center' as const,
            marginBottom: 12,
        } as any,
        catIconBox: {
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: theme.colors.surfaceContainerLow,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            marginBottom: 6,
            borderWidth: 2,
            borderColor: 'transparent',
        } as any,
        activeCatIcon: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primaryContainer + '20',
        } as any,
        catName: {
            fontSize: 8,
            fontFamily: theme.typography.fontFamily.headlineBold,
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center' as const,
        } as any,
        activeCatName: {
            color: theme.colors.primary,
        } as any,
        datePicker: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            backgroundColor: theme.colors.surfaceContainerLow,
            padding: 12,
            borderRadius: 12,
            gap: 12,
            marginBottom: 16,
        } as any,
        dateText: {
            fontSize: 14,
            fontFamily: theme.typography.fontFamily.headlineSemi,
            color: theme.colors.onSurface,
        } as any,
        noteInput: {
            backgroundColor: theme.colors.surfaceContainerLow,
            padding: 12,
            borderRadius: 12,
            fontSize: 13,
            fontFamily: theme.typography.fontFamily.bodyRegular,
            color: theme.colors.onSurface,
            height: 80,
            textAlignVertical: 'top' as const,
            marginBottom: 24,
        } as any,
        buttonRow: {
            flexDirection: 'row' as const,
            gap: 12,
            marginBottom: 16,
        } as any,
        button: {
            flex: 1,
            height: 56,
            borderRadius: 16,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        } as any,
        primaryButton: {
            backgroundColor: theme.colors.primary,
        } as any,
        secondaryButton: {
            backgroundColor: theme.colors.surfaceContainerHigh,
        } as any,
        buttonText: {
            fontSize: 14,
            fontFamily: theme.typography.fontFamily.headlineBold,
            color: '#FFFFFF',
            textTransform: 'uppercase' as const,
        } as any,
        secondaryButtonText: {
            color: theme.colors.onSurface,
        } as any,
    }), [theme, isDark]);

    return (
        <SafeAreaView style={dynamicStyles.container}>
            {/* Header */}
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.title}>Review Receipt</Text>
                <Pressable onPress={handleCancel}>
                    <X size={24} color={theme.colors.onSurface} />
                </Pressable>
            </View>

            {/* Receipt Image */}
            {receiptImage && (
                <View style={dynamicStyles.imageContainer}>
                    <Image source={{ uri: receiptImage }} style={dynamicStyles.receiptImage} resizeMode="cover" />
                </View>
            )}

            {/* Form */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[dynamicStyles.scrollContent, { paddingBottom: 120 }]}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                >
                    {/* Amount Section */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={dynamicStyles.sectionLabel}>ENTER AMOUNT</Text>
                        <View style={[
                            dynamicStyles.amountContainer,
                            amountFocused && { borderBottomWidth: 2, borderColor: theme.colors.primary, paddingBottom: 8 }
                        ]}>
                            <Text style={dynamicStyles.currency}>{currencySymbol}</Text>
                            <TextInput
                                style={dynamicStyles.amountInput}
                                value={amount}
                                onChangeText={handleAmountChange}
                                keyboardType="decimal-pad"
                                placeholder="0.00"
                                placeholderTextColor={theme.colors.onSurfaceDim}
                                onFocus={() => setAmountFocused(true)}
                                onBlur={() => setAmountFocused(false)}
                            />
                            <View style={dynamicStyles.stepper}>
                                <TouchableOpacity onPress={() => adjustAmount(10)}>
                                    <ChevronUp size={20} color={theme.colors.onSurfaceDim} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => adjustAmount(-10)}>
                                    <ChevronDown size={20} color={theme.colors.onSurfaceDim} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Type Selector */}
                    <View style={dynamicStyles.tabContainer}>
                        <Pressable
                            onPress={() => setTransactionType('expense')}
                            style={[dynamicStyles.tab, transactionType === 'expense' && dynamicStyles.activeTab]}
                        >
                            <Text style={[dynamicStyles.tabText, transactionType === 'expense' && dynamicStyles.activeTabText]}>Expense</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setTransactionType('income')}
                            style={[dynamicStyles.tab, transactionType === 'income' && dynamicStyles.activeTab]}
                        >
                            <Text style={[dynamicStyles.tabText, transactionType === 'income' && dynamicStyles.activeTabText]}>Income</Text>
                        </Pressable>
                    </View>

                    {/* Category Selection */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left' }]}>SELECT CATEGORY</Text>
                        <View style={dynamicStyles.catGrid}>
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
                                        <cat.icon
                                            size={20}
                                            color={category === cat.id ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                        />
                                    </View>
                                    <Text style={[dynamicStyles.catName, category === cat.id && dynamicStyles.activeCatName]}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Date Picker */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left', marginBottom: 12 }]}>DATE</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}
                            style={[
                                dynamicStyles.datePicker,
                                showDatePicker && { borderWidth: 1.5, borderColor: theme.colors.primary }
                            ]}
                        >
                            <CalendarIcon size={18} color={theme.colors.primary} />
                            <View>
                                <Text style={{ fontSize: 11, color: theme.colors.onSurfaceVariant }}>Selected Date</Text>
                                <Text style={dynamicStyles.dateText}>
                                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <View style={{
                                backgroundColor: theme.colors.surfaceContainerLow,
                                marginTop: 8,
                                borderRadius: 16,
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
                                        <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily.headlineBold }}>
                                            Done
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Notes */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={[dynamicStyles.sectionLabel, { textAlign: 'left', marginBottom: 12 }]}>NOTES</Text>
                        <TextInput
                            style={[
                                dynamicStyles.noteInput,
                                noteFocused && { borderWidth: 1.5, borderColor: theme.colors.primary }
                            ]}
                            placeholder="What was this for?"
                            placeholderTextColor={theme.colors.onSurfaceDim}
                            value={note}
                            onChangeText={setNote}
                            multiline
                            onFocus={() => setNoteFocused(true)}
                            onBlur={() => setNoteFocused(false)}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Buttons */}
                    <View style={dynamicStyles.buttonRow}>
                        <TouchableOpacity
                            style={[dynamicStyles.button, dynamicStyles.secondaryButton]}
                            onPress={handleCancel}
                        >
                            <Text style={[dynamicStyles.buttonText, dynamicStyles.secondaryButtonText]}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[dynamicStyles.button, dynamicStyles.primaryButton]}
                            onPress={handleSave}
                            disabled={isAdding}
                        >
                            <Text style={dynamicStyles.buttonText}>{isAdding ? 'SAVING...' : 'SAVE'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ReceiptPreviewScreen;
