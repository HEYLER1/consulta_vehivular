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
  if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); }
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

  const style = document.createElement('style');
  style.innerHTML = \`

    *, *::before, *::after {
      box-sizing: border-box !important;
    }

    html {
      width: 100vw !important;
      overflow-x: hidden !important;
    }

    body {
      background: #F0F2F5 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100vw !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      font-family: -apple-system, 'Segoe UI', Roboto, sans-serif !important;
    }

    /* ── Ocultar chrome del sitio ── */
    header, footer, nav,
    .navbar, .footer, .header,
    #header, #footer, #navbar,
    [class*="navbar"], [class*="footer"], [class*="header"],
    .page-header, .brand, .logo,
    .alert, .alert-warning, .alert-info,
    [class*="alert"], .aviso, .informacion,
    .breadcrumb, [class*="breadcrumb"],
    .top-bar, .site-logo, [class*="logo"],
    [class*="banner"], [class*="branding"] {
      display: none !important;
    }

    /* ── Reset de todos los contenedores ── */
    div, section, article, main, aside,
    .container, .container-fluid, .container-sm,
    .container-md, .container-lg, .container-xl,
    .wrapper, .wrap, .page-wrapper, .page-wrap,
    .content, .content-wrapper, .main-content,
    .inner, .inner-wrapper, .site-content,
    .row, .col, [class*="col-"],
    .panel, .panel-body, .panel-default,
    .card, .card-body, .card-wrapper,
    .box, .box-body, .form-wrapper,
    [class*="content"], [class*="wrapper"],
    [class*="inner"], [class*="panel"],
    [class*="card"], [class*="section"] {
      width: 100% !important;
      max-width: 100vw !important;
      min-width: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      float: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      border-left: none !important;
      border-right: none !important;
      background: transparent !important;
    }

    /* ══════════════════════════════════════
       FORMULARIO — tarjeta blanca elevada
    ══════════════════════════════════════ */
    form {
      background: #fff !important;
      margin: 1px 1px 1px 1px !important;
      width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;
      border-radius: 20px !important;
      padding: 10px 8px 12px 8px !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.09) !important;
    }

    /* Labels */
    form label,
    .form-group label,
    .control-label {
      font-size: 12px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
      color: #616161 !important;
      margin-bottom: 6px !important;
      display: block !important;
    }

    /* Grupo de campo */
    .form-group, form > div {
      margin-bottom: 14px !important;
      padding: 0 !important;
    }

    /* ── Input de placa ── */
    input[type="text"],
    input[type="search"],
    .form-control {
      width: 100% !important;
      max-width: 100% !important;
      padding: 16px 18px !important;
      font-size: 22px !important;
      font-weight: 800 !important;
      letter-spacing: 6px !important;
      text-transform: uppercase !important;
      text-align: center !important;
      border: 2px solid #EEEEEE !important;
      border-radius: 14px !important;
      background: #FAFAFA !important;
      color: #212121 !important;
      -webkit-appearance: none !important;
    }

    input[type="text"]::placeholder,
    .form-control::placeholder {
      color: #BDBDBD !important;
      letter-spacing: 4px !important;
      font-weight: 600 !important;
      font-size: 18px !important;
    }

    input[type="text"]:focus,
    .form-control:focus {
      border-color: #C62828 !important;
      background: #fff !important;
      box-shadow: 0 0 0 4px rgba(198,40,40,0.10) !important;
      outline: none !important;
    }

    /* ── Recaptcha centrado ── */
    .g-recaptcha, [class*="captcha"], [class*="recaptcha"] {
      transform: scale(0.88) !important;
      transform-origin: center top !important;
      display: flex !important;
      justify-content: center !important;
      margin: 4px auto 0 auto !important;
    }

    /* ══════════════════════════════════════
       TODOS LOS BOTONES — reales del sitio,
       sin reemplazar, solo restyling
    ══════════════════════════════════════ */
    button,
    input[type="submit"],
    input[type="button"],
    input[type="reset"],
    a.btn,
    .btn,
    [class*="btn"] {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      padding: 17px 20px !important;
      background: linear-gradient(135deg, #E53935 0%, #C62828 100%) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 14px !important;
      font-size: 16px !important;
      font-weight: 900 !important;
      letter-spacing: 0.4px !important;
      text-align: center !important;
      text-decoration: none !important;
      margin-top: 10px !important;
      cursor: pointer !important;
      box-shadow: 0 6px 20px rgba(198,40,40,0.35) !important;
      -webkit-appearance: none !important;
      /* Mantener el elemento original intacto, solo cambiar apariencia */
      pointer-events: auto !important;
      position: relative !important;
      z-index: 1 !important;
    }

    button:active,
    input[type="submit"]:active,
    input[type="button"]:active,
    a.btn:active,
    .btn:active {
      transform: scale(0.97) !important;
      box-shadow: 0 3px 10px rgba(198,40,40,0.30) !important;
    }

    /* ══════════════════════════════════════
       RESULTADOS — imagen y tabla
    ══════════════════════════════════════ */
    img {
      max-width: 100vw !important;
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
      display: block !important;
    }

    [class*="foto"] img,
    [class*="imagen"] img,
    [class*="photo"] img,
    [class*="vehiculo"] img,
    [class*="result"] img,
    table img, td img, th img {
      max-width: 100% !important;
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      border-radius: 12px !important;
    }

    [class*="foto"], [class*="photo"], [class*="imagen"] {
      width: 100% !important;
      max-width: 100% !important;
      padding: 8px !important;
      margin: 0 !important;
      overflow: hidden !important;
    }

    table {
      width: 100% !important;
      max-width: 100vw !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      word-wrap: break-word !important;
      background: #fff !important;
      margin: 12px 0 !important;
    }

    td, th {
      padding: 11px 12px !important;
      font-size: 13px !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      border-bottom: 1px solid #F5F5F5 !important;
    }

    tr:last-child td { border-bottom: none !important; }
    tr:nth-child(even) td { background: #FAFAFA !important; }

    th, td:first-child {
      font-weight: 700 !important;
      color: #424242 !important;
      background: #FFF8F8 !important;
    }

    th {
      background: #C62828 !important;
      color: #fff !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }

  \`;
  document.head.appendChild(style);

  /* ── Eliminar width inline que encoge los elementos ── */
  function stripInlineWidths() {
    document.querySelectorAll('*').forEach(function(el) {
      if (el.style) {
        el.style.removeProperty('width');
        el.style.removeProperty('max-width');
        el.style.removeProperty('min-width');
      }
    });
  }

  function init() {
    stripInlineWidths();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Observar cambios dinámicos
  const obs = new MutationObserver(function() {
    stripInlineWidths();
  });
  obs.observe(document.body, { childList: true, subtree: true });

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

      {/* Barra superior */}
     
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