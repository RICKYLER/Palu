import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UseMockWalletReturn {
  walletAddress: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isWalletSecure: boolean;
  walletBalance: string;
  lastSyncTime: Date | null;
}

export const useMockWallet = (): UseMockWalletReturn => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isWalletSecure, setIsWalletSecure] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      // Use SecureStore for sensitive wallet data
      const savedAddress = await SecureStore.getItemAsync("walletAddress");
      const savedBalance = await SecureStore.getItemAsync("walletBalance");
      const savedSyncTime = await AsyncStorage.getItem("lastSyncTime");

      if (savedAddress) {
        setWalletAddress(savedAddress);
        setIsWalletSecure(true);
      }
      if (savedBalance) {
        setWalletBalance(savedBalance);
      }
      if (savedSyncTime) {
        setLastSyncTime(new Date(savedSyncTime));
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
    }
  };

  const generateSecureAddress = async (): Promise<string> => {
    // Generate a cryptographically secure wallet address
    const randomBytes = await Crypto.getRandomBytesAsync(20);
    const address =
      "0x" +
      Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return address;
  };

  const connect = async (): Promise<void> => {
    try {
      setIsConnecting(true);

      // Simulate secure wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a secure wallet address
      const secureAddress = await generateSecureAddress();

      // Simulate fetching balance
      const mockBalance = (Math.random() * 10 + 1).toFixed(4);

      setWalletAddress(secureAddress);
      setWalletBalance(mockBalance);
      setIsWalletSecure(true);
      setLastSyncTime(new Date());

      // Store wallet data securely using SecureStore for sensitive data
      await SecureStore.setItemAsync("walletAddress", secureAddress);
      await SecureStore.setItemAsync("walletBalance", mockBalance);
      await AsyncStorage.setItem("lastSyncTime", new Date().toISOString());

      Alert.alert(
        "Wallet Connected Securely",
        `Address: ${secureAddress.slice(0, 6)}...${secureAddress.slice(-4)}\nBalance: ${mockBalance} ETH`,
        [
          {
            text: "OK",
            style: "default",
          },
        ],
      );
    } catch (error) {
      console.error("Error connecting wallet:", error);
      Alert.alert(
        "Connection Failed",
        "Failed to connect wallet securely. Please check your connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => connect(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (): Promise<void> => {
    try {
      setWalletAddress(null);
      setWalletBalance("0.00");
      setIsWalletSecure(false);
      setLastSyncTime(null);

      // Clear stored wallet data from both SecureStore and AsyncStorage
      await SecureStore.deleteItemAsync("walletAddress");
      await SecureStore.deleteItemAsync("walletBalance");
      await AsyncStorage.removeItem("lastSyncTime");

      Alert.alert(
        "Wallet Disconnected",
        "Your wallet has been safely disconnected and all local data cleared.",
      );
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      Alert.alert("Error", "Failed to disconnect wallet properly.");
    }
  };

  return {
    walletAddress,
    isConnecting,
    connect,
    disconnect,
    isWalletSecure,
    walletBalance,
    lastSyncTime,
  };
};
