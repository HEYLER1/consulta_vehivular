import { AppWebView } from '@/components/AppWebView';
import { MUNICIPALES_CONFIG } from '@/constants/sites';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CiudadScreen() {
  const { ciudad } = useLocalSearchParams<{ ciudad: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const config = MUNICIPALES_CONFIG[ciudad as string];
  const [currentUrl, setCurrentUrl] = useState(config?.url || '');

  if (!config) {
    return (
      <View style={styles.errorContainer}>
        <Text>Ciudad no encontrada: {ciudad}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {config.hasHeader && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Text style={styles.headerName}>{config.title}</Text>
              <Text style={styles.headerRegion}>{config.region}</Text>
            </View>
            <View style={{ width: 32 }} />
          </View>
          <View style={styles.urlBar}>
            <Ionicons name="lock-closed" size={12} color="#4CAF50" style={{ marginRight: 5 }} />
            <Text style={styles.urlText} numberOfLines={1}>{currentUrl}</Text>
          </View>
        </>
      )}

      <AppWebView
        url={config.url}
        injectedCSS={config.injectedCSS}
        injectedJS={config.injectedJS}
        title={`Cargando ${config.title}...`}
        subtitle="Conectando con la municipalidad"
        loadingColor="#455A64"
        backgroundColor={config.hasHeader ? '#fff' : '#F4F6F8'}
        onNavigationStateChange={(navState) => setCurrentUrl(navState.url)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#455A64',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#455A64',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  backButton: { padding: 5 },
  headerTitle: { flex: 1, alignItems: 'center' },
  headerName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerRegion: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  urlText: { flex: 1, fontSize: 12, color: '#555' },
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
