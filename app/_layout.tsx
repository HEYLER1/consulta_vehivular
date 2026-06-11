import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="sunarp-webview" options={{ title: 'SUNARP', headerShown: true }} />
        <Stack.Screen name="vehiculo/duenos" options={{ title: 'Historial de Dueños', headerShown: true }} />
        <Stack.Screen name="municipales/[ciudad]" options={{ title: 'Multas Municipales', headerShown: true }} />
        <Stack.Screen name="papeletas" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
