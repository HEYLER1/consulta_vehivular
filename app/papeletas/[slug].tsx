import { AppWebView } from '@/components/AppWebView';
import { PAPELETAS_CONFIG, VEHICULAR_CONFIG } from '@/constants/sites';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

export default function PapeletaDetailScreen() {
  const { slug, plate } = useLocalSearchParams<{ slug: string, plate?: string }>();
  const router = useRouter();
  
  const ALL_CONFIGS = { ...PAPELETAS_CONFIG, ...VEHICULAR_CONFIG };
  const config = ALL_CONFIGS[slug as string];

  if (!config) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Error', headerShown: true }} />
        <Text>Servicio no encontrado: {slug}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor || '#12102A' }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: config.title,
          headerStyle: { backgroundColor: config.backgroundColor || '#12102A' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800' },
        }} 
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.webViewContainer}>
        <AppWebView
          url={config.url}
          injectedCSS={config.injectedCSS}
          injectedJS={config.injectedJS}
          title={config.title}
          subtitle={config.subtitle}
          backgroundColor={config.backgroundColor}
          loadingColor={config.loadingColor}
          showPostOverlay={config.showPostOverlay}
          plate={plate}
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
  },
  backLink: {
    marginTop: 10,
    color: '#007AFF',
  },
});
