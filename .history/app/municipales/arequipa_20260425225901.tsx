import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  nombre: 'Arequipa',
  region: 'Sierra Sur',
  url: 'https://www.muniarequipa.gob.pe/oficina-virtual/c0nInfrPermisos/faltas/papeletas.php',
};

const INJECTED_CSS = `
(function() {
  const style = document.createElement('style');
  style.textContent = \`
    /* Reset & base */
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #F4F6F8 !important;
      color: #1a1a2e !important;
      margin: 0;
      padding: 0;
    }

    /* Ocultar navbar, footer, menu lateral de links y elementos decorativos innecesarios */
    nav, .navbar, footer, .footer,
    header:not(.features-title),
    .menu-css, #menu, .menu-top,
    .links-panel, .col-lg-3, .col-md-3, .col-sm-3 {
      display: none !important;
    }

    /* Contenedor principal */
    .container-fluid {
      padding: 16px !important;
      max-width: 100% !important;
    }

    /* Título principal */
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

    /* Fila de contenido - usar todo el ancho */
    .row { margin: 0 !important; }
    .col-lg-9, .col-md-9, .col-sm-9 {
      width: 100% !important;
      padding: 0 !important;
    }

    /* Formulario */
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

    /* Label */
    .search-label {
      display: block !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #546E7A !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin-bottom: 8px !important;
    }

    /* Input de placa */
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
      transition: border-color 0.2s !important;
      text-transform: uppercase !important;
      outline: none !important;
      box-shadow: none !important;
    }
    #placa:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }

    /* Botón consultar */
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
      transition: background 0.2s !important;
    }
    #btnConsultar:active {
      background: #37474F !important;
    }

    /* Panel de resultados */
    .main-panel {
      display: block !important;
      margin-top: 8px !important;
    }

    /* Tabla de resultados */
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      background: #ffffff !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      font-size: 13px !important;
    }
    thead tr {
      background: #455A64 !important;
    }
    thead th {
      color: #ffffff !important;
      padding: 12px 10px !important;
      text-align: left !important;
      font-weight: 600 !important;
      font-size: 11px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
    }
    tbody tr {
      border-bottom: 1px solid #ECEFF1 !important;
    }
    tbody tr:last-child { border-bottom: none !important; }
    tbody tr:hover { background: #F4F6F8 !important; }
    tbody td {
      padding: 12px 10px !important;
      color: #37474F !important;
    }

    /* Alertas / mensajes */
    .alert, .alert-warning, .alert-info, .alert-danger, .alert-success {
      border-radius: 10px !important;
      padding: 14px 16px !important;
      font-size: 14px !important;
      margin-top: 10px !important;
      border: none !important;
    }

    /* Texto "Procesando" */
    #resultado {
      font-size: 14px !important;
      color: #546E7A !important;
    }

    /* Ocultar elementos legacy innecesarios */
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header limpio sin barra de URL */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

    

        <TouchableOpacity
          onPress={() => webViewRef.current?.reload()}
          style={styles.iconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: CIUDAD.url }}
        injectedJavaScript={INJECTED_CSS}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#455A64" />
            <Text style={styles.loadingText}>Cargando papeletas...</Text>
          </View>
        )}
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
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRegion: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    marginTop: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
  },
  loadingText: {
    marginTop: 10,
    color: '#455A64',
    fontSize: 14,
  },
});