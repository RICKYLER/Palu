import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isDark } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: !route.name.startsWith("tempobook"),
        })}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
