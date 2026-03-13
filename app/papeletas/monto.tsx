// papeletas/monto.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const GENERAR_TICKET_URL = 'https://webexterno.sutran.gob.pe/generarticket';

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
    // Remover elementos innecesarios
    [
      '.navbar', 'nav', 'footer',
    ].forEach(sel =>
      document.querySelectorAll(sel).forEach(el => el.remove())
    );

    // Agregar título app si no existe
    if (!document.getElementById('app-title')) {
      const t = document.createElement('div');
      t.id = 'app-title';
      t.innerHTML = '<span>Generar Ticket</span><small>SUTRAN</small>';
      const jumbotron = document.querySelector('.jumbotron');
      if (jumbotron) jumbotron.prepend(t);
    }

    if (document.getElementById('sutran-ticket-css')) return;
    const s = document.createElement('style');
    s.id = 'sutran-ticket-css';
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

      /* Pull-to-refresh indicator */
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

      /* App title */
      #app-title {
        display: flex !important; align-items: baseline !important;
        gap: 8px !important; margin-bottom: 20px !important; flex-wrap: wrap !important;
        padding: 0 !important;
      }
      #app-title span { font-size: 22px !important; font-weight: 800 !important;
        color: #E8E6F0 !important; letter-spacing: -0.3px !important; }
      #app-title small { font-size: 11px !important; font-weight: 700 !important;
        color: #7C5CBF !important; text-transform: uppercase !important;
        letter-spacing: 1.2px !important; background: rgba(124,92,191,0.15) !important;
        padding: 3px 8px !important; border-radius: 6px !important; }

      /* Container principal */
      .app.container { padding: 20px 16px 48px !important; max-width: 100% !important; }

      /* Jumbotron */
      .jumbotron {
        background: transparent !important;
        padding: 16px 0 !important;
        margin-bottom: 0 !important;
      }
      .jumbotron .lead {
        font-size: 13px !important; font-weight: 800 !important;
        color: #A98EE0 !important; text-align: left !important;
        text-transform: uppercase !important; letter-spacing: 1.2px !important;
        margin-bottom: 8px !important;
      }
      .jumbotron > p:not(.lead) {
        font-size: 13px !important; color: #9993B8 !important;
        margin-bottom: 16px !important;
      }

      /* Form card */
      .bs-component {
        background: #1E1A3A !important;
        border-radius: 18px !important;
        padding: 18px !important;
        border: 1px solid rgba(124,92,191,0.18) !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
        margin-bottom: 16px !important;
      }

      /* Row dentro del form */
      .row { margin: 0 !important; }
      .col-sm-3 {
        width: 100% !important; max-width: 100% !important;
        flex: none !important; padding: 0 !important;
        margin-bottom: 12px !important;
      }
      .form-group { margin-bottom: 0 !important; }

      /* Labels */
      label {
        font-size: 11px !important; font-weight: 700 !important;
        color: #7C5CBF !important; text-transform: uppercase !important;
        letter-spacing: 0.8px !important; margin-bottom: 6px !important;
        display: block !important;
      }

      /* Inputs y selects */
      .form-control, select.form-control, input.form-control {
        display: block !important; width: 100% !important;
        padding: 13px 14px !important;
        border: 1.5px solid rgba(124,92,191,0.30) !important;
        border-radius: 12px !important; font-size: 15px !important;
        font-weight: 500 !important; color: #E8E6F0 !important;
        background: #2A2450 !important; outline: none !important;
        height: auto !important; caret-color: #A98EE0 !important;
        -webkit-appearance: none !important; appearance: none !important;
        margin: 0 !important;
      }
      .form-control:focus {
        border-color: #7C5CBF !important; background: #2E285A !important;
        box-shadow: 0 0 0 3px rgba(124,92,191,0.18) !important;
      }
      select.form-control { color: #9993B8 !important; }
      select.form-control option { background: #2A2450 !important; color: #E8E6F0 !important; }

      /* Input placa uppercase */
      #Vehiculo_Placa { text-transform: uppercase !important; letter-spacing: 2px !important; }

      /* Datepicker */
      #datepicker { letter-spacing: 1px !important; }

      /* Botón buscar */
      #btnBuscar, .btn-primary {
        display: block !important; width: 100% !important;
        padding: 14px !important; margin-top: 4px !important;
        background: linear-gradient(135deg, #7C5CBF 0%, #5A3D9A 100%) !important;
        color: #fff !important; font-size: 15px !important; font-weight: 700 !important;
        border: none !important; border-radius: 14px !important;
        cursor: pointer !important; letter-spacing: 0.3px !important;
        box-shadow: 0 4px 18px rgba(124,92,191,0.40) !important;
        -webkit-appearance: none !important; float: none !important;
      }
      #btnBuscar:active, .btn-primary:active {
        opacity: 0.88 !important; transform: scale(0.985) !important;
      }

      /* Botón oculto de mensaje */
      #btnMsg { display: none !important; }

      /* HR */
      hr { border: none !important;
        border-top: 1px solid rgba(124,92,191,0.15) !important;
        margin: 16px 0 !important;
      }

      /* Tabla de resultados */
      #resultTable {
        width: 100% !important; border-collapse: collapse !important;
        font-size: 12px !important; background: #1E1A3A !important;
        border-radius: 18px !important; overflow: hidden !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.30) !important;
        border: 1px solid rgba(124,92,191,0.25) !important;
      }
      #resultTable thead tr.table-primary th {
        background: linear-gradient(90deg, #5A3D9A, #7C5CBF) !important;
        color: #fff !important; padding: 12px 10px !important;
        font-size: 10px !important; font-weight: 800 !important;
        text-transform: uppercase !important; letter-spacing: 0.7px !important;
        text-align: left !important; border: none !important;
        white-space: nowrap !important;
      }
      #resultTable tbody td {
        padding: 11px 10px !important; border: none !important;
        border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        color: #C8C4E0 !important; vertical-align: middle !important;
        font-size: 12px !important; background: transparent !important;
      }
      #resultTable tbody tr:last-child td { border-bottom: none !important; }
      #resultTable tbody tr:hover td {
        background: rgba(124,92,191,0.08) !important;
      }

      /* Toastr custom */
      .toast-top-right { top: 24px !important; right: 12px !important; }
      .toast {
        background: #1E1A3A !important;
        border: 1px solid rgba(124,92,191,0.35) !important;
        border-radius: 14px !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif !important;
        color: #E8E6F0 !important;
      }
      .toast-success { border-left: 3px solid #69D97A !important; }
      .toast-error { border-left: 3px solid #FF6B6B !important; }
      .toast-progress { background: #7C5CBF !important; }

      /* Datepicker UI */
      #ui-datepicker-div {
        background: #1E1A3A !important;
        border: 1px solid rgba(124,92,191,0.35) !important;
        border-radius: 14px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45) !important;
        padding: 12px !important; font-size: 13px !important;
        color: #E8E6F0 !important;
      }
      .ui-datepicker-header {
        background: transparent !important; border: none !important;
        color: #A98EE0 !important; font-weight: 700 !important;
        padding: 4px 0 10px !important;
      }
      .ui-datepicker-prev, .ui-datepicker-next {
        background: rgba(124,92,191,0.15) !important;
        border: 1px solid rgba(124,92,191,0.25) !important;
        border-radius: 8px !important; color: #A98EE0 !important;
        cursor: pointer !important; top: 2px !important;
      }
      .ui-datepicker-calendar th {
        color: #7C5CBF !important; font-size: 10px !important;
        font-weight: 800 !important; text-transform: uppercase !important;
        padding: 4px !important; border: none !important;
        background: transparent !important;
      }
      .ui-datepicker-calendar td a, .ui-datepicker-calendar td span {
        color: #C8C4E0 !important; background: transparent !important;
        border: none !important; border-radius: 8px !important;
        text-align: center !important; padding: 5px 4px !important;
        font-size: 13px !important;
      }
      .ui-datepicker-calendar td a:hover {
        background: rgba(124,92,191,0.25) !important; color: #fff !important;
      }
      .ui-datepicker-calendar .ui-datepicker-today a {
        background: rgba(124,92,191,0.20) !important; color: #A98EE0 !important;
        font-weight: 700 !important;
      }
      .ui-datepicker-calendar .ui-state-active {
        background: #7C5CBF !important; color: #fff !important; font-weight: 700 !important;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 3px !important; height: 3px !important; }
      ::-webkit-scrollbar-track { background: transparent !important; }
      ::-webkit-scrollbar-thumb { background: #3D3570 !important; border-radius: 4px !important; }
    \`;
    document.head.appendChild(s);

    // Pull-to-refresh
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

export default function MontoScreen() {
  const hasLoadedOnce = useRef(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [postOverlay, setPostOverlay] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (nav: WebViewNavigation) => {
    if (!hasLoadedOnce.current) return;
    if (nav.loading) {
      setPostOverlay(true);
    }
  };

  const handleLoadEnd = () => {
    if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      setTimeout(() => setIsFirstLoad(false), 400);
      return;
    }
    setTimeout(() => setPostOverlay(false), 900);
  };

  return (
    <ThemedView style={styles.container}>
      {/* WebView siempre visible */}
      <WebView
        ref={webViewRef}
        source={{ uri: GENERAR_TICKET_URL }}
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
            <ThemedText style={styles.loadingTitle}>Generar Ticket</ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              Conectando con SUTRAN...
            </ThemedText>
          </View>
        </View>
      )}

      {/* Overlay POST — cubre el flash durante la búsqueda */}
      {postOverlay && (
        <View style={styles.postOverlay}>
          <View style={styles.searchingCard}>
            <ActivityIndicator size="large" color="#7C5CBF" />
            <ThemedText style={styles.searchingText}>Verificando infracción...</ThemedText>
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

  // POST overlay
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