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
import { useLocalSearchParams } from 'expo-router';

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
  const meta = document.querySelector('meta[name="viewport"]') || document.createElement('meta');
  meta.name = 'viewport';
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  document.head.appendChild(meta);

  const style = document.createElement('style');
  style.innerHTML = \`
    /* ── Reset General ── */
    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-tap-highlight-color: transparent !important;
    }

    html {
      height: 100% !important;
      width: 100% !important;
      overflow-x: hidden !important;
    }

    body {
      width: 100% !important;
      min-height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #F8FAFC !important;
      font-family: -apple-system, system-ui, sans-serif !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-start !important;
      overflow-x: hidden !important;
      padding-top: 0 !important; /* Forzar 0 arriba */
    }

    /* ── Limpieza Total de Estorbos ── */
    header, footer, nav, aside, .navbar, .footer, .header, #header, #footer,
    .breadcrumb, .top-bar, .logo, .brand, .btn-regresar, .sidebar,
    .menu-secundario, .site-logo, [class*="navbar"], [class*="footer"],
    img[src*="logo"], [id*="logo"], [class*="logo"],
    .linea-arcoiris, [class*="arcoiris"], [class*="rainbow"],
    [style*="background-image"], [class*="banner"],
    form img, .panel-heading img, .card-header img,
    center, hr, br, .spacer, .separator, .border-top, .rainbow-bar {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* ── Forzar centrado en todos los niveles intermedios ── */
    #divPrincipal, .container, .wrapper, .main-content, 
    .container-fluid, #content, #main, .page-wrapper {
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      margin-top: 0 !important; /* Forzar 0 arriba */
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-start !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }

    /* ══════════════════════════════════════
       EL FORMULARIO ── El corazón de la vista
    ══════════════════════════════════════ */
    form, .panel-primary, .panel, .card {
      background: #ffffff !important;
      margin: 0 auto !important; /* Eliminado el margen superior de 15px */
      margin-top: 10px !important; /* Un mínimo de 10px solo para que no choque con el borde negro */
      width: calc(100% - 32px) !important;
      max-width: 400px !important;
      border-radius: 28px !important;
      padding: 30px 24px !important;
      border: 1px solid #E2E8F0 !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.04) !important;
      display: block !important;
      position: relative !important;
    }

    /* Quitar bordes de colores raros (Arcoiris) */
    .panel-primary, .panel, .card, form {
      border-top: 1px solid #E2E8F0 !important;
    }
    
    [style*="border-top"], [style*="border-bottom"] {
      border-top: none !important;
      border-bottom: none !important;
    }

    .panel-heading, .card-header, legend {
      background: transparent !important;
      color: #1E293B !important;
      font-weight: 800 !important;
      font-size: 19px !important;
      text-align: center !important;
      padding: 0 0 20px 0 !important;
      border-bottom: 1px solid #F1F5F9 !important;
      margin-bottom: 25px !important;
      width: 100% !important;
      display: block !important;
    }

    label, .control-label {
      color: #64748B !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.2px !important;
      margin-bottom: 10px !important;
      display: block !important;
      text-align: left !important;
    }

    input[type="text"], .form-control {
      height: 64px !important;
      background: #F1F5F9 !important;
      border: 2px solid transparent !important;
      border-radius: 18px !important;
      padding: 0 20px !important;
      font-size: 26px !important;
      font-weight: 800 !important;
      color: #0F172A !important;
      text-align: center !important;
      letter-spacing: 5px !important;
      width: 100% !important;
      transition: all 0.2s ease !important;
      margin-bottom: 15px !important;
      outline: none !important;
    }

    input[type="text"]:focus {
      background: #fff !important;
      border-color: #C62828 !important;
      box-shadow: 0 0 0 4px rgba(198, 40, 40, 0.1) !important;
    }

    button, .btn, input[type="submit"], input[type="button"] {
      height: 60px !important;
      background: #C62828 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 18px !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      width: 100% !important;
      margin-top: 15px !important;
      box-shadow: 0 4px 12px rgba(198, 40, 40, 0.2) !important;
      cursor: pointer !important;
    }

    .g-recaptcha, [id*="captcha"] {
      display: flex !important;
      justify-content: center !important;
      margin: 15px 0 !important;
      transform: scale(0.9) !important;
    }

    .table-responsive, .table-container {
      width: 100% !important;
      padding: 10px 16px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    table {
      width: 100% !important;
      max-width: 450px !important;
      border-radius: 20px !important;
      overflow: hidden !important;
      border: 1px solid #E2E8F0 !important;
      background: #fff !important;
      margin-bottom: 20px !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
    }

    td {
      padding: 16px !important;
      color: #334155 !important;
      font-size: 14px !important;
      border-bottom: 1px solid #F1F5F9 !important;
    }

    tr td:first-child {
      font-weight: 700 !important;
      color: #1E293B !important;
      width: 45% !important;
      background: #F8FAFC !important;
    }

    img {
      max-width: 100% !important;
      height: auto !important;
      border-radius: 16px !important;
      margin: 15px 0 !important;
      display: block !important;
    }

    br, hr { display: none !important; }
  \`;
  document.head.appendChild(style);

  const fixLayout = () => {
    document.querySelectorAll('*').forEach(el => {
      if (el.style && (el.style.width || el.style.maxWidth)) {
        const w = el.style.width;
        if (w && w.includes('px') && parseInt(w) > 300) {
           el.style.setProperty('width', '100%', 'important');
           el.style.setProperty('max-width', '100%', 'important');
        }
      }
    });
  };

  fixLayout();
  const observer = new MutationObserver(fixLayout);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

export default function SunarpWebViewScreen() {
  const { plate } = useLocalSearchParams<{ plate: string }>();
  const webViewRef = useRef<WebView>(null);
  const [blocked, setBlocked] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const INJECT_PLATE = plate ? `
    (function() {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        input.value = "${plate}";
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })();
    true;
  ` : 'true;';
  const backPressCount = useRef(0);
  const backPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = () => {
    setBlocked(false);
    webViewRef.current?.reload();
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (!canGoBack) return false;

      backPressCount.current += 1;
      if (backPressTimer.current) clearTimeout(backPressTimer.current);

      if (backPressCount.current === 1) {
        webViewRef.current?.goBack();
        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 500);
        return true;
      } else {
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

      <WebView
        ref={webViewRef}
        source={{ uri: 'https://consultavehicular.sunarp.gob.pe' }}
        style={styles.webview}
        userAgent="Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        injectedJavaScriptBeforeContentLoaded={INJECT_BEFORE}
        injectedJavaScript={INJECT_CSS + INJECT_PLATE}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        onLoadStart={() => { setBlocked(false); }}
        onLoadEnd={() => {}}
        onError={() => {}}
        onHttpError={(e) => {
          if (e.nativeEvent.statusCode === 403 || e.nativeEvent.statusCode === 503) {
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
  webview: {
    flex: 1,
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
