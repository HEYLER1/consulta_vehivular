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
  nav, .navbar, footer, .footer, #footer, .header, #header,
  header:not(.features-title),
  [class*="header"], [id*="header"],
  [class*="navbar"], [id*="navbar"],
  .top-bar, .bottom-bar,
  .links-panel, .col-lg-3, .col-md-3, .col-sm-3,
  .sidebar, #sidebar, .aside,
  .breadcrumb, .breadcrumbs,
  .site-header, .site-footer,
  .blue-bar, .papeletas-header, [style*="background-color: #337ab7"],
  [style*="background-color:#337ab7"], .header-site {
    display: none !important;
  }
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

export const COMMON_PAPELETAS_CSS = `
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

export const SUNARP_CONOCE_CSS = `
  ${COMMON_MUNICIPALES_CSS}
  body {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    background: #F8FAFC !important;
  }
  .navbar, .footer, .header, #header, #footer,
  .logo, .brand, .btn-regresar, .sidebar,
  .linea-arcoiris, img[src*="logo"],
  .menu-secundario, .site-logo {
    display: none !important;
  }
  .container, .main-content, #divPrincipal, form, .card {
    width: 100% !important;
    max-width: 450px !important;
    margin: 10px auto !important;
    border-radius: 20px !important;
  }
`;

export interface SiteConfig {
  url: string;
  title: string;
  subtitle?: string;
  icon?: string;
  color?: string;
  region?: string;
  injectedCSS?: string;
  injectedJS?: string;
  backgroundColor?: string;
  loadingColor?: string;
  showPostOverlay?: boolean;
  userAgent?: string;
  consultationMode?: "automatic" | "manual" | "unverified";
  consultationNote?: string;
}

export const CATEGORIES = {
  VEHICULAR: 'vehicular',
  PAPELETAS: 'papeletas',
  MUNICIPALES: 'municipales',
  SEGUROS: 'seguros',
  SEGURIDAD: 'seguridad',
  SERVICIOS: 'servicios',
};

// Fuentes candidatas: la respuesta real y la compatibilidad WebView se validan en el piloto.
export const MUNICIPALES_CONFIG: Record<string, SiteConfig> = {
  ica: { url: 'https://m.satica.gob.pe/consultapapeletas_web.php', title: 'SAT Ica', region: 'Sur', consultationMode: 'automatic' },
  chiclayo: { url: 'https://virtualsatch.satch.gob.pe/virtualsatch/record_infracciones/buscar_placa_', title: 'SATCH Chiclayo', region: 'Norte', consultationMode: 'automatic' },
  piura: { url: 'https://web.satp.gob.pe/servicios/consulta-en-linea', title: 'SAT Piura', region: 'Norte', consultationMode: 'automatic' },
  arequipa: { url: 'https://www.muniarequipa.gob.pe/oficina-virtual/c0nInfrPermisos/faltas/papeletas.php', title: 'Municipalidad de Arequipa', region: 'Sur', consultationMode: 'automatic', consultationNote: 'Consulta por placa. Si aparece una verificación de seguridad, continúa manualmente.' },
  cusco: { url: 'https://cusco.gob.pe/informatica/index.php/', title: 'Municipalidad del Cusco', region: 'Sur', consultationMode: 'automatic' },
  huanuco: { url: 'https://www.munihuanuco.gob.pe/wp-content/servicios/transportes/gt_papeletas.php', title: 'Municipalidad de Huánuco', region: 'Centro', consultationMode: 'automatic' },
  pucallpa: { url: 'http://consultas.municportillo.gob.pe:85/consultaVehiculo/consulta/', title: 'Municipalidad de Coronel Portillo (Pucallpa)', region: 'Oriente', consultationMode: 'automatic', consultationNote: 'El portal municipal usa HTTP.' },
  cajamarca: { url: 'https://www.satcajamarca.gob.pe/consultas?vplaca={plate}', title: 'SAT Cajamarca', region: 'Norte', consultationMode: 'automatic' },
  lima: { url: 'https://www.sat.gob.pe/VirtualSAT/modulos/papeletas.aspx', title: 'SAT Lima', region: 'Centro', consultationMode: 'unverified', consultationNote: 'El acceso usa una sesión y marcos. Automatización pendiente de verificación.' },
  callao: { url: 'https://pagopapeletascallao.pe/', title: 'Municipalidad del Callao', region: 'Centro', consultationMode: 'manual', consultationNote: 'Requiere código de seguridad (CAPTCHA).' },
  tacna: { url: 'https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas', title: 'Municipalidad de Tacna', region: 'Sur', consultationMode: 'manual', consultationNote: 'Requiere código de verificación (CAPTCHA).' },
  tarapoto: { url: 'https://www.sat-t.gob.pe/', title: 'SAT Tarapoto', region: 'Oriente', consultationMode: 'manual', consultationNote: 'El formulario contiene CAPTCHA.' },
  trujillo: { url: 'https://digital.satt.gob.pe/sigo/servicios/Record%20de%20Infracciones/registro.asp', title: 'SATT Trujillo', region: 'Norte', consultationMode: 'unverified', consultationNote: 'El formulario de destino no respondió durante la revisión.' },
  huancayo: { url: 'http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx', title: 'SAT Huancayo', region: 'Centro', consultationMode: 'unverified', consultationNote: 'El servidor rechazó la conexión durante la revisión.' },
  chachapoyas: { url: 'https://app.munichachapoyas.gob.pe/servicios/consulta_papeletas/app/papeletas.php', title: 'Municipalidad de Chachapoyas', region: 'Oriente', consultationMode: 'unverified', consultationNote: 'El portal agotó el tiempo de conexión. CAPTCHA sin verificar.' },
  andahuaylas: { url: 'https://muniandahuaylas.gob.pe/consultar-papeleta/', title: 'Municipalidad de Andahuaylas', region: 'Sur', consultationMode: 'unverified', consultationNote: 'El portal bloqueó el acceso durante la revisión (HTTP 403).' },
};

export const PAPELETAS_CONFIG: Record<string, SiteConfig> = {
  atu: { url: "https://pasarela.atu.gob.pe/", title: "ATU", subtitle: "Multas de transporte en Lima y Callao", icon: "bus-outline", color: "#26378B" },
  sat: { url: 'https://www.sat.gob.pe/VirtualSAT/modulos/papeletas.aspx', title: 'Papeletas Lima', subtitle: 'SAT Lima Infracciones', icon: 'file-document-outline', color: '#C8102E' },
  callao: { url: 'https://pagopapeletascallao.pe/', title: 'Papeletas Callao', subtitle: 'Infracciones Callao', icon: 'file-document-outline', color: '#C8102E' },
  sutran: { url: 'https://webexterno.sutran.gob.pe/WebExterno/Pages/frmRecordInfracciones.aspx', title: 'SUTRAN', subtitle: 'Récord de Infracciones', icon: 'highway', color: '#F57C00' },
  fotopit: { url: 'https://webexterno.sutran.gob.pe/WebExterno/Pages/frmPapeletasCinemometro.aspx', title: 'Foto Papeletas', subtitle: 'FotoPIT — Cinemómetros', icon: 'camera-outline', color: '#6A1B9A' },
  'orden-captura': { url: 'https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=', title: 'Orden de Captura', subtitle: 'Vehículos con captura SAT', icon: 'car-emergency', color: '#C8102E' },
};

export const VEHICULAR_CONFIG: Record<string, SiteConfig> = {
  sunarp: { url: 'https://www.sat.gob.pe/VirtualSAT/modulos/ConsultaVehicular.aspx', title: 'Consulta Vehicular', subtitle: 'SUNARP / SAT Lima', icon: 'search-outline', color: '#C8102E' },
  duenos: { url: 'https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio', title: 'Historial de Dueños', subtitle: 'SUNARP Conoce Aquí', icon: 'history', color: '#002B5C', userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36', injectedCSS: SUNARP_CONOCE_CSS },
  citv: { url: 'https://portal.mtc.gob.pe/servicios/consultas_citv.html', title: 'Inspección Técnica', subtitle: 'Estado de revisiones (CITV)', icon: 'hammer-outline', color: '#7B1FA2' },
  gnv: { url: 'https://www.infogas.com.pe/consultas/consulta-de-vehiculo/', title: 'Vigencia GNV/GLP', subtitle: 'Certificación de gas', icon: 'flame-outline', color: '#E64A19' },
};

export const SEGUROS_CONFIG: Record<string, SiteConfig> = {
  soat: { url: 'https://www.apeseg.org.pe/consultas-soat/', title: 'Consulta SOAT', subtitle: 'Vigencia en APESEG', icon: 'shield-check', color: '#2E7D32' },
  precios: { url: 'https://www.comparabien.com.pe/seguros-vehiculares', title: 'Precios Referenciales', subtitle: 'Comparativa de seguros', icon: 'tag-multiple-outline', color: '#002B5C' },
};

export const SEGURIDAD_CONFIG: Record<string, SiteConfig> = {
  lunas: { url: 'https://www.gob.pe/10041-consultar-estado-de-lunas-polarizadas', title: 'Lunas Polarizadas', subtitle: 'Vigencia PNP', icon: 'car-wash', color: '#002B5C' },
  robo: { url: 'https://www.pnp.gob.pe/servicios/requisitorias_robo', title: 'Requisitorias por Robo', subtitle: 'Orden de captura policial', icon: 'shield-search', color: '#C62828' },
};

export const APP_SITES: Record<string, Record<string, SiteConfig>> = {
  [CATEGORIES.VEHICULAR]: VEHICULAR_CONFIG,
  [CATEGORIES.PAPELETAS]: PAPELETAS_CONFIG,
  [CATEGORIES.MUNICIPALES]: MUNICIPALES_CONFIG,
  [CATEGORIES.SEGUROS]: SEGUROS_CONFIG,
  [CATEGORIES.SEGURIDAD]: SEGURIDAD_CONFIG,
};
