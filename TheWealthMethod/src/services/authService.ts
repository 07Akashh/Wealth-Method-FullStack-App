import * as Device from "expo-device";
import { Platform } from "react-native";
import apiClient from "../lib/apiClient";

const getDeviceName = () => {
   let name = Platform.OS === 'ios' ? 'iPhone/iPad' : Platform.OS === 'android' ? 'Android Device' : 'Unknown Device';
   
   if (Platform.OS === 'ios' && (Platform.constants as any).interfaceIdiom) {
      name = (Platform.constants as any).interfaceIdiom === 'pad' ? 'iPad' : 'iPhone';
   } else if (Platform.OS === 'android' && (Platform.constants as any).Model) {
      name = (Platform.constants as any).Model;
   } else if (Platform.OS === 'web') {
      name = 'Web Browser';
   }
   return name;
};

export type LoginInput = {
  email?: string;
  pass?: string;
  phone?: string;
};

export type SignupInput = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  preferredCurrency?: string;
};

export type AuthResponse = {
  accessToken: string;
  profile: {
    Id: string;
    firstname?: string;
    lastname?: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    img?: string;
    preferredCurrency?: string;
    privacyMode?: boolean;
    biometricEnabled?: boolean;
    requiresPasswordChange?: boolean;
  };
  isTempPass?: boolean;
};

export const authService = {
  /**
   * Login with email/pass or phone
   */
  login: async (data: LoginInput): Promise<AuthResponse> => {
    let publicIp;
    try {
       const ipRes = await fetch("https://api.ipify.org?format=json");
       const ipData = await ipRes.json();
       publicIp = ipData.ip;
    } catch (e) {
       console.warn("Could not fetch public IP", e);
    }

    const payload = {
       ...data,
       deviceName: Device.deviceName || Device.modelName || getDeviceName(),
       deviceInfo: {
          os: Platform.OS,
          osVersion: Platform.Version,
          ...(publicIp ? { ip: publicIp } : {})
       }
    };
    const response = await apiClient.post("/user/login", payload);
    return response as any;
  },

  /**
   * Signup for a new account (Backend sends temp pass via email)
   */
  signup: async (data: SignupInput) => {
    const response = await apiClient.post("/user/signup", data);
    return response;
  },

  /**
   * Verify OTP code for phone/identity verification
   */
  verifyOtp: async (phoneOrEmail: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/user/verify-otp", { 
      identifier: phoneOrEmail, 
      otp 
    });
    return response as any;
  },

  /**
   * Request OTP/Reset link
   */
  sendOtp: async (phoneOrEmail: string) => {
    const response = await apiClient.post("/user/forgot-password", { 
      email: phoneOrEmail 
    });
    return response;
  },

  /**
   * Change password (from temp to permanent or routine update)
   */
  changePassword: async (oldPass: string, newPass: string) => {
    const response = await apiClient.post("/user/change-password", {
      oldPass,
      newPass
    });
    return response;
  },

  /**
   * Forgot password request
   */
  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/user/forgot-password", { email });
    return response;
  },

  /**
   * Reset password using OTP
   */
  resetPassword: async (otp: string, newPassword: string) => {
    const response = await apiClient.post("/user/reset-password", {
      one_time_pass: otp,
      new_pass: newPassword
    });
    return response;
  },

  /**
   * Device Management: Get active sessions
   */
  getDevices: async () => {
    const response = await apiClient.get("/user/sessions");
    return response as any;
  },
  /**
   * Logout the current session
   */
  logout: async () => {
    const response = await apiClient.post("/user/logout");
    return response as any;
  },

  /**
   * Device Management: Remove a session
   */
  logoutDevice: async (deviceId: string) => {
    const response = await apiClient.delete(`/user/sessions/${deviceId}`);
    return response as any;
  },

  /**
   * Device Management: Revoke all other sessions
   */
  revokeOtherDevices: async () => {
    const response = await apiClient.delete("/user/sessions/others");
    return response as any;
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response as any;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<any>) => {
    const response = await apiClient.put("/user/profile", data);
    return response as any;
  }
};
