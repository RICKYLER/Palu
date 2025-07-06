import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { BlurView } from "expo-blur";
import {
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

interface SettingsModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isVisible = true,
  onClose = () => {},
}) => {
  const { theme, isDark, setTheme } = useTheme();

  if (!isVisible) return null;

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case "light":
        return <Sun size={20} color={isDark ? "#ffffff" : "#000000"} />;
      case "dark":
        return <Moon size={20} color={isDark ? "#ffffff" : "#000000"} />;
      case "system":
        return <Monitor size={20} color={isDark ? "#ffffff" : "#000000"} />;
      default:
        return <Monitor size={20} color={isDark ? "#ffffff" : "#000000"} />;
    }
  };

  const themeOptions = [
    { key: "light", label: "Light", icon: "sun" },
    { key: "dark", label: "Dark", icon: "moon" },
    { key: "system", label: "System", icon: "monitor" },
  ];

  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
      <BlurView intensity={10} className="absolute inset-0" />
      <View
        className={`w-[90%] max-h-[80%] rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <View
          className={`p-4 border-b flex-row justify-between items-center ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
        >
          <TouchableOpacity onPress={onClose} className="p-2">
            <ArrowLeft size={24} color={isDark ? "#ffffff" : "#000000"} />
          </TouchableOpacity>
          <Text
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Settings
          </Text>
          <View className="w-8" />
        </View>

        <ScrollView className={isDark ? "bg-gray-800" : "bg-white"}>
          <View className="p-4">
            <Text
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Appearance
            </Text>

            <View
              className={`rounded-xl p-4 mb-6 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <Text
                className={`font-medium mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Theme
              </Text>

              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setTheme(option.key as any)}
                  className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
                    theme === option.key
                      ? isDark
                        ? "bg-blue-600"
                        : "bg-blue-100"
                      : isDark
                        ? "bg-gray-600"
                        : "bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    {getThemeIcon(option.key)}
                    <Text
                      className={`ml-3 font-medium ${
                        theme === option.key
                          ? isDark
                            ? "text-white"
                            : "text-blue-700"
                          : isDark
                            ? "text-gray-200"
                            : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {theme === option.key && (
                    <View
                      className={`w-2 h-2 rounded-full ${
                        isDark ? "bg-white" : "bg-blue-500"
                      }`}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Notifications
            </Text>

            <View
              className={`rounded-xl p-4 mb-6 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Bell size={20} color={isDark ? "#ffffff" : "#000000"} />
                  <Text
                    className={`ml-3 font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    Push Notifications
                  </Text>
                </View>
                <Switch
                  value={true}
                  trackColor={{
                    false: isDark ? "#374151" : "#f3f4f6",
                    true: "#3b82f6",
                  }}
                  thumbColor={isDark ? "#ffffff" : "#ffffff"}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Shield size={20} color={isDark ? "#ffffff" : "#000000"} />
                  <Text
                    className={`ml-3 font-medium ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    Security Alerts
                  </Text>
                </View>
                <Switch
                  value={true}
                  trackColor={{
                    false: isDark ? "#374151" : "#f3f4f6",
                    true: "#3b82f6",
                  }}
                  thumbColor={isDark ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>

            <Text
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Support
            </Text>

            <TouchableOpacity
              className={`flex-row items-center p-4 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <HelpCircle size={20} color={isDark ? "#ffffff" : "#000000"} />
              <Text
                className={`ml-3 font-medium ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SettingsModal;
