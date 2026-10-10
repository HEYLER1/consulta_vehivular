import { usePlate } from '@/components/PlateContext';
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { AppWebView } from '@/components/AppWebView';
import { APP_SITES } from '@/constants/sites';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

export default function UnifiedViewerScreen() {
  const { category, slug, plate } = useLocalSearchParams<{ 
    category: string; 
    slug: string; 
    plate?: string 
  }>();

  const { plate: savedPlate } = usePlate();
  const selectedPlate = (typeof plate === 'string' ? plate : savedPlate).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const config = category && slug ? APP_SITES[category]?.[slug] : null;

  if (!config) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#C62828" />
        <ThemedText type="title">Configuración no encontrada</ThemedText>
        <ThemedText>No se pudo cargar la consulta: {category}/{slug}</ThemedText>
      </ThemedView>
    );
  }

  // Preparamos la URL si viene con placa (algunos portales permiten inyección por query params)
  // Aunque la mayoría requiere interacción manual o inyección JS post-carga.
  const finalUrl = selectedPlate ? config.url.replace('{plate}', encodeURIComponent(selectedPlate)) : config.url;

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor || '#F4F6F8' }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: config.title,
          headerStyle: { backgroundColor: config.color || '#1A237E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800', fontSize: 16 },
        }}
      />
      <StatusBar barStyle="light-content" />
      
      <View style={styles.webViewContainer}>
        <AppWebView
          url={finalUrl}
          plate={selectedPlate}
          injectedCSS={config.injectedCSS}
          injectedJS={config.injectedJS}
          userAgent={config.userAgent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
});
