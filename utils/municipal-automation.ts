type MunicipalAdapter = { field: string; action: string; button?: string; result?: string; completion?: string; mode?: 'ajax' | 'query'; required?: string };
export const MUNICIPAL_ADAPTERS = {
  ica: { field: 'input[name="placa"]', action: '/resultadopapeleta_web.php' },
  chiclayo: { field: 'form#frm input[name="search"]', action: '/virtualsatch/record_infracciones/buscar_placa' },
  piura: { field: 'form[action="/consultas/papeletas_publico.php"] input[name="placa"]', action: '/consultas/papeletas_publico.php' },
  arequipa: { field: 'form.frm-search input#placa[name="placa"]', action: '/oficina-virtual/c0nInfrPermisos/faltas/buscar.php', button: '#btnConsultar', result: '#resultado', mode: 'ajax' },
  cusco: { field: 'input#tx_numero', action: '/informatica/index.php/', button: '#bt_consultar', result: '#ct_tabla', mode: 'ajax', required: 'input[name="rb_tipo"][value="P"]:checked' },
  huanuco: { field: 'form#consulta_placa input[name="placa"]', action: '/wp-content/servicios/transportes/gt_papeletas.php', button: '#consulta_placa button[type="submit"]', result: '#table_consulta_pit', completion: '#cargando2', mode: 'ajax' },
  pucallpa: { field: 'form[name="f1"] input[name="placa"]', action: '/consultaVehiculo/consulta/listParametros' },
  cajamarca: { field: '', action: '/consultas', result: '#contenido3', mode: 'query' },
} as const satisfies Record<string, MunicipalAdapter>;
export type AutoMunicipality = keyof typeof MUNICIPAL_ADAPTERS;
export function normalizeMunicipalPlate(value: string) { return value.toUpperCase().replace(/[^A-Z0-9]/g, ''); }
export function buildMunicipalAutomationScript(id: AutoMunicipality, value: string, runId: string, url: string): string {
  const plate = normalizeMunicipalPlate(value);
  if (!/^[A-Z0-9]{6}$/.test(plate)) return '';
  return `(function(){
    const cfg=${JSON.stringify(MUNICIPAL_ADAPTERS[id])}, plate=${JSON.stringify(plate)}, run=${JSON.stringify(runId)}, origin=${JSON.stringify(new URL(url).origin)};
    if(location.origin!==origin)return;
    if(window.__municipalObserver)window.__municipalObserver.disconnect();
    if(window.__municipalTimer)clearTimeout(window.__municipalTimer);
    const key='municipal-query-'+run, post=(status,message)=>window.ReactNativeWebView.postMessage(JSON.stringify({kind:'municipal',run,plate,status,message,url:location.href}));
    let terminal=false, submitted=false, sawLoading=false;
    const finish=(status,message)=>{if(terminal)return;terminal=true;post(status,message);if(window.__municipalObserver)window.__municipalObserver.disconnect();};
    const captcha=()=>!!document.querySelector('[id*="captcha" i],[class*="captcha" i],[name*="captcha" i],iframe[src*="recaptcha" i],iframe[src*="hcaptcha" i],img[src*="captcha" i],input[name*="codigoVerificacion" i],input[name="codigo"],input[name*="turnstile" i],[class*="turnstile" i],iframe[src*="challenges.cloudflare.com" i]');
    const check=()=>{
      if(terminal)return;
      if(captcha()){finish('manual','El portal solicita CAPTCHA. Completa la consulta manualmente.');return;}
      const body=(document.body.innerText||'').replace(/\\s+/g,' ').trim();
      let already=submitted;try{already=already||sessionStorage.getItem(key)==='sent';}catch(e){}
      const messages=[/El vehículo no cuenta con papeletas pendientes de pago/i,/Su búsqueda no produjo resultados[^!]*!?/i,/El contribuyente con placa [A-Z0-9-]+ no presenta papeletas registradas\\./i,/ESTE VEHICULO NO TIENE INFRACCIONES/i];
      const match=messages.map(r=>body.match(r)).find(Boolean);
      if(cfg.mode==='query'){
        const result=document.querySelector(cfg.result);
        if(location.pathname===cfg.action&&new URL(location.href).searchParams.get('vplaca')===plate&&result&&result.innerText.includes(plate)&&/RECORD DE VEH[IÍ]CULO/i.test(result.innerText))finish('result','Récord del vehículo disponible. Revisa el detalle del portal.');
        return;
      }
      const result=cfg.result?document.querySelector(cfg.result):null;
      const resultText=result?(result.innerText||'').replace(/\\s+/g,' ').trim():'';
      if(already&&cfg.completion){
        const spinner=document.querySelector(cfg.completion);
        if(spinner&&getComputedStyle(spinner).display!=='none')sawLoading=true;
        if(sawLoading&&spinner&&getComputedStyle(spinner).display==='none'&&result&&!result.querySelector('tbody tr')){finish('result','Consulta completada. La tabla del portal no muestra filas.');return;}
      }
      if(already&&result&&/LIBRE DE INFRACCIONES/i.test(resultText)){finish('result','LIBRE DE INFRACCIONES');return;}
      if(already&&result&&result.querySelectorAll('tr').length>1&&/papeleta|infracci[oó]n|importe/i.test(resultText)){finish('result','El portal presenta registros. Revisa el detalle de la fuente.');return;}
      if(already&&match){finish('result',match[0]+(/Warning:|Fatal error:|Notice:/i.test(body)?' (advertencia técnica del portal)':''));return;}
      if(already&&location.pathname===cfg.action&&Array.from(document.querySelectorAll('table')).some(t=>/papeleta|infracci[oó]n|importe|deuda/i.test(t.innerText)&&t.querySelectorAll('tr').length>1)){
        finish('result','El portal presenta registros. Revisa el detalle de la fuente.');return;
      }
      if(already)return;
      const fields=document.querySelectorAll(cfg.field);if(fields.length!==1)return;
      const field=fields[0],form=field.form;if(field.disabled||field.readOnly)return;
      if(cfg.required&&!document.querySelector(cfg.required)){finish('manual','Selecciona búsqueda por placa en el portal.');return;}
      if(!form&&cfg.mode!=='ajax')return;
      const action=new URL(form?form.action:location.href,location.href);if(action.origin!==origin||action.pathname!==cfg.action){finish('manual','El formulario cambió. Revisa la fuente manualmente.');return;}
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(field,plate);
      field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));
      const button=cfg.button?document.querySelector(cfg.button):form.querySelector('button[type="submit"],input[type="submit"]');if(!button||button.disabled)return;
      if(captcha()){finish('manual','El portal solicita CAPTCHA. Completa la consulta manualmente.');return;}
      if(form&&form.checkValidity&&!form.checkValidity()){finish('manual','El portal requiere datos adicionales.');return;}
      submitted=true;try{sessionStorage.setItem(key,'sent');}catch(e){}
      if(form)form.target='_self';post('submitted','Consulta enviada al portal');button.click();
    };
    window.__municipalObserver=new MutationObserver(check);window.__municipalObserver.observe(document.documentElement,{childList:true,subtree:true,attributes:true,characterData:true});
    window.__municipalTimer=setTimeout(()=>finish('manual','No se identificó un resultado. Revisa el portal.'),40000);
    if(!window.__municipalAlert){
      window.__municipalAlert=window.alert;
      window.alert=function(message){
        if(submitted&&/^No se encontraron resultados[.!]?$/i.test(String(message).trim())){finish('result',String(message));return;}
        if(submitted)finish('manual','El portal mostró un aviso: '+String(message).slice(0,350));
        return window.__municipalAlert.call(window,message);
      };
    }
    check();
  })();true;`;
}
