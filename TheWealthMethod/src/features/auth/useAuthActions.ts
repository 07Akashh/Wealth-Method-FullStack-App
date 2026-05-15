import { useState } from "react";
import { toast } from "@backpackapp-io/react-native-toast";

import { authService, LoginInput, SignupInput } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

export const useAuthActions = () => {
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

  /**
   * Main login flow with backend verification
   */
  const login = async (input: LoginInput) => {
    setLoading(true);
    try {
      const result = await authService.login(input);
      loginStore(result);
      return result;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP code for identity/phone verification
   */
  const verifyOtp = async (identifier: string, otp: string) => {
    setLoading(true);
    try {
      const result = await authService.verifyOtp(identifier, otp);
      loginStore(result);
      return result;
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup flow - now only collects profile info, password sent via email
   */
  const signup = async (input: SignupInput) => {
    setLoading(true);
    try {
      const result = await authService.signup(input);
      toast.success("Account created! Check your email for login credentials.");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Password change flow (for temp pass or regular updates)
   */
  const changePassword = async (oldPass: string, newPass: string) => {
    setLoading(true);
    try {
      await authService.changePassword(oldPass, newPass);
      toast.success("Password updated successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("Reset link sent to your email.");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Request failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password flow using OTP
   */
  const resetPassword = async (otp: string, newPass: string) => {
    setLoading(true);
    try {
      await authService.resetPassword(otp, newPass);
      toast.success("Password reset successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout flow
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Failed to logout from backend", error);
    } finally {
      logoutStore();
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    verifyOtp,
    signup,
    changePassword,
    forgotPassword,
    resetPassword,
    logout,
  };
};
