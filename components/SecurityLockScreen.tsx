import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shield, Fingerprint, Lock, Eye } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

interface SecurityLockScreenProps {
  onAuthenticate?: () => void;
  isBiometricSupported?: boolean;
}

const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({
  onAuthenticate = () => {},
  isBiometricSupported = true,
}) => {
  const { isDark } = useTheme();
  const { width, height } = Dimensions.get("window");

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}
      style={{ width, height }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#111827" : "#ffffff"}
      />

      <View className="flex-1 justify-center items-center px-8">
        {/* Security Icon */}
        <View
          className={`w-32 h-32 rounded-full items-center justify-center mb-8 shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}
          style={{
            shadowColor: isDark ? "#000" : "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 16,
          }}
        >
          <Shield size={64} color={isDark ? "#60A5FA" : "#3B82F6"} />
        </View>

        {/* App Title */}
        <Text
          className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
        >
          PaluChain Go
        </Text>

        <Text
          className={`text-lg mb-12 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          Secure access to your paluwagan
        </Text>

        {/* Security Message */}
        <View
          className={`rounded-2xl p-6 mb-8 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
        >
          <View className="flex-row items-center mb-3">
            <Lock size={20} color={isDark ? "#60A5FA" : "#3B82F6"} />
            <Text
              className={`ml-2 font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Enhanced Security
            </Text>
          </View>
          <Text
            className={`text-sm leading-5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Your financial data is protected with biometric authentication and
            end-to-end encryption. Authenticate to continue.
          </Text>
        </View>

        {/* Authentication Button */}
        <TouchableOpacity
          onPress={onAuthenticate}
          className={`w-full rounded-2xl p-4 mb-4 shadow-lg ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
          style={{
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            {isBiometricSupported ? (
              <Fingerprint size={24} color="#ffffff" />
            ) : (
              <Lock size={24} color="#ffffff" />
            )}
            <Text className="ml-3 text-white font-semibold text-lg">
              {isBiometricSupported
                ? "Unlock with Biometrics"
                : "Unlock with Passcode"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Alternative Authentication */}
        {isBiometricSupported && (
          <TouchableOpacity
            onPress={onAuthenticate}
            className={`w-full rounded-2xl p-3 mb-4 border-2 ${isDark ? "border-gray-600" : "border-gray-300"}`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Lock size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                className={`ml-2 font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                Use Device Passcode
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Security Features */}
        <View className="mt-8">
          <Text
            className={`text-center text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Protected by:
          </Text>
          <View className="flex-row justify-center space-x-6">
            <View className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <Fingerprint size={20} color={isDark ? "#60A5FA" : "#3B82F6"} />
              </View>
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Biometric
              </Text>
            </View>
            <View className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <Shield size={20} color={isDark ? "#60A5FA" : "#3B82F6"} />
              </View>
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Encryption
              </Text>
            </View>
            <View className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <Lock size={20} color={isDark ? "#60A5FA" : "#3B82F6"} />
              </View>
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Auto-Lock
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-8">
        <Text
          className={`text-center text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Secured by blockchain technology • Your data never leaves your device
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SecurityLockScreen;
