// papeletas/sat.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const SAT_URL =
  'https://www.sat.gob.pe/VirtualSAT/modulos/papeletas.aspx?mysession=ctyOpc97k9I2Oo0TSsT%2fycAs%2fnt41gNGCvnbaCaJLQQ%3d';

const INJECTED_JS = `
(function() {

  [
    'header', 'footer', '#footer', 'nav',
    '.contenedorMenu', '.bg_plomo', '#ubicacion',
    '#scroll_top', '.scroll_top', '#divMenu',
    '#ctl00_cplPrincipal_divTitulo2',
    '#ctl00_cplPrincipal_divWait',
    '.mostrarControl',
  ].forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

  const s = document.createElement('style');
  s.innerHTML = \`

    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-font-smoothing: antialiased !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #12102A !important;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif !important;
      color: #E8E6F0 !important;
      min-height: 100vh !important;
    }

    .main, section, .contenido {
      background: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    section { padding-top: 0 !important; }

    #body {
      max-width: 480px !important;
      margin: 0 auto !important;
      padding: 20px 16px 48px !important;
    }

    .row { margin-left: 0 !important; margin-right: 0 !important; }

    [class*="col-"] {
      padding-left: 0 !important;
      padding-right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
    }

    /* ─── PULL TO REFRESH INDICATOR ─── */
    #ptr-indicator {
      position: fixed !important;
      top: -80px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      width: 64px !important;
      height: 64px !important;
      background: #1E1A3A !important;
      border-radius: 50% !important;
      border: 1.5px solid rgba(124,92,191,0.35) !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
      transition: top 0.2s ease !important;
      z-index: 9999 !important;
    }

    #ptr-indicator.ptr-visible {
      top: 16px !important;
    }

    #ptr-arrow {
      font-size: 22px !important;
      line-height: 1 !important;
      transition: transform 0.25s ease !important;
      display: block !important;
    }

    #ptr-arrow.ptr-ready {
      transform: rotate(180deg) !important;
    }

    #ptr-spinner {
      display: none !important;
      width: 22px !important;
      height: 22px !important;
      border: 2.5px solid rgba(124,92,191,0.25) !important;
      border-top-color: #7C5CBF !important;
      border-radius: 50% !important;
      animation: spin 0.7s linear infinite !important;
    }

    #ptr-spinner.ptr-spinning {
      display: block !important;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    #ctl00_cplPrincipal_pBusqueda {
      font-size: 12px !important;
      color: #9993B8 !important;
      line-height: 1.7 !important;
      margin: 0 0 18px !important;
      padding: 12px 14px !important;
      background: rgba(255,255,255,0.04) !important;
      border-left: 3px solid #7C5CBF !important;
      border-radius: 10px !important;
    }

    #ctl00_cplPrincipal_filter_div,
    #ctl00_cplPrincipal_divBusPlaca,
    #ctl00_cplPrincipal_busqPapeleta,
    #ctl00_cplPrincipal_divBusLicencia,
    #ctl00_cplPrincipal_divBusDNI,
    #ctl00_cplPrincipal_divCaptchaPapeletas,
    #ctl00_cplPrincipal_divDescPapeleta {
      background: #1E1A3A !important;
      border-radius: 18px !important;
      padding: 18px !important;
      margin-bottom: 12px !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
      border: 1px solid rgba(124,92,191,0.18) !important;
      width: 100% !important;
    }

    #ctl00_cplPrincipal_filter_div p {
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-bottom: 10px !important;
    }

    #tipoBusquedaPapeletas {
      width: 100% !important;
      height: 100% !important;
      padding: 13px 40px 13px 14px !important;
      border: 1.5px solid rgba(124,92,191,0.35) !important;
      border-radius: 12px !important;
      font-size: 14px !important;
      color: #E8E6F0 !important;
      background: #2A2450 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%237C5CBF' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E") no-repeat right 14px center !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      outline: none !important;
    }

    #tipoBusquedaPapeletas:focus {
      border-color: #7C5CBF !important;
      box-shadow: 0 0 0 3px rgba(124,92,191,0.20) !important;
    }

    #tipoBusquedaPapeletas option {
      background: #1E1A3A !important;
      color: #E8E6F0 !important;
    }

    .filterOption .titleOption h2 {
      display: block !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #A98EE0 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.4px !important;
      margin: 0 0 14px !important;
      padding-bottom: 10px !important;
      border-bottom: 1px solid rgba(124,92,191,0.20) !important;
    }

    .bodyOption p, .filterOption .row p {
      font-size: 10px !important;
      font-weight: 700 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin-bottom: 6px !important;
    }

    #ctl00_cplPrincipal_txtPlaca,
    #ctl00_cplPrincipal_txtPapeleta,
    #ctl00_cplPrincipal_txtLicencia,
    #ctl00_cplPrincipal_txtDNI,
    input.form-control {
      width: 100% !important;
      padding: 14px !important;
      border: 1.5px solid rgba(124,92,191,0.30) !important;
      border-radius: 12px !important;
      font-size: 15px !important;
      color: #E8E6F0 !important;
      background: #2A2450 !important;
      outline: none !important;
      margin-bottom: 4px !important;
      caret-color: #A98EE0 !important;
    }

    #ctl00_cplPrincipal_txtPlaca::placeholder,
    #ctl00_cplPrincipal_txtPapeleta::placeholder,
    #ctl00_cplPrincipal_txtLicencia::placeholder,
    #ctl00_cplPrincipal_txtDNI::placeholder { color: #4E4770 !important; }

    #ctl00_cplPrincipal_txtPlaca:focus,
    #ctl00_cplPrincipal_txtPapeleta:focus,
    #ctl00_cplPrincipal_txtLicencia:focus,
    #ctl00_cplPrincipal_txtDNI:focus,
    input.form-control:focus {
      border-color: #7C5CBF !important;
      background: #2E285A !important;
      box-shadow: 0 0 0 3px rgba(124,92,191,0.18) !important;
    }

    #ctl00_cplPrincipal_lblMensajePapeleta,
    #ctl00_cplPrincipal_lblMensaje,
    .texto_alerta {
      font-size: 11px !important;
      color: #FF6B6B !important;
      margin-top: 4px !important;
      display: block !important;
    }

    .g-recaptcha {
      transform-origin: left top !important;
      transform: scale(0.90) !important;
      margin-bottom: -8px !important;
    }

    #ctl00_cplPrincipal_CaptchaContinue {
      display: block !important;
      width: 100% !important;
      margin-top: 16px !important;
      padding: 15px !important;
      background: linear-gradient(135deg, #7C5CBF 0%, #5A3D9A 100%) !important;
      color: #fff !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      border: none !important;
      border-radius: 14px !important;
      cursor: pointer !important;
      letter-spacing: 0.3px !important;
      box-shadow: 0 4px 18px rgba(124,92,191,0.40) !important;
    }

    #ctl00_cplPrincipal_CaptchaContinue:active {
      opacity: 0.88 !important;
      transform: scale(0.985) !important;
    }

    #ctl00_cplPrincipal_divDescPapeleta .alert-success {
      background: rgba(76,175,80,0.12) !important;
      border: none !important;
      border-left: 3px solid #4CAF50 !important;
      border-radius: 10px !important;
      padding: 12px !important;
      margin: 0 !important;
    }

    #ctl00_cplPrincipal_divDescPapeleta h4 {
      color: #69D97A !important;
      font-size: 13px !important;
      margin: 0 !important;
    }

    .ocultarControl p,
    #ctl00_cplPrincipal_lblFechaSistema {
      font-size: 11px !important;
      color: #5C5480 !important;
    }

    #rowResponsive, .papeletas_f4_f1, .table-responsive {
      max-width: 480px !important;
      margin: 0 auto !important;
      width: 100% !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }

    #ctl00_cplPrincipal_divDataGrid,
    #ctl00_cplPrincipal_divDataGrid2 {
      max-width: 480px !important;
      margin: 0 auto 12px auto !important;
      width: 100% !important;
      background: #1E1A3A !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.30) !important;
      border: 1px solid rgba(124,92,191,0.25) !important;
    }

    table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 12px !important;
    }

    table thead th {
      background: linear-gradient(90deg, #5A3D9A, #7C5CBF) !important;
      color: #fff !important;
      padding: 12px 10px !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.7px !important;
      text-align: left !important;
      white-space: nowrap !important;
    }

    table tbody td {
      padding: 11px 10px !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      color: #C8C4E0 !important;
      vertical-align: middle !important;
    }

    table tbody tr:nth-child(even) td { background: rgba(255,255,255,0.03) !important; }
    table tbody tr:last-child td { border-bottom: none !important; }

    input[type="checkbox"] {
      width: 18px !important;
      height: 18px !important;
      accent-color: #7C5CBF !important;
    }

    #ctl00_cplPrincipal_btnPagar,
    #ctl00_cplPrincipal_btnRegDoc2 {
      display: block !important;
      width: 100% !important;
      background: linear-gradient(135deg, #7C5CBF, #5A3D9A) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 13px 24px !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      margin: 10px 0 !important;
      box-shadow: 0 4px 14px rgba(124,92,191,0.35) !important;
      text-align: center !important;
    }

    a[href*="mtc.gob.pe"] {
      color: #A98EE0 !important;
      font-weight: 600 !important;
      text-decoration: none !important;
    }

    #ctl00_cplPrincipal_lblCantidadRegistros {
      font-size: 12px !important;
      color: #7C5CBF !important;
      font-weight: 600 !important;
    }

    ::-webkit-scrollbar { width: 3px !important; height: 3px !important; }
    ::-webkit-scrollbar-track { background: transparent !important; }
    ::-webkit-scrollbar-thumb { background: #3D3570 !important; border-radius: 4px !important; }

  \`;
  document.head.appendChild(s);

  /* ── PULL TO REFRESH ── */
  const THRESHOLD = 80;   // px para disparar recarga
  const MAX_PULL  = 100;  // px máximo de arrastre visual

  // Crear indicador
  const indicator = document.createElement('div');
  indicator.id = 'ptr-indicator';
  indicator.innerHTML = '<span id="ptr-arrow">↓</span><div id="ptr-spinner"></div>';
  document.body.prepend(indicator);

  const arrow   = document.getElementById('ptr-arrow');
  const spinner = document.getElementById('ptr-spinner');

  let startY    = 0;
  let pulling   = false;
  let triggered = false;

  document.addEventListener('touchstart', (e) => {
    // Solo activar si estamos en el tope del scroll
    if (window.scrollY === 0) {
      startY  = e.touches[0].clientY;
      pulling = true;
      triggered = false;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const delta = Math.min(e.touches[0].clientY - startY, MAX_PULL);
    if (delta <= 0) { pulling = false; return; }

    // Mostrar indicador
    indicator.classList.add('ptr-visible');
    arrow.style.opacity = String(Math.min(delta / THRESHOLD, 1));

    if (delta >= THRESHOLD) {
      if (!triggered) {
        triggered = true;
        arrow.classList.add('ptr-ready');
      }
    } else {
      triggered = false;
      arrow.classList.remove('ptr-ready');
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;

    if (triggered) {
      // Mostrar spinner y recargar
      arrow.style.display  = 'none';
      spinner.classList.add('ptr-spinning');
      setTimeout(() => window.location.reload(), 300);
    } else {
      // Ocultar indicador sin recargar
      indicator.classList.remove('ptr-visible');
      arrow.classList.remove('ptr-ready');
      arrow.style.opacity = '1';
    }
  });

})();
true;
`;

export default function SATScreen() {
  const [webLoading, setWebLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  return (
    <ThemedView style={styles.container}>
      {webLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#7C5CBF" />
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
  container: { flex: 1, backgroundColor: '#12102A' },
  webView: { flex: 1, backgroundColor: '#12102A' },
  hidden: { opacity: 0, position: 'absolute' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#12102A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  loadingCard: {
    backgroundColor: '#1E1A3A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(124,92,191,0.25)',
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingTitle: { fontSize: 16, fontWeight: '700', color: '#E8E6F0', marginTop: 4 },
  loadingSubtitle: { fontSize: 13, color: '#5C5480' },
});