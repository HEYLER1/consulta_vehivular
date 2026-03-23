import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  nombre: 'Trujillo',
  region: 'Costa Norte',
  url: 'https://www.munitrujillo.gob.pe/',
};

export default function TrujilloScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(CIUDAD.url);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerName}>{CIUDAD.nombre}</Text>
          <Text style={styles.headerRegion}>{CIUDAD.region}</Text>
        </View>
        <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.reloadButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.urlBar}>
        <Ionicons name="lock-closed" size={12} color="#4CAF50" style={{ marginRight: 5 }} />
        <Text style={styles.urlText} numberOfLines={1}>{currentUrl}</Text>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: CIUDAD.url }}
        onNavigationStateChange={(navState) => setCurrentUrl(navState.url)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#455A64" />
            <Text style={styles.loadingText}>Cargando municipalidad...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#455A64' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#455A64',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  backButton: { padding: 5 },
  reloadButton: { padding: 5 },
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#455A64', fontSize: 14 },
});