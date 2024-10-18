import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebaseConfig';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        router.replace('/(tabs)');
      } else {
        setUser(null)
        router.replace('../login');
      }
      return subscriber
    })
  }, [])


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
