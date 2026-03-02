// app/sunarp-webview.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  BackHandler,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const ROJO = '#C62828';

const INJECT_BEFORE = `
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'plugins', {
    get: () => [
      { name: 'Chrome PDF Plugin' },
      { name: 'Chrome PDF Viewer' },
      { name: 'Native Client' },
    ],
  });
  Object.defineProperty(navigator, 'languages', {
    get: () => ['es-PE', 'es', 'en-US', 'en'],
  });
  window.chrome = { runtime: {} };
  true;
`;

const INJECT_CSS = `
(function() {

  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

  const style = document.createElement('style');
  style.innerHTML = \`

    header, footer, nav,
    .navbar, .footer, .header,
    #header, #footer, #navbar,
    [class*="navbar"], [class*="footer"], [class*="header"],
    .page-header, .brand, .logo,
    .alert, .alert-warning, .alert-info,
    [class*="alert"], .aviso, .informacion,
    .breadcrumb, [class*="breadcrumb"] {
      display: none !important;
    }

    html, body {
      background: #F3F4F6 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      overflow-x: hidden !important;
      font-family: -apple-system, 'Segoe UI', Roboto, sans-serif !important;
    }

    .container, .container-fluid,
    main, [class*="content"],
    .panel, .card, .panel-body, .card-body {
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: transparent !important;
    }

    input[type="text"],
    input[type="search"],
    .form-control {
      width: 100% !important;
      padding: 14px 16px !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      letter-spacing: 3px !important;
      text-transform: uppercase !important;
      border: 2px solid #E0E0E0 !important;
      border-radius: 12px !important;
      background: #fff !important;
      box-sizing: border-box !important;
      -webkit-appearance: none !important;
    }

    input[type="text"]:focus,
    .form-control:focus {
      border-color: #C62828 !important;
      box-shadow: 0 0 0 3px rgba(198,40,40,0.12) !important;
      outline: none !important;
    }

    button, input[type="submit"],
    .btn, .btn-default, .btn-primary,
    [class*="btn"] {
      width: 100% !important;
      padding: 14px !important;
      background: #C62828 !important;
      color: #fff !important;
      border: none !important;
      border-radius: 12px !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      margin-top: 8px !important;
      box-sizing: border-box !important;
      -webkit-appearance: none !important;
    }

    /* ── CORRECCION IMAGENES DE RESULTADOS ── */
    img {
      max-width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      display: block !important;
    }

    [class*="foto"], [class*="imagen"], [class*="photo"],
    [class*="result"] img, [class*="vehiculo"] img,
    table img, .table img, td img {
      max-width: 100% !important;
      width: auto !important;
      height: auto !important;
      max-height: 420px !important;
      object-fit: contain !important;
      border-radius: 8px !important;
      margin: 0 auto !important;
    }

    table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      word-wrap: break-word !important;
    }

    td, th {
      padding: 1px 2px !important;
      font-size: 13px !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }

    [class*="foto"], [class*="photo"], [class*="imagen"] {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      overflow: hidden !important;
      padding: 1px !important;
    }

  \`;
  document.head.appendChild(style);

})();
true;
`;

export default function SunarpWebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const backPressCount = useRef(0);
  const backPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = () => {
    setBlocked(false);
    setLoading(true);
    webViewRef.current?.reload();
  };

  // Boton fisico atras en Android:
  // 1 presion  → goBack (quedarse en la pagina de resultados / historial)
  // 2 presiones rapidas → ir a pagina principal
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (!canGoBack) return false;

      backPressCount.current += 1;
      if (backPressTimer.current) clearTimeout(backPressTimer.current);

      if (backPressCount.current === 1) {
        // Primera presion: retroceder una pagina
        webViewRef.current?.goBack();
        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 500);
        return true;
      } else {
        // Segunda presion rapida: ir a pagina principal
        backPressCount.current = 0;
        webViewRef.current?.injectJavaScript(
          "window.location.href = 'https://consultavehicular.sunarp.gob.pe'; true;"
        );
        return true;
      }
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  const onNavigationStateChange = useCallback((state: any) => {
    setCanGoBack(state.canGoBack);
    if (
      state.title?.toLowerCase().includes('just a moment') ||
      state.title?.toLowerCase().includes('checking your browser')
    ) {
      setBlocked(true);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* Barra superior */}
      <View style={styles.topBar}>
        {canGoBack && (
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.topTitle} numberOfLines={1}>
          Consulta Vehicular SUNARP
        </Text>
        <TouchableOpacity onPress={reload} style={styles.reloadBtn}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Cloudflare bloqueado */}
      {blocked && (
        <View style={styles.overlay}>
          <Ionicons name="shield-outline" size={52} color={ROJO} />
          <Text style={styles.blockedTitle}>Verificación de seguridad</Text>
          <Text style={styles.blockedSub}>
            Cloudflare está verificando.{'\n'}Espera y recarga.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={reload}>
            <Ionicons name="refresh" size={16} color="#fff" />
            <Text style={styles.retryText}>  Recargar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* WebView sin padding */}
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://consultavehicular.sunarp.gob.pe' }}
        style={styles.webview}
        userAgent="Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        injectedJavaScriptBeforeContentLoaded={INJECT_BEFORE}
        injectedJavaScript={INJECT_CSS}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        onLoadStart={() => { setLoading(true); setBlocked(false); }}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        onHttpError={(e) => {
          if (e.nativeEvent.statusCode === 403 || e.nativeEvent.statusCode === 503) {
            setLoading(false);
            setBlocked(true);
          }
        }}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROJO,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ROJO,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backBtn: {
    padding: 4,
    marginRight: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  topTitle: {
    flex: 1,
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  reloadBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  webview: {
    flex: 1,
    margin: 0,
    padding: 0,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    top: 52,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: 10,
  },
  blockedTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a1a', marginTop: 4 },
  blockedSub: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: ROJO,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});