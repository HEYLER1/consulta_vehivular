// papeletas/sat.tsx
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const SAT_URL =
  'https://www.sat.gob.pe/VirtualSAT/modulos/papeletas.aspx?mysession=%2fkXttmyGbVj%2fYllStZjGaL2v7qNC8DAcKg8Vrrm7S68%3d';

const INJECTED_JS = `
(function() {

  /* ── 1. Eliminar nodos DOM exactos del HTML ── */
  const removeSelectors = [
    'header',
    'footer',
    '#footer',
    'nav',
    '.contenedorMenu',
    '.bg_plomo',
    '#ubicacion',
    '#scroll_top',
    '.scroll_top',
    '#divMenu',                          // Menú de 4 botones superiores
    '#ctl00_cplPrincipal_divTitulo2',    // "CONSULTA DE PAPELETAS" h2
    '#ctl00_cplPrincipal_divWait',       // Spinner nativo
    '.mostrarControl',                   // Secciones de impresión ocultas
    '.col-xs-3',                         // Columna vacía lateral
  ];
  removeSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.remove());
  });

  /* ── 2. Inyectar CSS ── */
  const style = document.createElement('style');
  style.innerHTML = \`

    /* BASE */
    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-font-smoothing: antialiased !important;
    }

    html, body {
      background: #F2F3F7 !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif !important;
      font-size: 14px !important;
      color: #222 !important;
    }

    .main, section, #body, .contenido {
      background: #F2F3F7 !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    section { padding-top: 0 !important; }

    .row { margin-left: 0 !important; margin-right: 0 !important; }

    /* CONTENEDOR PRINCIPAL */
    #body {
      padding: 16px 14px 32px !important;
    }

    /* ── PÁRRAFO DESCRIPCIÓN ── */
    #ctl00_cplPrincipal_pBusqueda {
      font-size: 12px !important;
      color: #888 !important;
      line-height: 1.6 !important;
      margin: 0 0 16px !important;
      padding: 12px 14px !important;
      background: #fff !important;
      border-left: 3px solid #E53935 !important;
      border-radius: 10px !important;
    }

    /* ── CARD HELPER ── */
    #ctl00_cplPrincipal_filter_div,
    #ctl00_cplPrincipal_divBusPlaca,
    #ctl00_cplPrincipal_busqPapeleta,
    #ctl00_cplPrincipal_divBusLicencia,
    #ctl00_cplPrincipal_divBusDNI,
    #ctl00_cplPrincipal_divCaptchaPapeletas,
    #ctl00_cplPrincipal_divDescPapeleta {
      background: #fff !important;
      border-radius: 16px !important;
      padding: 16px !important;
      margin-bottom: 12px !important;
      box-shadow: 0 1px 8px rgba(0,0,0,0.06) !important;
      border: none !important;
    }

    /* ── LABEL TIPO BÚSQUEDA ── */
    #ctl00_cplPrincipal_filter_div p {
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #aaa !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin-bottom: 8px !important;
    }

    /* ── SELECT ── */
    #tipoBusquedaPapeletas {
      width: 100% !important;
      padding: 13px 14px !important;
      border: 1.5px solid #E8E8E8 !important;
      border-radius: 12px !important;
      font-size: 14px !important;
      color: #333 !important;
      background: #FAFAFA url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23999' d='M1 1l5 5 5-5'/%3E%3C/svg%3E") no-repeat right 14px center !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      outline: none !important;
    }

    #tipoBusquedaPapeletas:focus {
      border-color: #E53935 !important;
      box-shadow: 0 0 0 3px rgba(229,57,53,0.10) !important;
    }

    /* ── TÍTULOS DE SECCIÓN (h2 dentro de filterOption) ── */
    .filterOption .titleOption h2 {
      display: block !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #E53935 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.2px !important;
      margin: 0 0 14px !important;
      padding-bottom: 10px !important;
      border-bottom: 1px solid #F0F0F0 !important;
    }

    /* ── LABEL DE CAMPO ── */
    .bodyOption p,
    .filterOption > .col-xs-12 > .row > .col-md-3 > p {
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #999 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      margin-bottom: 6px !important;
    }

    /* ── INPUTS ── */
    #ctl00_cplPrincipal_txtPlaca,
    #ctl00_cplPrincipal_txtPapeleta,
    #ctl00_cplPrincipal_txtLicencia,
    #ctl00_cplPrincipal_txtDNI,
    input.form-control {
      width: 100% !important;
      padding: 13px 14px !important;
      border: 1.5px solid #E8E8E8 !important;
      border-radius: 12px !important;
      font-size: 15px !important;
      color: #222 !important;
      background: #FAFAFA !important;
      outline: none !important;
      margin-bottom: 4px !important;
    }

    #ctl00_cplPrincipal_txtPlaca:focus,
    #ctl00_cplPrincipal_txtPapeleta:focus,
    #ctl00_cplPrincipal_txtLicencia:focus,
    #ctl00_cplPrincipal_txtDNI:focus,
    input.form-control:focus {
      border-color: #E53935 !important;
      background: #fff !important;
      box-shadow: 0 0 0 3px rgba(229,57,53,0.10) !important;
    }

    /* ── MENSAJE VALIDACIÓN PAPELETA ── */
    #ctl00_cplPrincipal_lblMensajePapeleta {
      font-size: 11px !important;
      color: #E53935 !important;
    }

    /* ── CAPTCHA CONTAINER ── */
    #ctl00_cplPrincipal_divCaptchaPapeletas .bodyOption p {
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #aaa !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin-bottom: 10px !important;
    }

    /* reCAPTCHA frame responsive */
    .g-recaptcha {
      transform-origin: left top !important;
      transform: scale(0.92) !important;
    }

    /* ── BOTÓN BUSCAR ── */
    #ctl00_cplPrincipal_CaptchaContinue {
      display: block !important;
      width: 100% !important;
      margin-top: 14px !important;
      padding: 15px !important;
      background: #E53935 !important;
      color: #fff !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      border: none !important;
      border-radius: 14px !important;
      cursor: pointer !important;
      letter-spacing: 0.2px !important;
    }

    #ctl00_cplPrincipal_CaptchaContinue:active {
      opacity: 0.85 !important;
      transform: scale(0.99) !important;
    }

    /* ── ALERTA DESCUENTO ── */
    #ctl00_cplPrincipal_divDescPapeleta .alert-success {
      background: #F0FFF4 !important;
      border: none !important;
      border-left: 4px solid #4CAF50 !important;
      border-radius: 12px !important;
      padding: 14px !important;
      margin: 0 !important;
    }

    #ctl00_cplPrincipal_divDescPapeleta .alert-success h4 {
      color: #2E7D32 !important;
      font-size: 13px !important;
      margin: 0 !important;
    }

    /* ── FECHA DE CONSULTA ── */
    #ctl00_cplPrincipal_lblFechaSistema {
      font-weight: 700 !important;
      color: #555 !important;
    }

    /* ── TABLA DE RESULTADOS ── */
    #ctl00_cplPrincipal_divDataGrid,
    #ctl00_cplPrincipal_divDataGrid2 {
      background: #fff !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      box-shadow: 0 1px 8px rgba(0,0,0,0.06) !important;
      margin-top: 8px !important;
    }

    table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 12px !important;
    }

    table thead th {
      background: #E53935 !important;
      color: #fff !important;
      padding: 11px 10px !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
      text-align: left !important;
      white-space: nowrap !important;
    }

    table tbody td {
      padding: 11px 10px !important;
      border-bottom: 1px solid #F5F5F5 !important;
      color: #444 !important;
      vertical-align: middle !important;
    }

    table tbody tr:last-child td {
      border-bottom: none !important;
    }

    table tbody tr:nth-child(even) td {
      background: #FAFAFA !important;
    }

    /* ── CHECKBOX ── */
    input[type="checkbox"] {
      width: 18px !important;
      height: 18px !important;
      accent-color: #E53935 !important;
    }

    /* ── BOTONES ACCIÓN (pagar, imprimir) ── */
    #ctl00_cplPrincipal_btnPagar,
    #ctl00_cplPrincipal_btnRegDoc2,
    .btn.btn-outline-primary {
      background: #E53935 !important;
      color: #fff !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 12px 20px !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      margin: 8px 0 !important;
    }

    /* ── LINK MTC ── */
    a[href*="mtc.gob.pe"] {
      color: #E53935 !important;
      font-weight: 600 !important;
      text-decoration: none !important;
    }

    /* ── MENSAJE ALERTA ── */
    #ctl00_cplPrincipal_lblMensaje {
      font-size: 12px !important;
      color: #E53935 !important;
      display: block !important;
      margin-top: 6px !important;
    }

    /* ── TEXTO CANTIDAD REGISTROS ── */
    #ctl00_cplPrincipal_lblCantidadRegistros {
      font-size: 12px !important;
      color: #888 !important;
    }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 3px !important; height: 3px !important; }
    ::-webkit-scrollbar-track { background: transparent !important; }
    ::-webkit-scrollbar-thumb { background: #DDD !important; border-radius: 4px !important; }

  \`;
  document.head.appendChild(style);

})();
true;
`;

export default function SATScreen() {
  const [webLoading, setWebLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  return (
    <ThemedView style={styles.container}>
      {/* Loading overlay */}
      {webLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#E53935" />
            <ThemedText style={styles.loadingTitle}>Cargando SAT</ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              Conectando con la web oficial...
            </ThemedText>
          </View>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: SAT_URL }}
        style={[styles.webView, webLoading && styles.hidden]}
        onLoadStart={() => setWebLoading(true)}
        onLoadEnd={() => setWebLoading(false)}
        injectedJavaScript={INJECTED_JS}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F3F7' },
  webView: { flex: 1, backgroundColor: '#F2F3F7' },
  hidden: { opacity: 0, position: 'absolute' },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F3F7',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 4,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#aaa',
  },
});