import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Images, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Platform, Pressable, SafeAreaView, Text, View } from 'react-native';
import { PortalStackParamList } from '../../../navigation/types';
import { useReceiptCaptureStore } from '../../../store/receiptCaptureStore';
import { useAppTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<PortalStackParamList, 'ReceiptCapture'>;

export const ReceiptCaptureScreen: React.FC<Props> = ({ navigation }) => {
    const { theme, isDark } = useAppTheme();
    const { close, setReceiptImage, transactionType } = useReceiptCaptureStore();
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // Request camera permission
    const handleRequestCameraPermission = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (granted) {
                setIsCameraActive(true);
                setIsCameraReady(false);
            } else {
                Alert.alert(
                    'Camera Permission',
                    'We need camera access to capture receipts. Please enable it in settings.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            setIsCameraActive(true);
            setIsCameraReady(false);
        }
    };

    const handleTakePhoto = async () => {
        if (!cameraRef.current || !isCameraReady) {
            Alert.alert('Camera not ready', 'Please wait a moment for the camera to initialize.');
            return;
        }

        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
            if (photo?.uri) {
                setReceiptImage(photo.uri);
                navigation.replace('ReceiptPreview');
            } else {
                Alert.alert('Error', 'Failed to capture photo');
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to capture photo');
        }
    };

    const handlePickFromGallery = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!granted) {
                    Alert.alert(
                        'Gallery Permission',
                        'We need photo access to pick receipts from your gallery.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]?.uri) {
                setReceiptImage(result.assets[0].uri);
                navigation.replace('ReceiptPreview');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image from gallery');
        }
    };

    const handleClose = () => {
        close();
        navigation.goBack();
    };

    const dynamicStyles = {
        container: {
            flex: 1,
            backgroundColor: theme.colors.surface,
        } as any,
        cameraContainer: {
            flex: 1,
            backgroundColor: '#000',
        } as any,
        controlsContainer: {
            position: 'absolute' as const,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.surface,
            padding: 24,
            paddingBottom: Platform.OS === 'ios' ? 40 : 24,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
        } as any,
        content: {
            flex: 1,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            paddingHorizontal: 24,
            paddingVertical: 40,
        } as any,
        header: {
            flexDirection: 'row' as const,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            marginBottom: 32,
            paddingHorizontal: 24,
            paddingTop: 16,
        } as any,
        title: {
            fontSize: 18,
            fontFamily: theme.typography.fontFamily.displayBold,
            color: theme.colors.onSurface,
        } as any,
        subtitle: {
            fontSize: 14,
            fontFamily: theme.typography.fontFamily.bodyRegular,
            color: theme.colors.onSurfaceVariant,
            marginTop: 8,
            textAlign: 'center' as const,
        } as any,
        buttonRow: {
            flexDirection: 'row' as const,
            gap: 16,
            width: '100%',
        } as any,
        button: {
            flex: 1,
            height: 56,
            borderRadius: 16,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
            gap: 12,
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
        closeButton: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: theme.colors.surfaceContainerHigh,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        } as any,
        captureButton: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            marginTop: 24,
        } as any,
    };

    if (isCameraActive) {
        return (
            <View style={dynamicStyles.cameraContainer}>
                <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" onCameraReady={() => setIsCameraReady(true)} />
                <SafeAreaView style={dynamicStyles.controlsContainer}>
                    <Pressable
                        style={[dynamicStyles.button, dynamicStyles.primaryButton, { width: '100%', opacity: isCameraReady ? 1 : 0.6 }]}
                        onPress={handleTakePhoto}
                        disabled={!isCameraReady}
                    >
                        <Camera size={20} color="#FFFFFF" />
                        <Text style={dynamicStyles.buttonText}>CAPTURE RECEIPT</Text>
                    </Pressable>
                    <Pressable
                        style={[dynamicStyles.button, dynamicStyles.secondaryButton, { width: '100%', marginTop: 12 }]}
                        onPress={() => setIsCameraActive(false)}
                    >
                        <X size={20} color={theme.colors.onSurface} />
                        <Text style={[dynamicStyles.buttonText, dynamicStyles.secondaryButtonText]}>CLOSE CAMERA</Text>
                    </Pressable>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={dynamicStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={dynamicStyles.header}>
                    <View>
                        <Text style={dynamicStyles.title}>Capture Receipt</Text>
                        <Text style={dynamicStyles.subtitle}>
                            {transactionType === 'expense' ? 'Log your expense' : 'Log your income'}
                        </Text>
                    </View>
                    <Pressable onPress={handleClose} style={dynamicStyles.closeButton}>
                        <X size={20} color={theme.colors.onSurface} />
                    </Pressable>
                </View>

                <View style={dynamicStyles.content}>
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 24,
                            backgroundColor: theme.colors.primaryContainer,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <Camera size={48} color={theme.colors.primary} />
                    </View>
                    <Text style={[dynamicStyles.title, { marginBottom: 8 }]}>Choose Source</Text>
                    <Text
                        style={[
                            dynamicStyles.subtitle,
                            { marginBottom: 32, maxWidth: '90%' },
                        ]}
                    >
                        Take a photo with your camera or pick from your gallery
                    </Text>

                    <View style={dynamicStyles.buttonRow}>
                        <Pressable
                            style={[dynamicStyles.button, dynamicStyles.primaryButton]}
                            onPress={handleRequestCameraPermission}
                        >
                            <Camera size={18} color="#FFFFFF" />
                            <Text style={dynamicStyles.buttonText}>Camera</Text>
                        </Pressable>
                        <Pressable
                            style={[dynamicStyles.button, dynamicStyles.secondaryButton]}
                            onPress={handlePickFromGallery}
                        >
                            <Images size={18} color={theme.colors.onSurface} />
                            <Text style={[dynamicStyles.buttonText, dynamicStyles.secondaryButtonText]}>Gallery</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ReceiptCaptureScreen;
