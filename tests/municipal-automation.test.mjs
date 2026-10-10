import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { buildMunicipalAutomationScript, normalizeMunicipalPlate } from '../utils/municipal-automation.ts';
const url='https://m.satica.gob.pe/consultapapeletas_web.php';
function execute({captcha=false,changedAction=false,body='',sent=false}={}) {
 let clicks=0;const messages=[];const saved=new Map(sent?[['municipal-query-test','sent']]:[]);
 class Input { get value(){return this.val;} set value(v){this.val=v;} dispatchEvent(){} }
 const input=new Input();const form={action:changedAction?'https://example.com/submit':'https://m.satica.gob.pe/resultadopapeleta_web.php',checkValidity:()=>true,querySelector:()=>({click(){clicks++;}})};input.form=form;
 const context={location:{origin:'https://m.satica.gob.pe',pathname:'/consultapapeletas_web.php',href:url},document:{body:{innerText:body},documentElement:{},querySelector:()=>captcha?{}:null,querySelectorAll:s=>s==='table'?[]:[input]},HTMLInputElement:Input,Event:class{},MutationObserver:class{observe(){}disconnect(){}},sessionStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},setTimeout:()=>0,clearTimeout:()=>{},URL};
 context.window={ReactNativeWebView:{postMessage:m=>messages.push(JSON.parse(m))}};
 vm.runInNewContext(buildMunicipalAutomationScript('ica','A4D234','test',url),context);
 return {clicks,messages,input,context};
}
test('normalizes and validates municipal plate',()=>{assert.equal(normalizeMunicipalPlate('a4d-234'),'A4D234');assert.equal(buildMunicipalAutomationScript('ica','bad','test',url),'');});
test('fills and submits correct official form once',()=>{const r=execute();assert.equal(r.input.value,'A4D234');assert.equal(r.clicks,1);assert.equal(r.messages[0].status,'submitted');vm.runInNewContext(buildMunicipalAutomationScript('ica','A4D234','test',url),r.context);assert.equal(r.clicks,1);});
test('CAPTCHA prevents automatic submission',()=>{const r=execute({captcha:true});assert.equal(r.clicks,0);assert.equal(r.messages[0].status,'manual');});
test('changed or foreign action prevents submission',()=>{const r=execute({changedAction:true});assert.equal(r.clicks,0);assert.equal(r.messages[0].status,'manual');});
test('recognizes only results after a submitted query and retains warning',()=>{const body='Warning: sizeof() El vehículo no cuenta con papeletas pendientes de pago';const r=execute({body,sent:true});assert.equal(r.clicks,0);assert.equal(r.messages[0].status,'result');assert.match(r.messages[0].message,/advertencia/);assert.equal(execute({body}).messages[0].status,'submitted');});
function executeAdapter(id,{captcha=false,body='',sent=false,queryPlate='A4D234',complete=false}={}) {
 const pages={arequipa:['https://www.muniarequipa.gob.pe','/oficina-virtual/c0nInfrPermisos/faltas/papeletas.php','/oficina-virtual/c0nInfrPermisos/faltas/buscar.php'],cusco:['https://cusco.gob.pe','/informatica/index.php/','/informatica/index.php/'],huanuco:['https://www.munihuanuco.gob.pe','/wp-content/servicios/transportes/gt_papeletas.php','/wp-content/servicios/transportes/gt_papeletas.php'],pucallpa:['http://consultas.municportillo.gob.pe:85','/consultaVehiculo/consulta/','/consultaVehiculo/consulta/listParametros'],cajamarca:['https://www.satcajamarca.gob.pe','/consultas','/consultas']};
 const [origin,path,action]=pages[id],url=origin+path+(id==='cajamarca'?'?vplaca='+queryPlate:'');
 let clicks=0,change;const messages=[],storage=new Map(sent?[['municipal-query-test','sent']]:[]);
 class Input{get value(){return this.val;}set value(v){this.val=v;}dispatchEvent(){}}
 const input=new Input();input.form=id==='cusco'?null:{action:origin+action,querySelector:()=>button,checkValidity:()=>true};
 const button={click(){clicks++;}};
 const result={innerText:body,querySelectorAll:()=>[],querySelector:()=>null};
 const spinner={};
 const context={location:{origin,pathname:path,href:url},document:{body:{innerText:body},documentElement:{},querySelector(sel){if(sel.includes('captcha'))return captcha?{}:null;if(sel.includes('rb_tipo'))return {};if(sel.includes('btnConsultar')||sel.includes('bt_consultar')||sel.includes('button[type'))return button;if(sel==='#cargando2')return spinner;return result;},querySelectorAll:s=>s==='table'?[]:[input]},HTMLInputElement:Input,Event:class{},MutationObserver:class{constructor(fn){change=fn;}observe(){}disconnect(){}},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout:()=>{},getComputedStyle:()=>({display:complete?'none':'block'}),URL};
 context.window={alert(){},ReactNativeWebView:{postMessage:m=>messages.push(JSON.parse(m))}};
 vm.runInNewContext(buildMunicipalAutomationScript(id,'A4D234','test',url),context);
 return {clicks,messages,input,context,change,result,spinner};
}
for(const id of ['arequipa','cusco','huanuco','pucallpa']){
 test(id+' submits the reviewed plate form once',()=>{const r=executeAdapter(id);assert.equal(r.clicks,1);assert.equal(r.input.value,'A4D234');r.change();assert.equal(r.clicks,1);});
 test(id+' stops when CAPTCHA is present',()=>{const r=executeAdapter(id,{captcha:true});assert.equal(r.clicks,0);assert.equal(r.messages[0].status,'manual');});
}
test('Cajamarca verifies query plate and record before reporting result',()=>{assert.equal(executeAdapter('cajamarca',{body:'Código: A4D234 RECORD DE VEHÍCULO'}).messages[0].status,'result');assert.equal(executeAdapter('cajamarca',{body:'Código: A4D234 RECORD DE VEHÍCULO',queryPlate:'OTHER1'}).messages.length,0);assert.equal(executeAdapter('cajamarca',{body:'Cuenta Tributaria A4D234'}).messages.length,0);});
test('Cusco result is accepted only after this query was submitted',()=>{assert.equal(executeAdapter('cusco',{body:'LIBRE DE INFRACCIONES',sent:true}).messages[0].status,'result');assert.equal(executeAdapter('cusco',{body:'LIBRE DE INFRACCIONES'}).messages[0].status,'submitted');});
test('Huánuco empty table requires observed loading completion',()=>{const r=executeAdapter('huanuco');assert.equal(r.messages[0].status,'submitted');r.change();r.context.getComputedStyle=()=>({display:'none'});r.change();assert.equal(r.messages.at(-1).status,'result');assert.equal(executeAdapter('huanuco',{sent:true,complete:true}).messages.length,0);});

test('Arequipa reports the known result alert and preserves other alerts',()=>{const r=executeAdapter('arequipa');let alerts=0;r.context.window.__municipalAlert=()=>alerts++;r.context.window.alert('No se encontraron resultados');assert.equal(r.messages.at(-1).status,'result');assert.equal(alerts,0);r.context.window.alert('Error de conexión');assert.equal(alerts,1);});

test('AJAX error alert is manual and cannot become an empty-table result',()=>{const r=executeAdapter('huanuco');r.change();r.context.window.alert('Ocurrió un error al procesar la solicitud.');r.context.getComputedStyle=()=>({display:'none'});r.change();assert.equal(r.messages.at(-1).status,'manual');assert.match(r.messages.at(-1).message,/error/);});
