// papeletas/orden-captura.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const CAPTURA_URL =
  'https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=';

const INJECTED_JS = `
(function() {

  // ── ELIMINAR ELEMENTOS INNECESARIOS ──
  [
    'header', 'footer', '#footer', 'nav',
    '.contenedorMenu', '.bg_plomo', '#ubicacion',
    '#scroll_top', '.scroll_top', '#divMenu',
    '#ctl00_cplPrincipal_divTitulo2',
  ].forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

  // ── INYECTAR ESTILOS ──
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

    /* ─── TÍTULO DE SECCIÓN ─── */
    h2 {
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 1.4px !important;
      margin: 0 0 16px !important;
      padding: 0 !important;
    }

    h2 span {
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 1.4px !important;
    }

    /* ─── DESCRIPCIÓN INTRO ─── */
    #body > .row:nth-child(2) p,
    .col-xs-12 > p {
      font-size: 12px !important;
      color: #9993B8 !important;
      line-height: 1.7 !important;
      margin: 0 0 18px !important;
      padding: 12px 14px !important;
      background: rgba(255,255,255,0.04) !important;
      border-left: 3px solid #7C5CBF !important;
      border-radius: 10px !important;
    }

    /* ─── BLOQUE DE BÚSQUEDA ─── */
    #ctl00_cplPrincipal_busqPlaca {
      background: #1E1A3A !important;
      border-radius: 18px !important;
      padding: 18px !important;
      margin-bottom: 12px !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
      border: 1px solid rgba(124,92,191,0.18) !important;
    }

    #ctl00_cplPrincipal_busqPlaca p {
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-bottom: 8px !important;
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
    }

    /* ─── CAPTCHA BLOCK ─── */
    #divCaptchaInfracciones {
      background: #1E1A3A !important;
      border-radius: 18px !important;
      padding: 18px !important;
      margin-bottom: 12px !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
      border: 1px solid rgba(124,92,191,0.18) !important;
    }

    #divCaptchaInfracciones p {
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-bottom: 8px !important;
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
    }

    /* ─── IMAGEN CAPTCHA ─── */
    .captcha_class {
      display: block !important;
      border-radius: 10px !important;
      margin-bottom: 10px !important;
      border: 1.5px solid rgba(124,92,191,0.30) !important;
      width: 100% !important;
      height: auto !important;
      max-height: 50px !important;
      object-fit: cover !important;
      background: #2A2450 !important;
    }

    /* ─── BOTÓN REFRESH CAPTCHA ─── */
    input[type="image"] {
      width: 28px !important;
      height: 28px !important;
      opacity: 0.6 !important;
      margin-left: 8px !important;
      vertical-align: middle !important;
      filter: invert(1) !important;
    }

    input[type="image"]:active {
      opacity: 1 !important;
      transform: rotate(90deg) !important;
    }

    /* ─── INPUTS ─── */
    #ctl00_cplPrincipal_txtPlaca,
    #ctl00_cplPrincipal_txtCaptcha,
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
      letter-spacing: 2px !important;
    }

    #ctl00_cplPrincipal_txtPlaca::placeholder,
    #ctl00_cplPrincipal_txtCaptcha::placeholder {
      color: #4E4770 !important;
      letter-spacing: 0px !important;
    }

    #ctl00_cplPrincipal_txtPlaca:focus,
    #ctl00_cplPrincipal_txtCaptcha:focus,
    input.form-control:focus {
      border-color: #7C5CBF !important;
      background: #2E285A !important;
      box-shadow: 0 0 0 3px rgba(124,92,191,0.18) !important;
    }

    /* ─── BOTÓN BUSCAR ─── */
    #ctl00_cplPrincipal_CaptchaContinue,
    input.boton {
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

    #ctl00_cplPrincipal_CaptchaContinue:active,
    input.boton:active {
      opacity: 0.88 !important;
      transform: scale(0.985) !important;
    }

    /* ─── MENSAJE ERROR CAPTCHA ─── */
    #ctl00_cplPrincipal_lblMensajeCapcha,
    .Text_Message {
      font-size: 11px !important;
      color: #FF6B6B !important;
      margin-top: 6px !important;
      display: block !important;
      font-weight: 600 !important;
    }

    /* ─── RESULTADO ─── */
    #ctl00_cplPrincipal_fecConsulta {
      margin-top: 4px !important;
    }

    #ctl00_cplPrincipal_fecConsulta p {
      font-size: 12px !important;
      color: #9993B8 !important;
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
      margin: 0 !important;
    }

    /* ─── CONTENEDOR DE RESULTADO CAPTURA ─── */
    #ctl00_cplPrincipal_divCapturas {
      background: #1E1A3A !important;
      border-radius: 18px !important;
      padding: 18px !important;
      margin-top: 12px !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
      border: 1px solid rgba(124,92,191,0.18) !important;
    }

    #ctl00_cplPrincipal_divCapturas .tabla_smallxx {
      width: 100% !important;
    }

    /* ─── FECHA RESULTADO ─── */
    #ctl00_cplPrincipal_lblFecha {
      font-size: 11px !important;
      color: #5C5480 !important;
      display: block !important;
      margin-top: 10px !important;
    }

    /* ─── TABLA RESULTADOS ─── */
    .tabla_smallxx table,
    #ctl00_cplPrincipal_divCapturas table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 12px !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }

    .tabla_smallxx table thead th,
    #ctl00_cplPrincipal_divCapturas table thead th {
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

    .tabla_smallxx table tbody td,
    #ctl00_cplPrincipal_divCapturas table tbody td {
      padding: 11px 10px !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      color: #C8C4E0 !important;
      vertical-align: middle !important;
    }

    .tabla_smallxx table tbody tr:nth-child(even) td,
    #ctl00_cplPrincipal_divCapturas table tbody tr:nth-child(even) td {
      background: rgba(255,255,255,0.03) !important;
    }

    .tabla_smallxx table tbody tr:last-child td,
    #ctl00_cplPrincipal_divCapturas table tbody tr:last-child td {
      border-bottom: none !important;
    }

    /* ─── MENSAJE SIN CAPTURA (verde) ─── */
    .alert-success,
    [class*="alert-success"] {
      background: rgba(76,175,80,0.12) !important;
      border: none !important;
      border-left: 3px solid #4CAF50 !important;
      border-radius: 10px !important;
      padding: 14px !important;
      color: #69D97A !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }

    /* ─── MENSAJE CON CAPTURA (rojo) ─── */
    .alert-danger,
    [class*="alert-danger"] {
      background: rgba(229,57,53,0.10) !important;
      border: none !important;
      border-left: 3px solid #E53935 !important;
      border-radius: 10px !important;
      padding: 14px !important;
      color: #FF6B6B !important;
      font-size: 13px !important;
      font-weight: 600 !important;
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

    #ptr-indicator.ptr-visible { top: 16px !important; }

    #ptr-arrow {
      font-size: 22px !important;
      line-height: 1 !important;
      transition: transform 0.25s ease !important;
      display: block !important;
    }

    #ptr-arrow.ptr-ready { transform: rotate(180deg) !important; }

    #ptr-spinner {
      display: none !important;
      width: 22px !important;
      height: 22px !important;
      border: 2.5px solid rgba(124,92,191,0.25) !important;
      border-top-color: #7C5CBF !important;
      border-radius: 50% !important;
      animation: spin 0.7s linear infinite !important;
    }

    #ptr-spinner.ptr-spinning { display: block !important; }

    @keyframes spin { to { transform: rotate(360deg); } }

    ::-webkit-scrollbar { width: 3px !important; height: 3px !important; }
    ::-webkit-scrollbar-track { background: transparent !important; }
    ::-webkit-scrollbar-thumb { background: #3D3570 !important; border-radius: 4px !important; }

  \`;
  document.head.appendChild(s);

  // ── INYECTAR HEADER PERSONALIZADO ──
  const headerDiv = document.createElement('div');
  headerDiv.style.cssText = \`
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 20px 16px 8px !important;
    margin-bottom: 4px !important;
  \`;
  headerDiv.innerHTML = \`
    <div style="
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #7C5CBF, #5A3D9A);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(124,92,191,0.40);
    ">🚨</div>
    <div>
      <div style="font-size:16px; font-weight:800; color:#E8E6F0; letter-spacing:-0.3px;">Captura de Vehículos</div>
      <div style="font-size:11px; color:#5C5480; margin-top:2px;">SAT Lima — Consulta oficial</div>
    </div>
  \`;

  const bodyEl = document.getElementById('body');
  if (bodyEl) bodyEl.prepend(headerDiv);

  // ── PULL TO REFRESH ──
  const THRESHOLD = 80;
  const MAX_PULL  = 100;

  const indicator = document.createElement('div');
  indicator.id = 'ptr-indicator';
  indicator.innerHTML = '<span id="ptr-arrow">↓</span><div id="ptr-spinner"></div>';
  document.body.prepend(indicator);

  const arrow   = document.getElementById('ptr-arrow');
  const spinner = document.getElementById('ptr-spinner');

  let startY = 0, pulling = false, triggered = false;

  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
      pulling = true;
      triggered = false;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const delta = Math.min(e.touches[0].clientY - startY, MAX_PULL);
    if (delta <= 0) { pulling = false; return; }
    indicator.classList.add('ptr-visible');
    arrow.style.opacity = String(Math.min(delta / THRESHOLD, 1));
    if (delta >= THRESHOLD) {
      if (!triggered) { triggered = true; arrow.classList.add('ptr-ready'); }
    } else {
      triggered = false;
      arrow.classList.remove('ptr-ready');
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;
    if (triggered) {
      arrow.style.display = 'none';
      spinner.classList.add('ptr-spinning');
      setTimeout(() => window.location.reload(), 300);
    } else {
      indicator.classList.remove('ptr-visible');
      arrow.classList.remove('ptr-ready');
      arrow.style.opacity = '1';
    }
  });

})();
true;
`;

export default function ScreenCapturaV() {
  const [webLoading, setWebLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  return (
    <ThemedView style={styles.container}>
      {webLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#7C5CBF" />
            <ThemedText style={styles.loadingTitle}>Orden de Captura</ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              Conectando con SAT Lima...
            </ThemedText>
          </View>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: CAPTURA_URL }}
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