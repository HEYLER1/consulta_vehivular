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
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #F4F6F8 !important;
      color: #1a1a2e !important;
      height: 100% !important;
    }

    /* ─── OCULTAR INNECESARIO ─── */
    nav, .nav, .nav-links, .main-nav,
    .tabs-pits, br, .clear {
      display: none !important;
    }

    /* ─── CONTENEDOR PRINCIPAL ─── */
    .container {
      padding: 20px 16px !important;
      max-width: 100% !important;
      width: 100% !important;
    }

    /* ─── TÍTULO ─── */
    .portada {
      background: #455A64 !important;
      border-radius: 14px !important;
      padding: 16px 18px !important;
      margin-bottom: 14px !important;
      width: 100% !important;
    }
    .portada-titulo {
      color: #ffffff !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      line-height: 1.4 !important;
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: unset !important;
    }

    /* ─── TABS: solo mostrar placa ─── */
    .tab-contents { list-style: none !important; }
    .tab-itemContent { display: none !important; }
    .tab-itemContent.activeTabContent { display: block !important; }

    /* ─── CARD FORMULARIO ─── */
    .itemContent-wrapper {
      background: #ffffff !important;
      border-radius: 14px !important;
      padding: 20px !important;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
      width: 100% !important;
    }

    /* ─── GRUPO DE CAMPOS ─── */
    .group-form {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      width: 100% !important;
    }

    /* ─── ETIQUETA ─── */
    .subtitulo {
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #546E7A !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
    }

    /* ─── INPUT PLACA ─── */
    input.label,
    input[type="text"] {
      display: block !important;
      width: 100% !important;
      height: 54px !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 24px !important;
      font-weight: 800 !important;
      letter-spacing: 6px !important;
      color: #1a1a2e !important;
      background: #F8FAFB !important;
      text-transform: uppercase !important;
      text-align: center !important;
      outline: none !important;
      box-shadow: none !important;
    }
    input.label:focus,
    input[type="text"]:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }

    /* ─── BOTÓN BUSCAR ─── */
    input.button-pits,
    input[type="submit"] {
      display: block !important;
      width: 100% !important;
      height: 52px !important;
      background: #455A64 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 10px !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      letter-spacing: 1.5px !important;
      text-transform: uppercase !important;
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
      font-size: 12px !important;
      margin-top: 14px !important;
    }
    thead tr { background: #455A64 !important; }
    thead th {
      color: #ffffff !important;
      padding: 10px 8px !important;
      font-weight: 600 !important;
      font-size: 10px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      text-align: left !important;
    }
    tbody tr { border-bottom: 1px solid #ECEFF1 !important; }
    tbody tr:last-child { border-bottom: none !important; }
    tbody tr:hover { background: #F4F6F8 !important; }
    tbody td {
      padding: 10px 8px !important;
      color: #37474F !important;
      font-size: 12px !important;
    }

  \`;
  document.head.appendChild(style);

  /* Ocultar tab PIT por JS */
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-itemContent').forEach(function(tab, i) {
      if (i !== 0) tab.style.display = 'none';
    });
  });

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