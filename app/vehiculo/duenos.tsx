import { AppWebView } from '@/components/AppWebView';
import { SUNARP_CONOCE_CSS, PULL_TO_REFRESH_JS } from '@/constants/sites';
import { useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

export default function HistorialDuenosScreen() {
  const { plate } = useLocalSearchParams<{ plate?: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Historial de Dueños',
          headerStyle: { backgroundColor: '#D32F2F' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800' },
        }} 
      />
      <StatusBar barStyle="light-content" />
      
      <View style={styles.webViewContainer}>
        <AppWebView
          url="https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio"
          injectedCSS={SUNARP_CONOCE_CSS}
          injectedJS={PULL_TO_REFRESH_JS}
          title="SUNARP Conoce Aquí"
          subtitle="Accediendo al historial oficial..."
          loadingColor="#D32F2F"
          backgroundColor="#ffffff"
          plate={plate}
          userAgent="Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});
