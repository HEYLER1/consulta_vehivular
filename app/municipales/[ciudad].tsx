import { AppWebView } from '@/components/AppWebView';
import { MUNICIPALES_CONFIG } from '@/constants/sites';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

export default function CiudadScreen() {
  const { ciudad } = useLocalSearchParams<{ ciudad: string }>();
  const router = useRouter();
  const config = MUNICIPALES_CONFIG[ciudad as string];

  if (!config) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Error', headerShown: true }} />
        <Text>Ciudad no encontrada: {ciudad}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: config.title,
          headerStyle: { backgroundColor: '#1A237E' },
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
          title={`Cargando ${config.title}...`}
          subtitle="Conectando con el servidor municipal"
          loadingColor="#455A64"
          backgroundColor="#F4F6F8"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A237E',
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
    backgroundColor: '#F4F6F8',
  },
  backLink: {
    marginTop: 15,
    color: '#1A237E',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
