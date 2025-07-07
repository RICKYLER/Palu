import { useState, useEffect } from "react";
import { Alert, AppState } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UseSecureAuthReturn {
  isAuthenticated: boolean;
  isBiometricSupported: boolean;
  authenticate: () => Promise<boolean>;
  logout: () => void;
  lockApp: () => void;
  isLocked: boolean;
}

export const useSecureAuth = (): UseSecureAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBiometricSupported, setIsBiometricSupported] =
    useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  useEffect(() => {
    checkBiometricSupport();
    checkAuthStatus();

    // Auto-lock when app goes to background
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        lockApp();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    } catch (error) {
      console.error("Error checking biometric support:", error);
      setIsBiometricSupported(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const authStatus = await SecureStore.getItemAsync("authStatus");
      const lastAuthTime = await SecureStore.getItemAsync("lastAuthTime");

      if (authStatus === "authenticated" && lastAuthTime) {
        const timeDiff = Date.now() - parseInt(lastAuthTime);
        // Auto-lock after 5 minutes of inactivity
        if (timeDiff < 5 * 60 * 1000) {
          setIsAuthenticated(true);
          setIsLocked(false);
        } else {
          await SecureStore.deleteItemAsync("authStatus");
          await SecureStore.deleteItemAsync("lastAuthTime");
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      if (!isBiometricSupported) {
        // Fallback to device passcode if biometrics not available
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to access PaluChain Go",
          fallbackLabel: "Use Passcode",
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
        });

        if (result.success) {
          setIsAuthenticated(true);
          setIsLocked(false);
          await SecureStore.setItemAsync("authStatus", "authenticated");
          await SecureStore.setItemAsync("lastAuthTime", Date.now().toString());
          return true;
        }
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access PaluChain Go",
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        setIsLocked(false);
        await SecureStore.setItemAsync("authStatus", "authenticated");
        await SecureStore.setItemAsync("lastAuthTime", Date.now().toString());
        return true;
      } else if (result.error === "UserCancel") {
        // User cancelled, don't show error
        return false;
      } else {
        Alert.alert(
          "Authentication Failed",
          result.error || "Please try again or use your device passcode.",
        );
        return false;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert("Error", "Authentication failed. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setIsLocked(true);
      await SecureStore.deleteItemAsync("authStatus");
      await SecureStore.deleteItemAsync("lastAuthTime");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const lockApp = async () => {
    try {
      setIsAuthenticated(false);
      setIsLocked(true);
      await SecureStore.deleteItemAsync("authStatus");
      await SecureStore.deleteItemAsync("lastAuthTime");
    } catch (error) {
      console.error("Lock app error:", error);
    }
  };

  return {
    isAuthenticated,
    isBiometricSupported,
    authenticate,
    logout,
    lockApp,
    isLocked,
  };
};
