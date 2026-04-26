import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  url: 'https://www.muniarequipa.gob.pe/oficina-virtual/c0nInfrPermisos/faltas/papeletas.php',
};

const INJECTED_CSS = `
(function() {
  const style = document.createElement('style');
  style.textContent = \`
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #F4F6F8 !important;
      color: #1a1a2e !important;
      margin: 0;
      padding: 0;
    }
    nav, .navbar, footer, .footer,
    header:not(.features-title),
    .menu-css, #menu, .menu-top,
    .links-panel, .col-lg-3, .col-md-3, .col-sm-3 {
      display: none !important;
    }
    .container-fluid {
      padding: 16px !important;
      max-width: 100% !important;
    }
    .features-title {
      background: linear-gradient(135deg, #455A64, #37474F) !important;
      border-radius: 12px !important;
      padding: 18px 20px !important;
      margin-bottom: 20px !important;
    }
    .features-title p {
      color: rgba(255,255,255,0.75) !important;
      font-size: 11px !important;
      letter-spacing: 1.2px !important;
      margin: 0 0 4px !important;
    }
    .features-title h2 {
      color: #ffffff !important;
      font-size: 17px !important;
      font-weight: 700 !important;
      margin: 0 !important;
      line-height: 1.3 !important;
    }
    .row { margin: 0 !important; }
    .col-lg-9, .col-md-9, .col-sm-9 {
      width: 100% !important;
      padding: 0 !important;
    }
    .frm-search {
      background: #ffffff !important;
      border-radius: 12px !important;
      padding: 20px !important;
      margin-bottom: 16px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
    }
    .search-label {
      display: block !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #546E7A !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin-bottom: 8px !important;
    }
    #placa {
      width: 100% !important;
      height: 48px !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 20px !important;
      font-weight: 700 !important;
      letter-spacing: 4px !important;
      color: #1a1a2e !important;
      background: #F8FAFB !important;
      text-transform: uppercase !important;
      outline: none !important;
      box-shadow: none !important;
    }
    #placa:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }
    #btnConsultar {
      width: 100% !important;
      height: 50px !important;
      background: #455A64 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 10px !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      letter-spacing: 1px !important;
      cursor: pointer !important;
    }
    #btnConsultar:active { background: #37474F !important; }
    .main-panel { display: block !important; margin-top: 8px !important; }
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      background: #ffffff !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      font-size: 13px !important;
    }
    thead tr { background: #455A64 !important; }
    thead th {
      color: #ffffff !important;
      padding: 12px 10px !important;
      text-align: left !important;
      font-weight: 600 !important;
      font-size: 11px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
    }
    tbody tr { border-bottom: 1px solid #ECEFF1 !important; }
    tbody tr:last-child { border-bottom: none !important; }
    tbody tr:hover { background: #F4F6F8 !important; }
    tbody td { padding: 12px 10px !important; color: #37474F !important; }
    .alert, .alert-warning, .alert-info, .alert-danger, .alert-success {
      border-radius: 10px !important;
      padding: 14px 16px !important;
      font-size: 14px !important;
      margin-top: 10px !important;
      border: none !important;
    }
    #resultado { font-size: 14px !important; color: #546E7A !important; }
    .form-group { width: 100% !important; margin: 0 !important; }
    .input-group { width: 100% !important; display: block !important; }
    .g-recaptcha { display: none !important; }
    br { display: none !important; }
  \`;
  document.head.appendChild(style);
})();
true;
`;

export default function ArequipaScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: CIUDAD.url }}
        injectedJavaScript={INJECTED_CSS}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => setReady(true)}
      />

      {!ready && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#455A64" />
          <Text style={styles.loadingText}>Cargando papeletas...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F4F6F8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: '#455A64',
    fontSize: 14,
  },
});