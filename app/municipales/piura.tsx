import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CIUDAD = {
  url: 'http://www.munipiura.gob.pe/consulta-de-multas-de-transito',
};

const INJECTED_JS = `
(function() {

  function applyStyles() {

    /* ─── BODY ─── */
    document.body.style.cssText = 'background:#F4F6F8!important;margin:0!important;padding:0!important;font-family:-apple-system,BlinkMacSystemFont,sans-serif!important;';

    /* ─── OCULTAR TODO EXCEPTO EL FORMULARIO DE PLACA ─── */
    var selectores = [
      '.topmpp', '.logo', '.bguser', '.libre', '.libre1', '.libre2',
      '.libre3', '.libre4', '.libre5', '.lateral', '.clearfix',
      '.bgfooter', '.pie', '.icons', '.article-info',
      '.page-header', '.item-page > p', '.item-page > dl',
      'nav', 'footer', '.nav-tabs',
      '#buscar-por-nombres-o-apellidos',
      '#buscar-por-razon-social',
      '.rl_tabs-title', '.nn_tabs-title',
      'h2.rl_tabs-title'
    ];
    selectores.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.style.display = 'none';
      });
    });

    /* ─── MOSTRAR SOLO TAB DE PLACA ─── */
    var tabPlaca = document.querySelector('#buscar-por-placa');
    if (tabPlaca) {
      tabPlaca.removeAttribute('hidden');
      tabPlaca.style.cssText = 'display:block!important;';
    }

    /* ─── CONTENEDORES PRINCIPALES ─── */
    ['.container.marco', '.margen', '.contenido', '.col-sm-9', '.item-page'].forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.style.cssText = 'width:100%!important;max-width:100%!important;padding:0!important;margin:0!important;float:none!important;box-sizing:border-box!important;';
      });
    });

    /* ─── TÍTULO ─── */
    var titulo = document.querySelector('.page-header h2');
    if (titulo) {
      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'background:#455A64!important;border-radius:14px!important;padding:16px 18px!important;margin:16px 16px 14px!important;';
      titulo.style.cssText = 'color:#fff!important;font-size:16px!important;font-weight:700!important;margin:0!important;';
      titulo.parentNode.insertBefore(wrapper, titulo);
      wrapper.appendChild(titulo);
      wrapper.style.display = 'block';
      titulo.closest('.page-header') && (titulo.closest('.page-header').style.display = 'block');
    }

    /* ─── CARD FORMULARIO ─── */
    var tabContent = document.querySelector('.tab-content');
    if (tabContent) {
      tabContent.style.cssText = 'padding:0 16px 16px!important;margin:0!important;width:100%!important;box-sizing:border-box!important;';
    }
    var tabPane = document.querySelector('#buscar-por-placa');
    if (tabPane) {
      tabPane.style.cssText = 'display:block!important;background:#fff!important;border-radius:14px!important;padding:20px!important;box-shadow:0 2px 10px rgba(0,0,0,0.08)!important;box-sizing:border-box!important;width:100%!important;';
    }

    /* ─── TABLA DENTRO DEL FORM ─── */
    document.querySelectorAll('#buscar-por-placa table').forEach(function(el) {
      el.style.cssText = 'width:100%!important;border:none!important;';
    });
    document.querySelectorAll('#buscar-por-placa td').forEach(function(el) {
      el.style.cssText = 'padding:0!important;width:100%!important;display:block!important;';
    });
    document.querySelectorAll('#buscar-por-placa p').forEach(function(el) {
      el.style.cssText = 'display:flex!important;flex-direction:column!important;gap:12px!important;text-align:left!important;margin:0!important;font-size:11px!important;font-weight:700!important;color:#546E7A!important;text-transform:uppercase!important;letter-spacing:1px!important;';
    });

    /* ─── INPUT PLACA ─── */
    document.querySelectorAll('#buscar-por-placa input[type="text"]').forEach(function(el) {
      el.style.cssText = 'display:block!important;width:100%!important;height:54px!important;border:2px solid #CFD8DC!important;border-radius:10px!important;padding:0 16px!important;font-size:22px!important;font-weight:800!important;letter-spacing:5px!important;color:#1a1a2e!important;background:#F8FAFB!important;text-transform:uppercase!important;text-align:center!important;outline:none!important;box-shadow:none!important;box-sizing:border-box!important;margin:0!important;';
    });

    /* ─── BOTÓN BUSCAR ─── */
    document.querySelectorAll('#buscar-por-placa input[type="submit"]').forEach(function(el) {
      el.style.cssText = 'display:block!important;width:100%!important;height:52px!important;background:#455A64!important;color:#fff!important;border:none!important;border-radius:10px!important;font-size:15px!important;font-weight:700!important;letter-spacing:1.5px!important;text-transform:uppercase!important;cursor:pointer!important;box-sizing:border-box!important;margin:0!important;';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStyles);
  } else {
    applyStyles();
  }

  new MutationObserver(function() { applyStyles(); })
    .observe(document.body, { childList: true, subtree: true });

})();
true;
`;

export default function PiuraScreen() {
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