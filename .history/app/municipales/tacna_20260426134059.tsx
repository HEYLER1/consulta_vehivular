import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  url: 'https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas',
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

    /* Ocultar todo excepto el formulario */
    header, #header,
    #footer, .footer,
    #botonera,
    .bar-right,
    .col-md-3,
    nav, .navbar,
    .sand, .ls {
      display: none !important;
    }

    /* Contenedor principal */
    .container { padding: 16px !important; max-width: 100% !important; }
    .row { margin: 0 !important; }
    .col-md-9 {
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
      padding: 8px 0 !important;
    }

    /* Título */
    .mpt-title {
      background: linear-gradient(135deg, #455A64, #37474F) !important;
      color: #ffffff !important;
      border-radius: 12px !important;
      padding: 18px 20px !important;
      font-size: 17px !important;
      font-weight: 700 !important;
      margin-bottom: 20px !important;
      border: none !important;
    }

    /* Formulario */
    .form-mpt {
      background: #ffffff !important;
      border-radius: 12px !important;
      padding: 20px !important;
      margin-bottom: 16px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
    }

    /* Labels */
    label {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #546E7A !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin-bottom: 6px !important;
      display: block !important;
    }

    /* Select */
    select.form-control {
      width: 100% !important;
      height: 48px !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 15px !important;
      color: #1a1a2e !important;
      background: #F8FAFB !important;
      outline: none !important;
      box-shadow: none !important;
      margin-bottom: 14px !important;
    }
    select.form-control:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }

    /* Inputs de texto */
    input[type="text"] {
      width: 100% !important;
      height: 48px !important;
      border: 2px solid #CFD8DC !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 15px !important;
      color: #1a1a2e !important;
      background: #F8FAFB !important;
      outline: none !important;
      box-shadow: none !important;
      margin-bottom: 14px !important;
    }
    input[type="text"]:focus {
      border-color: #455A64 !important;
      background: #ffffff !important;
    }

    /* Captcha */
    .img-captcha {
      border-radius: 8px !important;
      margin: 8px 0 !important;
      display: block !important;
    }
    #codigo {
      width: 100% !important;
      display: block !important;
    }

    /* Botón buscar */
    .btn-danger {
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
      margin-top: 6px !important;
    }
    .btn-danger:active { background: #37474F !important; }

    /* Botón recargar captcha */
    .btn-secondary {
      width: 100% !important;
      height: 42px !important;
      background: #ECEFF1 !important;
      color: #455A64 !important;
      border: none !important;
      border-radius: 10px !important;
      font-size: 14px !important;
      margin: 8px 0 !important;
    }

    /* Tabla de resultados */
    .table-responsive { overflow-x: auto !important; }
    table.table {
      width: 100% !important;
      border-collapse: collapse !important;
      background: #ffffff !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      font-size: 13px !important;
    }
    .thead-mpt { background: #455A64 !important; }
    .th-mpt {
      color: #ffffff !important;
      padding: 12px 10px !important;
      font-weight: 600 !important;
      font-size: 11px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
    }
    tbody tr { border-bottom: 1px solid #ECEFF1 !important; }
    tbody tr:last-child { border-bottom: none !important; }
    tbody td { padding: 12px 10px !important; color: #37474F !important; }

    /* Total y leyenda */
    .res-papeleta {
      background: #ffffff !important;
      border-radius: 12px !important;
      padding: 16px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      margin-top: 16px !important;
    }

    /* Mensaje de error */
    .list-message {
      background: #FFEBEE !important;
      border-radius: 10px !important;
      padding: 14px 16px !important;
      font-size: 14px !important;
      margin-top: 10px !important;
    }

    .form-group { margin-bottom: 14px !important; }
    .inline-b { display: block !important; }
    .d-inherit-576 { display: block !important; }
  \`;
  document.head.appendChild(style);
})();
true;
`;

export default function TacnaScreen() {
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