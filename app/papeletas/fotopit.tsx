// papeletas/fotopit.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const FOTOPIT_URL =
  'https://webexterno.sutran.gob.pe/WebExterno/Pages/frmPapeletasCinemometro.aspx';

const INJECTED_JS = `
(function() {

  // ── ELIMINAR ELEMENTOS INNECESARIOS ──
  [
    '#titulo', '#divtitulobus', '.divtitulo2',
    '#divBloqueo', '#PMensaje', '#upBuscarActa',
    '#dialog', 'img#Image2',
  ].forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

  // ── FORZAR FONDO OSCURO INMEDIATO ──
  document.body.style.cssText = 'background: #12102A !important; margin: 0; padding: 0;';

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
      background-image: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif !important;
      color: #E8E6F0 !important;
      min-height: 100vh !important;
    }

    /* ─── CONTENEDOR PRINCIPAL ─── */
    #contenedorlic {
      background: transparent !important;
      padding: 16px !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      overflow-x: hidden !important;
    }

    /* ─── CARD DE BÚSQUEDA ─── */
    #divbusqueda {
      background: #1E1A3A !important;
      border: 1px solid rgba(124,92,191,0.22) !important;
      border-radius: 20px !important;
      padding: 20px 16px !important;
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.30) !important;
      margin: 0 !important;
      overflow: hidden !important;
    }

    /* ─── OVERRIDE WIDTHS INLINE ─── */
    #divbusqueda,
    #contenedorlic,
    #tblBusqueda,
    #tblBusqueda tbody,
    #tblBusqueda tr,
    #tblBusqueda td {
      width: 100% !important;
      max-width: 100% !important;
      display: block !important;
      float: none !important;
      box-sizing: border-box !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    #tblBusqueda hr {
      border: none !important;
      border-top: 1px solid rgba(124,92,191,0.18) !important;
      margin: 14px 0 !important;
    }

    /* ─── RADIO BUTTONS ─── */
    #rbtListMovimiento,
    #rbtListMovimiento tbody,
    #rbtListMovimiento tr {
      display: flex !important;
      width: 100% !important;
      gap: 0 !important;
      background: rgba(255,255,255,0.04) !important;
      padding: 10px 14px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(124,92,191,0.18) !important;
      margin-bottom: 14px !important;
    }

    #rbtListMovimiento td {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      width: auto !important;
      padding: 0 12px 0 0 !important;
    }

    #rbtListMovimiento label {
      font-size: 13px !important;
      color: #C8C4E0 !important;
      font-weight: 600 !important;
      cursor: pointer !important;
    }

    input[type="radio"] {
      accent-color: #7C5CBF !important;
      width: 16px !important;
      height: 16px !important;
    }

    /* ─── LABELS ─── */
    #lblActaPlaca, #lblCV {
      font-size: 10px !important;
      font-weight: 800 !important;
      color: #7C5CBF !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      display: block !important;
      margin: 12px 0 6px !important;
    }

    /* ─── TEXTO INSTRUCCIÓN CAPTCHA ─── */
    #tblBusqueda tr td[colspan="4"] {
      font-size: 11px !important;
      color: #9993B8 !important;
      margin: 8px 0 6px !important;
      display: block !important;
    }

    /* ─── TODOS LOS INPUTS AL 100% ─── */
    input[type="text"],
    input[type="password"],
    input.form-control,
    input.textboxClase {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      padding: 13px 14px !important;
      border: 1.5px solid rgba(124,92,191,0.30) !important;
      border-radius: 12px !important;
      font-size: 15px !important;
      color: #E8E6F0 !important;
      background: #2A2450 !important;
      outline: none !important;
      margin-bottom: 10px !important;
      caret-color: #A98EE0 !important;
      -webkit-appearance: none !important;
      display: block !important;
    }

    input[type="text"]::placeholder,
    input.form-control::placeholder,
    input.textboxClase::placeholder {
      color: #4E4770 !important;
    }

    input[type="text"]:focus,
    input.form-control:focus,
    input.textboxClase:focus {
      border-color: #7C5CBF !important;
      background: #2E285A !important;
      box-shadow: 0 0 0 3px rgba(124,92,191,0.18) !important;
    }

    /* ─── SELECT TIPO DOCUMENTO ─── */
    select, #ddlTipoBusqueda {
      width: 100% !important;
      max-width: 100% !important;
      padding: 13px 40px 13px 14px !important;
      border: 1.5px solid rgba(124,92,191,0.30) !important;
      border-radius: 12px !important;
      font-size: 14px !important;
      color: #E8E6F0 !important;
      background: #2A2450 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%237C5CBF' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E") no-repeat right 14px center !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      outline: none !important;
      margin-bottom: 10px !important;
      display: block !important;
    }

    select:focus, #ddlTipoBusqueda:focus {
      border-color: #7C5CBF !important;
      box-shadow: 0 0 0 3px rgba(124,92,191,0.20) !important;
    }

    select option, #ddlTipoBusqueda option {
      background: #1E1A3A !important;
      color: #E8E6F0 !important;
    }

    /* ─── CAPTCHA IFRAME ─── */
    #iimage {
      display: block !important;
      width: 100% !important;
      height: 60px !important;
      border-radius: 10px !important;
      border: 1.5px solid rgba(124,92,191,0.30) !important;
      background: #2A2450 !important;
      margin-bottom: 10px !important;
    }

    /* ─── LINK GENERAR CÓDIGO ─── */
    #LnkBtnGenerarCod {
      font-size: 12px !important;
      color: #A98EE0 !important;
      font-weight: 600 !important;
      text-decoration: none !important;
      display: inline-block !important;
      margin-bottom: 10px !important;
    }

    /* ─── OCULTAR ELEMENTOS NO ÚTILES EN MÓVIL ─── */
    #ImgBtnEscucharAudio,
    input[name="ImgBtnEscucharAudio"],
    input[name="opener"],
    #UpdateProgress1,
    #BtnVerPopup,
    input[type="image"] {
      display: none !important;
    }

    /* ─── BOTÓN BUSCAR ─── */
    #BtnBuscar, input[name="BtnBuscar"] {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin-top: 6px !important;
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
      -webkit-appearance: none !important;
      text-align: center !important;
    }

    #BtnBuscar:active {
      opacity: 0.88 !important;
      transform: scale(0.985) !important;
    }

    /* ─── MENSAJE ERROR ─── */
    #LblMensaje {
      font-size: 11px !important;
      color: #FF6B6B !important;
      font-weight: 600 !important;
      display: block !important;
      text-align: center !important;
      margin-top: 8px !important;
    }

    /* ─── INFO SUTRAN ─── */
    #lblMensajeOficina1,
    #lblHorario,
    #lblRecuerde {
      font-size: 11px !important;
      color: #7C7AA0 !important;
      line-height: 1.6 !important;
      display: block !important;
      margin-bottom: 6px !important;
    }

    /* ─── TABLA RESULTADOS ─── */
    #gvCinemometro {
      display: block !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 12px !important;
      margin-top: 16px !important;
    }

    #gvCinemometro th {
      background: linear-gradient(90deg, #5A3D9A, #7C5CBF) !important;
      color: #fff !important;
      padding: 12px 10px !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.7px !important;
      text-align: left !important;
      border: none !important;
      white-space: nowrap !important;
    }

    #gvCinemometro td {
      padding: 11px 10px !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      color: #C8C4E0 !important;
      vertical-align: middle !important;
      background: #1E1A3A !important;
      border-color: transparent !important;
    }

    #gvCinemometro tr:nth-child(even) td {
      background: rgba(255,255,255,0.03) !important;
    }

    #gvCinemometro tr:last-child td {
      border-bottom: none !important;
    }

    /* ─── ALERTAS ─── */
    .alert-success {
      background: rgba(76,175,80,0.12) !important;
      border: none !important;
      border-left: 3px solid #4CAF50 !important;
      border-radius: 10px !important;
      padding: 14px !important;
      color: #69D97A !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }

    .alert-danger, .alert-warning {
      background: rgba(229,57,53,0.10) !important;
      border: none !important;
      border-left: 3px solid #E53935 !important;
      border-radius: 10px !important;
      padding: 14px !important;
      color: #FF6B6B !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }

    /* ─── PULL TO REFRESH ─── */
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

  // ── ELIMINAR ATRIBUTOS INLINE QUE ROMPEN EL RESPONSIVE ──
  const tbl = document.getElementById('tblBusqueda');
  if (tbl) {
    tbl.removeAttribute('width');
    tbl.removeAttribute('align');
    tbl.style.cssText = 'width:100% !important; display:block !important;';
  }

  const divBus = document.getElementById('divbusqueda');
  if (divBus) {
    divBus.removeAttribute('width');
    divBus.style.width = '100%';
    divBus.style.maxWidth = '100%';
  }

  // ── LIMPIAR TODOS LOS TD/TR DE ATRIBUTOS INLINE ──
  document.querySelectorAll('#tblBusqueda td, #tblBusqueda tr').forEach(el => {
    el.removeAttribute('width');
    el.removeAttribute('align');
    el.removeAttribute('valign');
    el.style.width = '100%';
    el.style.maxWidth = '100%';
    el.style.display = 'block';
    el.style.padding = '0';
    el.style.boxSizing = 'border-box';
  });

  // ── LIMPIAR ESTILOS INLINE DE INPUTS ──
  document.querySelectorAll(
    '#txtActa, #TxtBuscar, #TxtCodImagen, #txtCodigoVerificador, #txtPlaca, #ddlTipoBusqueda'
  ).forEach(el => {
    el.removeAttribute('style');
  });

  // ── LIMPIAR ESTILO INLINE DEL BOTÓN BUSCAR ──
  const btnBuscar = document.getElementById('BtnBuscar');
  if (btnBuscar) btnBuscar.removeAttribute('style');

  // ── FORZAR IFRAME CAPTCHA RESPONSIVE ──
  const iframe = document.getElementById('iimage');
  if (iframe) {
    iframe.removeAttribute('width');
    iframe.removeAttribute('height');
    iframe.style.cssText = 'width:100% !important; height:60px !important; display:block !important;';
  }

  // ── OCULTAR TDs VACÍOS ──
  document.querySelectorAll('#tblBusqueda td').forEach(td => {
    const txt = td.innerText.trim();
    const hasContent = td.querySelector('input, select, iframe, a, span[id], label');
    if (!hasContent && (txt === '' || txt === '\u00a0')) {
      td.style.display = 'none';
    }
  });

  // ── INYECTAR HEADER PERSONALIZADO ──
  const headerDiv = document.createElement('div');
  headerDiv.style.cssText = 'display:flex; align-items:center; gap:12px; padding:20px 0 16px; margin-bottom:12px;';
  headerDiv.innerHTML = \`
    <div style="
      width:44px; height:44px;
      background: linear-gradient(135deg, #37474F, #263238);
      border-radius:14px;
      display:flex; align-items:center; justify-content:center;
      font-size:22px; flex-shrink:0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.40);
    ">📷</div>
    <div>
      <div style="font-size:16px; font-weight:800; color:#E8E6F0; letter-spacing:-0.3px;">FotoPIT / Cinemómetro</div>
      <div style="font-size:11px; color:#5C5480; margin-top:2px;">SUTRAN — Infracciones por radar</div>
    </div>
  \`;

  const contenedor = document.getElementById('contenedorlic');
  if (contenedor) contenedor.prepend(headerDiv);

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

export default function ScreenFotoPIT() {
  const [webLoading, setWebLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  return (
    <ThemedView style={styles.container}>
      {webLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#7C5CBF" />
            <ThemedText style={styles.loadingTitle}>FotoPIT</ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              Conectando con SUTRAN...
            </ThemedText>
          </View>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: FOTOPIT_URL }}
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