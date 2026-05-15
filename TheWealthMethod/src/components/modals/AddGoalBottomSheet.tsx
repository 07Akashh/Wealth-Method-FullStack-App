import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { toast } from '@backpackapp-io/react-native-toast';
import * as Haptics from 'expo-haptics';
import { 
  X, 
  Target,
  Trophy,
  Activity,
  Zap,
  Shield,
  Plane,
  Home,
  Car,
  TrendingUp,
} from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useBottomSheetStore } from '../../store/bottomSheetStore';
import { useUpsertGoal } from '../../lib/TanstackQuery/QueryHooks';
import { useNotificationStore } from '../../store/notificationStore';
import { useUserStore } from '../../store/userStore';

const GOAL_TYPES = [
  { id: 'emergency', label: 'Safety', icon: Shield },
  { id: 'retirement', label: 'Retire', icon: TrendingUp },
  { id: 'travel', label: 'Trip', icon: Plane },
  { id: 'home', label: 'Estate', icon: Home },
  { id: 'car', label: 'Drive', icon: Car },
  { id: 'other', label: 'Other', icon: Target },
];

export const AddGoalBottomSheet = () => {
  const { theme, isDark } = useAppTheme();
  const { isOpened, close, editData, type: sheetType } = useBottomSheetStore();
  const { currencySymbol } = useUserStore();
  const { mutate: upsertGoal, isPending } = useUpsertGoal();

  const isEditing = !!editData && sheetType === 'add-goal';
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Form State
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('emergency');

  const snapPoints = useMemo(() => ['75%'], []);

  useEffect(() => {
    if (isOpened && sheetType === 'add-goal') {
      if (editData) {
        setTargetAmount(editData.targetAmount.toString());
        setCurrentAmount(editData.currentAmount.toString());
        setTitle(editData.title || '');
      } else {
        setTargetAmount('');
        setCurrentAmount('');
        setTitle('');
      }
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpened, editData, sheetType]);

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
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (isNaN(target) || target <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid target amount.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Name', 'Please provide a name for this goal.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upsertGoal(
      {
        title: title.trim(),
        targetAmount: target,
        currentAmount: current,
        id: editData?.id,
      },
      {
        onSuccess: () => {
          
          // Add Notification
          useNotificationStore.getState().addNotification({
            type: 'success',
            category: 'Goals',
            title: isEditing ? 'Goal Modified' : 'New Goal Set',
            message: `${isEditing ? 'Updated' : 'Created'} target for "${title.trim()}" with a goal of ${currencySymbol}${target.toLocaleString()}.`,
            meta: `${currencySymbol}${target.toLocaleString()}`
          });

          toast.success(isEditing ? 'Goal Updated!' : 'Goal Created!');
          handleClose();
        },
      }
    );
  };

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
    sectionLabel: {
      fontSize: 12,
      fontFamily: theme.typography.fontFamily.headlineBold,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center' as const,
      letterSpacing: 1,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
      marginTop: 24,
    },
    inputContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginVertical: 10,
    },
    currency: {
      fontSize: 32,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurfaceDim,
      marginRight: 8,
    },
    amountInput: {
      fontSize: 42,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: theme.colors.onSurface,
      minWidth: 150,
      textAlign: 'center' as const,
    },
    textInput: {
        fontSize: 24,
        fontFamily: theme.typography.fontFamily.headlineBold,
        color: theme.colors.onSurface,
        textAlign: 'center' as const,
        backgroundColor: theme.colors.surfaceContainerLow,
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      marginHorizontal: 24,
      height: 64,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginTop: 40,
      marginBottom: 40,
      ...theme.effects.shadows.ambient,
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: theme.typography.fontFamily.displayBold,
      color: '#FFFFFF',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
  }), [theme]);

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
    >
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={handleClose}>
          <X size={24} color={theme.colors.onSurface} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={dynamicStyles.title}>{isEditing ? 'Edit' : 'Create'} Goal</Text>
        <View style={{ width: 24 }} />
      </View>
      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={dynamicStyles.sectionLabel}>GOAL TYPE</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
             {GOAL_TYPES.map((gt) => (
                <TouchableOpacity 
                    key={gt.id} 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setType(gt.id);
                    }}
                    style={{ 
                        paddingHorizontal: 16, 
                        paddingVertical: 10, 
                        borderRadius: 16, 
                        backgroundColor: type === gt.id ? theme.colors.primary : theme.colors.surfaceContainerLow,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    <gt.icon size={16} color={type === gt.id ? '#FFF' : theme.colors.onSurfaceVariant} />
                    <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.headlineBold, color: type === gt.id ? '#FFF' : theme.colors.onSurfaceVariant }}>{gt.label}</Text>
                </TouchableOpacity>
             ))}
          </View>

          <Text style={dynamicStyles.sectionLabel}>GOAL NAME</Text>
          <BottomSheetTextInput
            style={dynamicStyles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. House Deposit"
            placeholderTextColor={theme.colors.onSurfaceDim}
            autoFocus={!isEditing}
          />

          <Text style={dynamicStyles.sectionLabel}>TARGET WEALTH AMOUNT</Text>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.currency}>{currencySymbol}</Text>
            <BottomSheetTextInput
              style={dynamicStyles.amountInput}
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="decimal-pad"
              placeholder="50,000"
              placeholderTextColor={theme.colors.onSurfaceDim}
            />
          </View>

          <Text style={dynamicStyles.sectionLabel}>CURRENTLY ALLOCATED</Text>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.currency}>{currencySymbol}</Text>
            <BottomSheetTextInput
              style={dynamicStyles.amountInput}
              value={currentAmount}
              onChangeText={setCurrentAmount}
              keyboardType="decimal-pad"
              placeholder="10,000"
              placeholderTextColor={theme.colors.onSurfaceDim}
            />
          </View>

          <View style={{ marginTop: 40, alignItems: 'center', gap: 16 }}>
             <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primaryContainer + '30', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={32} color={theme.colors.primary} />
             </View>
             <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, fontSize: 13, fontFamily: theme.typography.fontFamily.bodyRegular, paddingHorizontal: 20 }}>
                Set a goal that pushes you towards financial independence. You can update this anytime.
             </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={dynamicStyles.saveButton}
          onPress={handleSave}
          disabled={isPending}
        >
          <Text style={dynamicStyles.saveButtonText}>{isEditing ? 'UPDATE GOAL' : 'CREATE GOAL'}</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
