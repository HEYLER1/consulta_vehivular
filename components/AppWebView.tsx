import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

interface AppWebViewProps extends Partial<WebViewProps> {
  url: string;
  injectedCSS?: string;
  injectedJS?: string;
  title?: string;
  subtitle?: string;
  loadingColor?: string;
  backgroundColor?: string;
  showPostOverlay?: boolean;
}

export function AppWebView({
  url,
  injectedCSS,
  injectedJS,
  title,
  subtitle,
  loadingColor = '#455A64',
  backgroundColor = '#F4F6F8',
  showPostOverlay = false,
  ...rest
}: AppWebViewProps) {
  const insets = useSafeAreaInsets();
  const [ready, setReady] = useState(false);
  const [postOverlay, setPostOverlay] = useState(false);
  const hasLoadedOnce = useRef(false);
  const webViewRef = useRef<WebView>(null);

  const finalInjectedJS = `
    (function() {
      ${injectedCSS ? `
        const style = document.createElement('style');
        style.textContent = \`${injectedCSS}\`;
        document.head.appendChild(style);
      ` : ''}
      ${injectedJS || ''}
    })();
    true;
  `;

  const handleLoadEnd = () => {
    setReady(true);
    if (showPostOverlay) {
      if (!hasLoadedOnce.current) {
        hasLoadedOnce.current = true;
      } else {
        setTimeout(() => setPostOverlay(false), 900);
      }
    }
  };

  const handleNavigationStateChange = (nav: any) => {
    if (showPostOverlay && hasLoadedOnce.current && nav.loading) {
      setPostOverlay(true);
    }
    rest.onNavigationStateChange?.(nav);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={finalInjectedJS}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={handleNavigationStateChange}
        style={[styles.webView, { backgroundColor }]}
        {...rest}
      />

      {!ready && (
        <View style={[styles.overlay, { backgroundColor }]}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={loadingColor} />
            {title && <ThemedText style={styles.loadingTitle}>{title}</ThemedText>}
            {subtitle && <ThemedText style={styles.loadingSubtitle}>{subtitle}</ThemedText>}
          </View>
        </View>
      )}

      {postOverlay && (
        <View style={[styles.overlay, { backgroundColor, zIndex: 30 }]}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={loadingColor} />
            <ThemedText style={styles.loadingTitle}>Buscando...</ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  loadingSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
});
