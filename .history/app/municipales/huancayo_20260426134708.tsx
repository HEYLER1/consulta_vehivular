import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  url: 'http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx',
};

const INJECTED_CSS = `
(function() {
  const style = document.createElement('style');
  style.textContent = \`

    /* ─── BASE ─── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #F4F6F8 !important;
      color: #1a1a2e !important;
    }

    /* ─── OCULTAR NAV ─── */
    nav, .nav, .nav-links, .main-nav {
      display: none !important;
    }

    /* ─── CONTENEDOR ─── */
    .container {
      padding: 16px !important;
      max-width: 100% !important;
    }

    /* ─── TÍTULO ─── */
    .portada {
      background: linear-gradient(135deg, #455A64, #37474F) !important;
      border-radius: 12px !important;
      padding: 18px 20px !important;
      margin-bottom: 20px !important;
    }
    .portada-titulo {
      color: #ffffff !important;
      font-size: 17px !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
    }

    /* ─── TABS ─── */
    .tabs-pits {
      list-style: none !important;
      display: flex !important;
      gap: 10px !important;
      margin-bottom: 16px !important;
    }
    .tabs-items {
      flex: 1 !important;
      background: #ffffff !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 12px !important;
      text-align: center !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
    }
    .tabs-items.activeTabItem {
      background: #455A64 !important;
      border-color: #455A64 !important;
    }
    .titleTab {
      font-size: 14px !important;
      font-weight: 600 !important;
      color: #546E7A !important;
    }
    .activeTabItem .titleTab {
      color: #ffffff !important;
    }
    .newTab { display: none !important; }

    /* ─── CONTENIDO TABS ─── */
    .tab-contents { list-style: none !important; }
    .tab-itemContent { display: none !important; }
    .tab-itemContent.activeTabContent { display: block !important; }

    /* ─── CARD FORMULARIO ─── */
    .itemContent-wrapper {
      background: #ffffff !important;
      border-radius: 12px !important;
      padding: 20px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
    }

    /* ─── GRUPO DE CAMPOS ─── */
    .group-form {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
    }

    /* ─── ETIQUETAS ─── */
    .subtitulo {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #546E7A !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
    }

    /* ─── INPUTS ─── */
    input.label,
    input[type="text"] {
      width: 100% !important;
      height: 48px !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      letter-spacing: 3px !important;
      color: #1a1a2e !important;
      background: #F8FAFB !important;
      text-transform: uppercase !important;
      outline: none !important;
      box-shadow: none !important;
    }
    input.label:focus,
    input[type="text"]:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }

    /* ─── SELECT ─── */
    select.select {
      width: 100% !important;
      height: 48px !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 15px !important;
      color: #1a1a2e !important;
      background: #F8FAFB !important;
      outline: none !important;
    }
    select.select:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }

    /* ─── BOTÓN BUSCAR ─── */
    input.button-pits,
    input[type="submit"] {
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
    input.button-pits:active,
    input[type="submit"]:active {
      background: #37474F !important;
    }

    /* ─── TABLA DE RESULTADOS ─── */
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      background: #ffffff !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      font-size: 13px !important;
      margin-top: 16px !important;
    }
    thead tr { background: #455A64 !important; }
    thead th {
      color: #ffffff !important;
      padding: 12px 10px !important;
      font-weight: 600 !important;
      font-size: 11px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
      text-align: left !important;
    }
    tbody tr { border-bottom: 1px solid #ECEFF1 !important; }
    tbody tr:last-child { border-bottom: none !important; }
    tbody tr:hover { background: #F4F6F8 !important; }
    tbody td {
      padding: 12px 10px !important;
      color: #37474F !important;
    }

    /* ─── LIMPIEZA ─── */
    br, .clear { display: none !important; }

  \`;
  document.head.appendChild(style);
})();
true;
`;

export default function HuancayoScreen() {
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
          <Text style={styles.loadingText}>Cargando municipalidad...</Text>
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