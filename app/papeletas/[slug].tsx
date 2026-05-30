import { AppWebView } from '@/components/AppWebView';
import { PAPELETAS_CONFIG } from '@/constants/sites';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PapeletaDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const config = PAPELETAS_CONFIG[slug as string];
  const [currentUrl, setCurrentUrl] = useState(config?.url || '');

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
          headerBackTitleVisible: false,
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
          onNavigationStateChange={(navState) => setCurrentUrl(navState.url)}
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
