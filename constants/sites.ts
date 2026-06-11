export const PULL_TO_REFRESH_JS = `
  const THRESHOLD = 80;
  const MAX_PULL  = 100;
  const indicator = document.createElement('div');
  indicator.id = 'ptr-indicator';
  indicator.innerHTML = '<span id="ptr-arrow">↓</span><div id="ptr-spinner"></div>';
  document.body.prepend(indicator);
  const arrow = document.getElementById('ptr-arrow');
  const spinner = document.getElementById('ptr-spinner');
  let startY = 0, pulling = false, triggered = false;
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) { startY = e.touches[0].clientY; pulling = true; triggered = false; }
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
`;

export const COMMON_MUNICIPALES_CSS = `
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #F4F6F8 !important;
    color: #1a1a2e !important;
    margin: 0; padding: 0;
  }
  /* Aggressive but safe Hide for Headers and Footers */
  nav, .navbar, footer, .footer, #footer, .header, #header,
  header:not(.features-title),
  [class*="header"], [id*="header"],
  [class*="navbar"], [id*="navbar"],
  .top-bar, .bottom-bar,
  .links-panel, .col-lg-3, .col-md-3, .col-sm-3,
  .sidebar, #sidebar, .aside,
  .breadcrumb, .breadcrumbs,
  .site-header, .site-footer,
  /* Specific fix for Ica duplicate header */
  .blue-bar, .papeletas-header, [style*="background-color: #337ab7"],
  [style*="background-color:#337ab7"], .header-site {
    display: none !important;
  }
  /* Show only what we need - specific fix for Ica and others */
  .container-fluid, .container, main, #main, .main-content, #content, .content, #wrapper, .wrapper { 
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    padding: 16px !important; 
    max-width: 100% !important; 
    width: 100% !important; 
  }
  .features-title {
    background: linear-gradient(135deg, #1A237E, #0D47A1) !important;
    border-radius: 12px !important;
    padding: 18px 20px !important;
    margin-bottom: 20px !important;
  }
  .features-title h2 { color: #ffffff !important; font-size: 17px !important; font-weight: 700 !important; margin: 0 !important; }
  .frm-search {
    background: #ffffff !important; border-radius: 12px !important; padding: 20px !important;
    margin-bottom: 16px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
    display: flex !important; flex-direction: column !important; gap: 14px !important;
  }
  input[type="text"], #placa {
    width: 100% !important; height: 48px !important; border: 2px solid #CFD8DC !important;
    border-radius: 10px !important; padding: 0 16px !important; font-size: 18px !important;
    font-weight: 700 !important; color: #1a1a2e !important; background: #F8FAFB !important;
    text-transform: uppercase !important; outline: none !important;
  }
  #btnConsultar, button, input[type="submit"] {
    width: 100% !important; height: 50px !important; background: #1A237E !important;
    color: #ffffff !important; border: none !important; border-radius: 10px !important;
    font-size: 15px !important; font-weight: 700 !important; cursor: pointer !important;
  }
  table {
    width: 100% !important; border-collapse: collapse !important; background: #ffffff !important;
    border-radius: 12px !important; overflow: hidden !important; box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
  }
  thead tr { background: #1A237E !important; }
  thead th { color: #ffffff !important; padding: 12px 10px !important; font-size: 11px !important; text-transform: uppercase !important; }
  tbody td { padding: 12px 10px !important; color: #37474F !important; border-bottom: 1px solid #ECEFF1 !important; }
`;

export const JAEN_JS = `
  (function() {
    // Hide potential annoying elements
    const hideSelectors = ['header', 'footer', 'nav', '.navbar', '.top-bar', '.footer-bottom'];
    hideSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
    });

    // Style the main container
    const mainContainer = document.querySelector('.container, .main-content, #content');
    if (mainContainer) {
      mainContainer.style.padding = '16px';
      mainContainer.style.maxWidth = '100%';
    }

    // Pull to refresh
    ${PULL_TO_REFRESH_JS}
  })();
`;

export const JAEN_CSS = `
  ${COMMON_MUNICIPALES_CSS}
  /* Specific tweaks for Jaén if needed */
  .container { width: 100% !important; padding: 10px !important; }
  .btn-primary { background-color: #455A64 !important; border-color: #455A64 !important; }
`;

export const COMMON_PAPELETAS_CSS = `
  /* Aggressive Hide for Headers and Footers in Papeletas */
  header, footer, nav, .navbar, #header, #footer,
  [class*="header"], [id*="header"],
  [class*="nav"], [id*="nav"],
  [class*="footer"], [id*="footer"],
  .top-bar, .bottom-bar, .breadcrumb, .breadcrumbs {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body {
    background-color: transparent !important;
    padding-top: 0 !important;
    margin-top: 0 !important;
  }
`;

export interface SiteConfig {
  url: string;
  title: string;
  subtitle?: string;
  region?: string;
  injectedCSS?: string;
  injectedJS?: string;
  backgroundColor?: string;
  loadingColor?: string;
  showPostOverlay?: boolean;
  hasHeader?: boolean;
  userAgent?: string;
}

export const MUNICIPALES_CONFIG: Record<string, SiteConfig> = {
  arequipa: {
    url: 'https://www.muniarequipa.gob.pe/oficina-virtual/c0nInfrPermisos/faltas/papeletas.php',
    title: 'Arequipa',
    region: 'Sur',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  cusco: {
    url: 'https://cusco.gob.pe/informatica/index.php/',
    title: 'Cusco',
    region: 'Sur',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  huancayo: {
    url: 'https://www.munihuancayo.gob.pe/papeletas/',
    title: 'Huancayo',
    region: 'Centro',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  piura: {
    url: 'https://www.munipiura.gob.pe/papeletas/',
    title: 'Piura',
    region: 'Norte',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  puno: {
    url: 'https://papeletas.munipuno.gob.pe/',
    title: 'Puno',
    region: 'Sur',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  tacna: {
    url: 'https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas',
    title: 'Tacna',
    region: 'Sur',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  ica: {
    url: 'https://m.satica.gob.pe/consultapapeletas.php',
    title: 'Ica',
    region: 'Sur',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  trujillo: {
    url: 'https://www.munitrujillo.gob.pe/',
    title: 'Trujillo',
    region: 'Norte',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  chiclayo: {
    url: 'https://www.munichiclayo.gob.pe/',
    title: 'Chiclayo',
    region: 'Norte',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  iquitos: {
    url: 'https://www.mpl.gob.pe/',
    title: 'Iquitos',
    region: 'Selva',
    injectedCSS: COMMON_MUNICIPALES_CSS,
    injectedJS: PULL_TO_REFRESH_JS,
  },
  jaen: {
    url: 'https://apps.munijaen.gob.pe/servicios/multas-transito',
    title: 'Jaén',
    region: 'Norte',
    injectedCSS: JAEN_CSS,
    injectedJS: JAEN_JS,
  },
};

export const PAPELETAS_CONFIG: Record<string, SiteConfig> = {
  sat: {
    url: 'https://www.sat.gob.pe/VirtualSAT/modulos/papeletas.aspx?mysession=ctyOpc97k9I2Oo0TSsT%2fycAs%2fnt41gNGCvnbaCaJLQQ%3d',
    title: 'SAT Lima',
    subtitle: 'Conectando con la web oficial...',
    backgroundColor: '#12102A',
    loadingColor: '#7C5CBF',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
  sutran: {
    url: 'https://webexterno.sutran.gob.pe/WebExterno/Pages/frmRecordInfracciones.aspx',
    title: 'SUTRAN',
    subtitle: 'Conectando con la web oficial...',
    backgroundColor: '#12102A',
    loadingColor: '#7C5CBF',
    showPostOverlay: true,
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
  fotopit: {
    url: 'https://webexterno.sutran.gob.pe/WebExterno/Pages/frmPapeletasCinemometro.aspx',
    title: 'FotoPIT',
    subtitle: 'Conectando con SUTRAN...',
    backgroundColor: '#12102A',
    loadingColor: '#7C5CBF',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
  callao: {
    url: 'https://www.municallao.gob.pe/index.php/papeletas-transito',
    title: 'Papeletas Callao',
    subtitle: 'Conectando con la web oficial...',
    backgroundColor: '#12102A',
    loadingColor: '#E53935',
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
  'orden-captura': {
    url: 'https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=',
    title: 'Orden de Captura',
    subtitle: 'Consultando base de datos SAT...',
    backgroundColor: '#12102A',
    loadingColor: '#7C5CBF',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
  internamiento: {
    url: 'https://www.sat.gob.pe/VirtualSAT/modulos/ConsultaDeposito.aspx?mysession=',
    title: 'Internamiento',
    subtitle: 'Consultando depósitos SAT...',
    backgroundColor: '#12102A',
    loadingColor: '#7C5CBF',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
  monto: {
    url: 'https://webexterno.sutran.gob.pe/generarticket',
    title: 'Monto Infracción',
    subtitle: 'Generando ticket SUTRAN...',
    backgroundColor: '#12102A',
    loadingColor: '#7C5CBF',
    showPostOverlay: true,
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_PAPELETAS_CSS,
  },
};

export const SUNARP_CONOCE_CSS = `
  ${COMMON_MUNICIPALES_CSS}
  body {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    background: #F8FAFC !important;
  }
  /* Hide specific SUNARP Conoce Aqui elements */
  .navbar, .footer, .header, #header, #footer,
  .logo, .brand, .btn-regresar, .sidebar,
  .linea-arcoiris, img[src*="logo"],
  .menu-secundario, .site-logo {
    display: none !important;
  }
  /* Center the main content card */
  .container, .main-content, #divPrincipal, form, .card {
    width: 100% !important;
    max-width: 450px !important;
    margin: 10px auto !important;
    border-radius: 20px !important;
  }
`;

export const VEHICULAR_CONFIG: Record<string, SiteConfig> = {
  citv: {
    url: 'https://portal.mtc.gob.pe/servicios/consultas_citv.html',
    title: 'Inspección Técnica',
    subtitle: 'Consultando CITV (MTC)...',
    backgroundColor: '#002B5C',
    loadingColor: '#FFD600',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_MUNICIPALES_CSS,
  },
  gnv: {
    url: 'https://www.infogas.com.pe/consultas/consulta-de-vehiculo/',
    title: 'Certificado GNV/GLP',
    subtitle: 'Consultando Infogas...',
    backgroundColor: '#E64A19',
    loadingColor: '#ffffff',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: COMMON_MUNICIPALES_CSS,
  },
  duenos: {
    url: 'https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio',
    title: 'Historial de Dueños',
    subtitle: 'Conectando con SUNARP...',
    backgroundColor: '#D32F2F',
    loadingColor: '#ffffff',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    injectedJS: PULL_TO_REFRESH_JS,
    injectedCSS: SUNARP_CONOCE_CSS,
  }
};
