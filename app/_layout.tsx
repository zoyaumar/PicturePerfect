import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AuthProvider from '@/providers/AuthProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

/**
 * Root layout component that wraps the entire application
 * Handles theme management, font loading, and authentication context
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render the app until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Authentication screens (login, signup, etc.) */}
          <Stack.Screen 
            name="(auth)" 
            options={{ headerShown: false }} 
          />
          
          {/* Main app screens with bottom tab navigation */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          
          {/* Screens without bottom tab bar */}
          <Stack.Screen 
            name="(nobottombar)/edit-profile" 
            options={{ title: "Edit Profile" }} 
          />
          <Stack.Screen 
            name="(nobottombar)/post/[postId]" 
            options={{ title: "Post" }} 
          />
          
          {/* 404 Not Found screen */}
          <Stack.Screen name="+not-found" />
        </Stack>

        {/* Status bar configuration */}
        <StatusBar style="auto" />
      </ThemeProvider>      
    </AuthProvider>
  );
}
