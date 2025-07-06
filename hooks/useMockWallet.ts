import { useState } from "react";
import { Alert } from "react-native";

interface UseMockWalletReturn {
  walletAddress: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useMockWallet = (): UseMockWalletReturn => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connect = async (): Promise<void> => {
    try {
      setIsConnecting(true);

      // Simulate wallet connection for React Native
      // In a real app, you would integrate with WalletConnect or similar
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a mock wallet address for demonstration
      const mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e";

      setWalletAddress(mockAddress);
      Alert.alert(
        "Success",
        `Wallet connected: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      );
    } catch (error) {
      console.error("Error connecting wallet:", error);
      Alert.alert("Error", "Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = (): void => {
    setWalletAddress(null);
    Alert.alert("Success", "Wallet disconnected");
  };

  return {
    walletAddress,
    isConnecting,
    connect,
    disconnect,
  };
};
