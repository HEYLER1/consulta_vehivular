import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  url: 'http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx',
};

const INJECTED_JS = `
(function() {

  function applyStyles() {

    /* ─── BODY ─── */
    document.body.style.cssText = 'background:#F4F6F8!important;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';

    /* ─── OCULTAR NAV Y TABS ─── */
    ['nav','.nav','.main-nav','.tabs-pits','.clear'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    /* ─── CONTENEDOR ─── */
    var container = document.querySelector('.container');
    if (container) container.style.cssText = 'width:100%!important;max-width:100%!important;padding:16px!important;margin:0!important;box-sizing:border-box!important;';

    /* ─── SECTION WRAPPER ─── */
    var wrapper = document.querySelector('section.wrapper');
    if (wrapper) wrapper.style.cssText = 'width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;float:none!important;display:block!important;box-sizing:border-box!important;';

    /* ─── PORTADA ─── */
    var portada = document.querySelector('.portada');
    if (portada) portada.style.cssText = 'width:100%!important;background:#455A64!important;border-radius:14px!important;padding:16px 18px!important;margin-bottom:14px!important;box-sizing:border-box!important;display:block!important;';

    var titulo = document.querySelector('.portada-titulo');
    if (titulo) titulo.style.cssText = 'color:#fff!important;font-size:16px!important;font-weight:700!important;line-height:1.4!important;white-space:normal!important;margin:0!important;';

    /* ─── OCULTAR TAB PIT ─── */
    var tabs = document.querySelectorAll('.tab-itemContent');
    tabs.forEach(function(tab, i) {
      tab.style.cssText = i === 0 ? 'display:block!important;width:100%!important;' : 'display:none!important;';
    });

    /* ─── CARD FORMULARIO ─── */
    document.querySelectorAll('.itemContent-wrapper').forEach(function(el) {
      el.style.cssText = 'width:100%!important;max-width:100%!important;background:#fff!important;border-radius:14px!important;padding:20px!important;box-shadow:0 2px 10px rgba(0,0,0,0.08)!important;margin:0!important;float:none!important;box-sizing:border-box!important;display:block!important;';
    });

    /* ─── GRUPO FORM ─── */
    document.querySelectorAll('.group-form').forEach(function(el) {
      el.style.cssText = 'width:100%!important;display:flex!important;flex-direction:column!important;gap:12px!important;box-sizing:border-box!important;';
    });

    /* ─── SUBTÍTULO ─── */
    document.querySelectorAll('.subtitulo').forEach(function(el) {
      el.style.cssText = 'font-size:11px!important;font-weight:700!important;color:#546E7A!important;text-transform:uppercase!important;letter-spacing:1px!important;margin:0!important;';
    });

    /* ─── INPUT PLACA ─── */
    document.querySelectorAll('input.label, input[type="text"]').forEach(function(el) {
      el.style.cssText = 'display:block!important;width:100%!important;height:54px!important;border:2px solid #CFD8DC!important;border-radius:10px!important;padding:0 16px!important;font-size:22px!important;font-weight:800!important;letter-spacing:5px!important;color:#1a1a2e!important;background:#F8FAFB!important;text-transform:uppercase!important;text-align:center!important;outline:none!important;box-shadow:none!important;float:none!important;box-sizing:border-box!important;';
    });

    /* ─── BOTÓN BUSCAR ─── */
    document.querySelectorAll('input.button-pits, input[type="submit"]').forEach(function(el) {
      el.style.cssText = 'display:block!important;width:100%!important;height:52px!important;background:#455A64!important;color:#fff!important;border:none!important;border-radius:10px!important;font-size:15px!important;font-weight:700!important;letter-spacing:1.5px!important;text-transform:uppercase!important;cursor:pointer!important;float:none!important;box-sizing:border-box!important;margin:0!important;';
    });

    /* ─── TABLA ─── */
    document.querySelectorAll('table').forEach(function(el) {
      el.style.cssText = 'width:100%!important;border-collapse:collapse!important;background:#fff!important;border-radius:12px!important;overflow:hidden!important;box-shadow:0 2px 8px rgba(0,0,0,0.08)!important;font-size:12px!important;margin-top:14px!important;float:none!important;';
    });
    document.querySelectorAll('thead tr').forEach(function(el) {
      el.style.cssText = 'background:#455A64!important;';
    });
    document.querySelectorAll('thead th').forEach(function(el) {
      el.style.cssText = 'color:#fff!important;padding:10px 8px!important;font-size:10px!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:0.5px!important;text-align:left!important;';
    });
    document.querySelectorAll('tbody td').forEach(function(el) {
      el.style.cssText = 'padding:10px 8px!important;color:#37474F!important;font-size:12px!important;border-bottom:1px solid #ECEFF1!important;';
    });
  }

  /* Ejecutar al cargar y también observar cambios del DOM (tablas que carga AJAX) */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStyles);
  } else {
    applyStyles();
  }

  /* MutationObserver para re-aplicar cuando lleguen resultados AJAX */
  var observer = new MutationObserver(function() { applyStyles(); });
  observer.observe(document.body, { childList: true, subtree: true });

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
        injectedJavaScript={INJECTED_JS}
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