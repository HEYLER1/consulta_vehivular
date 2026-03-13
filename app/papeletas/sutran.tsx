// papeletas/sutran.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Animated } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const SUTRAN_URL =
  'https://webexterno.sutran.gob.pe/WebExterno/Pages/frmRecordInfracciones.aspx';

const INJECTED_CSS = `
(function() {
  const m = document.createElement('meta');
  m.name = 'viewport';
  m.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(m);
  const s = document.createElement('style');
  s.innerHTML = \`
    html, body {
      margin: 0 !important; padding: 0 !important;
      background: #12102A !important; background-image: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif !important;
      color: #E8E6F0 !important;
    }
  \`;
  document.head.appendChild(s);
})();
true;
`;

const INJECTED_JS = `
(function() {

  function applyStyles() {
    [
      '#titulo', '#divtitulobus',
      '#ImgBtnEscucharAudio', '#reproductor', '#Timer1',
      '#UpdateProgress1', '#UpdatePanel1',
      '#ibtnEnviarCorreo', '#ibtnImprimir', '#imprimir',
      '#divBloqueo', '#PMensaje', '#ppdf',
      '#upBuscarActa', '#PnlModal2', '#BtnVerPopup',
      'input[name="HdfModal2"]',
    ].forEach(sel =>
      document.querySelectorAll(sel).forEach(el => el.remove())
    );

    if (!document.getElementById('app-title')) {
      const t = document.createElement('div');
      t.id = 'app-title';
      t.innerHTML = '<span>Récord de Infracciones</span><small>SUTRAN</small>';
      const c = document.getElementById('contenedorlic');
      if (c) c.prepend(t);
    }

    if (document.getElementById('sutran-css')) return;
    const s = document.createElement('style');
    s.id = 'sutran-css';
    s.innerHTML = \`
      *, *::before, *::after {
        box-sizing: border-box !important;
        -webkit-font-smoothing: antialiased !important;
      }
      html, body {
        margin: 0 !important; padding: 0 !important;
        width: 100% !important; min-height: 100vh !important;
        background: #12102A !important; background-image: none !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif !important;
        color: #E8E6F0 !important; overflow-x: hidden !important;
      }
      body > form > *:not(#contenedorlic) { display: none !important; }
      .aspNetHidden { display: none !important; }
      #contenedorlic { display: block !important; }

      #ptr-indicator {
        position: fixed !important; top: -80px !important; left: 50% !important;
        transform: translateX(-50%) !important; display: flex !important;
        flex-direction: column !important; align-items: center !important;
        justify-content: center !important; gap: 6px !important;
        width: 64px !important; height: 64px !important;
        background: #1E1A3A !important; border-radius: 50% !important;
        border: 1.5px solid rgba(124,92,191,0.35) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        transition: top 0.2s ease !important; z-index: 9999 !important;
      }
      #ptr-indicator.ptr-visible { top: 16px !important; }
      #ptr-arrow { font-size: 22px !important; line-height: 1 !important;
        transition: transform 0.25s ease !important; display: block !important; }
      #ptr-arrow.ptr-ready { transform: rotate(180deg) !important; }
      #ptr-spinner { display: none !important; width: 22px !important; height: 22px !important;
        border: 2.5px solid rgba(124,92,191,0.25) !important;
        border-top-color: #7C5CBF !important; border-radius: 50% !important;
        animation: spin 0.7s linear infinite !important; }
      #ptr-spinner.ptr-spinning { display: block !important; }
      @keyframes spin { to { transform: rotate(360deg); } }

      #contenedorlic {
        width: 100% !important; max-width: 100% !important;
        margin: 0 !important; padding: 20px 16px 48px !important;
        background: transparent !important;
      }
      #app-title { display: flex !important; align-items: baseline !important;
        gap: 8px !important; margin-bottom: 18px !important; flex-wrap: wrap !important; }
      #app-title span { font-size: 20px !important; font-weight: 800 !important;
        color: #E8E6F0 !important; letter-spacing: -0.3px !important; }
      #app-title small { font-size: 11px !important; font-weight: 700 !important;
        color: #7C5CBF !important; text-transform: uppercase !important;
        letter-spacing: 1.2px !important; background: rgba(124,92,191,0.15) !important;
        padding: 3px 8px !important; border-radius: 6px !important; }

      #divbusqueda {
        width: 100% !important; background: #1E1A3A !important;
        border-radius: 18px !important; padding: 18px !important;
        margin-bottom: 12px !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
        border: 1px solid rgba(124,92,191,0.18) !important;
      }
      #tblBusqueda, #tblBusqueda tbody, #tblBusqueda tr, #tblBusqueda td {
        display: block !important; width: 100% !important; max-width: 100% !important; }
      #tblBusqueda { border: none !important; }
      #tblBusqueda tr { margin-bottom: 10px !important; }
      #tblBusqueda td { padding: 0 0 4px !important; border: none !important;
        background: transparent !important; color: #9993B8 !important;
        font-size: 11px !important; font-weight: 700 !important;
        text-transform: uppercase !important; letter-spacing: 0.8px !important; }
      #tblBusqueda tr[style*="display:none"],
      #tblBusqueda tr[style*="display: none"] { display: none !important; }

      #txtPlaca {
        display: block !important; width: 100% !important; padding: 14px !important;
        border: 1.5px solid rgba(124,92,191,0.30) !important;
        border-radius: 12px !important; font-size: 16px !important;
        font-weight: 600 !important; color: #E8E6F0 !important;
        background: #2A2450 !important; outline: none !important;
        height: auto !important; caret-color: #A98EE0 !important;
        -webkit-appearance: none !important;
        letter-spacing: 3px !important; text-transform: uppercase !important;
      }
      #txtPlaca::placeholder { color: #4E4770 !important; letter-spacing: 0 !important;
        font-weight: 400 !important; text-transform: none !important; }
      #txtPlaca:focus { border-color: #7C5CBF !important; background: #2E285A !important;
        box-shadow: 0 0 0 3px rgba(124,92,191,0.18) !important; }

      hr { border: none !important;
        border-top: 1px solid rgba(124,92,191,0.15) !important; margin: 4px 0 !important; }
      #tblBusqueda td[colspan="3"] { font-size: 11px !important; color: #5C5480 !important;
        font-weight: 500 !important; text-transform: none !important;
        letter-spacing: 0 !important; padding-bottom: 10px !important; }

      #iimage { border-radius: 10px !important;
        border: 1.5px solid rgba(124,92,191,0.30) !important;
        width: 160px !important; height: 60px !important;
        display: block !important; margin-bottom: 10px !important; }
      #LnkBtnGenerarCod { color: #A98EE0 !important; font-size: 12px !important;
        font-weight: 600 !important; text-decoration: none !important;
        display: inline-block !important; padding: 5px 10px !important;
        background: rgba(124,92,191,0.12) !important; border-radius: 8px !important;
        border: 1px solid rgba(124,92,191,0.25) !important; margin-bottom: 12px !important; }

      #TxtCodImagen {
        display: block !important; width: 100% !important; padding: 14px !important;
        border: 1.5px solid rgba(124,92,191,0.30) !important;
        border-radius: 12px !important; font-size: 15px !important;
        color: #E8E6F0 !important; background: #2A2450 !important;
        outline: none !important; height: auto !important;
        caret-color: #A98EE0 !important; -webkit-appearance: none !important;
        margin-bottom: 14px !important;
        text-transform: uppercase !important; letter-spacing: 3px !important;
      }
      #TxtCodImagen::placeholder { color: #4E4770 !important; letter-spacing: 0 !important;
        text-transform: none !important; }
      #TxtCodImagen:focus { border-color: #7C5CBF !important; background: #2E285A !important;
        box-shadow: 0 0 0 3px rgba(124,92,191,0.18) !important; }

      #BtnBuscar {
        display: block !important; width: 100% !important; padding: 15px !important;
        background: linear-gradient(135deg, #7C5CBF 0%, #5A3D9A 100%) !important;
        color: #fff !important; font-size: 15px !important; font-weight: 700 !important;
        border: none !important; border-radius: 14px !important;
        cursor: pointer !important; letter-spacing: 0.3px !important;
        box-shadow: 0 4px 18px rgba(124,92,191,0.40) !important;
        -webkit-appearance: none !important; height: auto !important;
      }
      #BtnBuscar:active { opacity: 0.88 !important; transform: scale(0.985) !important; }

      #LblMensaje, #LblMensaje2 { font-size: 11px !important; color: #FF6B6B !important;
        margin-top: 6px !important; display: block !important;
        padding: 8px 12px !important; background: rgba(255,107,107,0.08) !important;
        border-left: 3px solid #FF6B6B !important; border-radius: 8px !important; }

      #contenedorlic > table:not(#tblBusqueda) {
        width: 100% !important; border-collapse: collapse !important;
        margin: 0 0 12px !important; background: #1E1A3A !important;
        border-radius: 18px !important; overflow: hidden !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
        border: 1px solid rgba(124,92,191,0.18) !important;
      }
      #contenedorlic > table:not(#tblBusqueda) tr,
      #contenedorlic > table:not(#tblBusqueda) td {
        display: block !important; width: 100% !important;
        border: none !important; background: transparent !important;
      }
      #contenedorlic > table:not(#tblBusqueda) td {
        padding: 5px 16px !important; color: #C8C4E0 !important; font-size: 13px !important;
      }
      #lblFecha, #lblNDoc { font-size: 10px !important; font-weight: 800 !important;
        color: #7C5CBF !important; text-transform: uppercase !important;
        letter-spacing: 0.8px !important; }
      #lblFechConsulta, #lblDoc { font-size: 13px !important;
        color: #E8E6F0 !important; font-weight: 600 !important; }
      #lblItems { font-size: 12px !important; color: #A98EE0 !important; font-weight: 600 !important; }
      #LblNota { font-size: 11px !important; color: #5C5480 !important; }

      #contenedorlic > div[style*="overflow"] {
        width: 100% !important; max-height: none !important;
        overflow-x: auto !important; -webkit-overflow-scrolling: touch !important;
        background: #1E1A3A !important; border-radius: 16px !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.30) !important;
        border: 1px solid rgba(124,92,191,0.25) !important;
        padding-bottom: 16px !important; margin-bottom: 12px !important;
      }
      #gvDeudas { width: 100% !important; border-collapse: collapse !important; font-size: 12px !important; }
      #gvDeudas th { background: linear-gradient(90deg, #5A3D9A, #7C5CBF) !important;
        color: #fff !important; padding: 12px 10px !important; font-size: 10px !important;
        font-weight: 800 !important; text-transform: uppercase !important;
        letter-spacing: 0.7px !important; text-align: left !important;
        border: none !important; height: auto !important; white-space: nowrap !important; }
      #gvDeudas td { padding: 11px 10px !important; border: none !important;
        border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        color: #C8C4E0 !important; vertical-align: middle !important;
        font-size: 12px !important; background: transparent !important;
        display: table-cell !important; }
      #gvDeudas tr[style*="F0F0F0"] td { background: rgba(255,255,255,0.03) !important; }
      #gvDeudas tr[style*="002F76"] td { background: rgba(124,92,191,0.08) !important;
        color: #5C5480 !important; border-top: 1px solid rgba(124,92,191,0.15) !important; }

      #lblMontoDeuda { font-size: 11px !important; font-weight: 700 !important;
        color: #7C5CBF !important; text-transform: uppercase !important;
        letter-spacing: 0.8px !important; padding: 0 14px !important;
        display: inline-block !important; margin-top: 12px !important; }
      #lblTotalDeuda { font-size: 18px !important; font-weight: 800 !important;
        color: #69D97A !important; width: auto !important; display: inline-block !important; }

      ::-webkit-scrollbar { width: 3px !important; height: 3px !important; }
      ::-webkit-scrollbar-track { background: transparent !important; }
      ::-webkit-scrollbar-thumb { background: #3D3570 !important; border-radius: 4px !important; }
    \`;
    document.head.appendChild(s);

    if (!document.getElementById('ptr-indicator')) {
      const ind = document.createElement('div');
      ind.id = 'ptr-indicator';
      ind.innerHTML = '<span id="ptr-arrow">↓</span><div id="ptr-spinner"></div>';
      document.body.prepend(ind);
      const arrow = document.getElementById('ptr-arrow');
      const spinner = document.getElementById('ptr-spinner');
      let startY = 0, pulling = false, triggered = false;
      document.addEventListener('touchstart', e => {
        if (window.scrollY === 0) { startY = e.touches[0].clientY; pulling = true; triggered = false; }
      }, { passive: true });
      document.addEventListener('touchmove', e => {
        if (!pulling) return;
        const d = Math.min(e.touches[0].clientY - startY, 100);
        if (d <= 0) { pulling = false; return; }
        ind.classList.add('ptr-visible');
        arrow.style.opacity = String(Math.min(d / 80, 1));
        if (d >= 80) { if (!triggered) { triggered = true; arrow.classList.add('ptr-ready'); } }
        else { triggered = false; arrow.classList.remove('ptr-ready'); }
      }, { passive: true });
      document.addEventListener('touchend', () => {
        if (!pulling) return; pulling = false;
        if (triggered) {
          arrow.style.display = 'none'; spinner.classList.add('ptr-spinning');
          setTimeout(() => window.location.reload(), 300);
        } else {
          ind.classList.remove('ptr-visible'); arrow.classList.remove('ptr-ready');
          arrow.style.opacity = '1';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStyles);
  } else {
    applyStyles();
  }
  setTimeout(applyStyles, 500);
  setTimeout(applyStyles, 1500);

})();
true;
`;

export default function SUTRANScreen() {
  const hasLoadedOnce = useRef(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // Overlay que cubre el flash del POST
  const [postOverlay, setPostOverlay] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (nav: WebViewNavigation) => {
    if (!hasLoadedOnce.current) return; // ignorar primera carga
    if (nav.loading) {
      // Empieza la transición POST → mostrar overlay inmediatamente
      setPostOverlay(true);
    }
  };

  const handleLoadEnd = () => {
    if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      setTimeout(() => setIsFirstLoad(false), 400);
      return;
    }
    // POST completó → esperar a que los estilos se apliquen antes de quitar overlay
    setTimeout(() => setPostOverlay(false), 900);
  };

  return (
    <ThemedView style={styles.container}>
      {/* WebView siempre visible */}
      <WebView
        ref={webViewRef}
        source={{ uri: SUTRAN_URL }}
        style={styles.webView}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScriptBeforeContentLoaded={INJECTED_CSS}
        injectedJavaScript={INJECTED_JS}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scalesPageToFit={false}
        textZoom={100}
        setSupportMultipleWindows={false}
        mixedContentMode="always"
      />

      {/* Overlay primera carga */}
      {isFirstLoad && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#7C5CBF" />
            <ThemedText style={styles.loadingTitle}>Cargando SUTRAN</ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              Conectando con la web oficial...
            </ThemedText>
          </View>
        </View>
      )}

      {/* Overlay POST — cubre el flash de la página original durante la búsqueda */}
      {postOverlay && (
        <View style={styles.postOverlay}>
          <View style={styles.searchingCard}>
            <ActivityIndicator size="large" color="#7C5CBF" />
            <ThemedText style={styles.searchingText}>Buscando...</ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12102A' },
  webView: { flex: 1, backgroundColor: '#12102A' },

  // Primera carga
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

  // POST overlay — cubre el flash de página original
  postOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#12102A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  searchingCard: {
    backgroundColor: '#1E1A3A',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(124,92,191,0.25)',
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 10,
  },
  searchingText: { fontSize: 15, fontWeight: '700', color: '#A98EE0' },
});