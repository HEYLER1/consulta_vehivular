# Filtra Tu Caña — Consulta Vehicular Perú

Aplicación Expo SDK 54 / React Native 0.81 para acceder a portales de consultas vehiculares. Incluye un escáner experimental de placas desde la cámara en vivo.

## Iniciar

```bash
npm ci
npm start
```

Las pantallas de consulta y la entrada manual siguen disponibles en Expo Go. **El escáner requiere la aplicación compilada**: VisionCamera y ML Kit no están incluidos en Expo Go. No basta con escanear el QR de Metro usando Expo Go.

## Escáner en vivo

Desde Inicio, toca **ESCANEAR PLACA**, permite la cámara y mantén el teléfono vertical. Coloca la línea de caracteres dentro del recuadro. Puedes tocar para enfocar, encender la luz y acercar 1.5×. El resultado se muestra en una pantalla editable; solo al pulsar **Usar esta placa** se actualiza el campo de Inicio. No se envían consultas automáticamente a los portales.

El objetivo inicial de prueba es un **Samsung Galaxy A54**. Estos ajustes no constituyen una medición de rendimiento en ese teléfono:

- Preferencia por cámara trasera principal y video de 1280×720; se elige el formato disponible más cercano.
- Vista previa de hasta 30 fps y OCR a un máximo de 4 lecturas/s, reducido a 2 cuando el tiempo medio supera 250 ms.
- Un único trabajo OCR asíncrono; los fotogramas nuevos se descartan si el lector sigue ocupado.
- OCR sobre el fotograma YUV nativo; **se filtran los resultados al recuadro, no se recortan los píxeles antes del OCR**. Se evita la ruta de recorte del paquete, que convierte a JPEG en Android.
- Tres lecturas independientes coincidentes, mínimo 450 ms entre la primera y la última, ventana de 2.2 s y al menos 80% de coincidencia. Si se corrige un carácter del sufijo numérico se exigen cinco lecturas.
- No se unen líneas distintas ni se cambia arbitrariamente el prefijo. Los formatos especiales, antiguos o de más de seis caracteres deben ingresarse manualmente.
- La cámara se desmonta al cerrar, pasar a segundo plano o revisar un resultado. Las lecturas pendientes de sesiones cerradas se ignoran.
- No se guardan fotos, no se suben fotogramas y no se registran números de placa. El modelo latino de Android se incluye en la compilación para evitar una descarga en la primera lectura.

### Dependencias y ajustes nativos

Se fijaron VisionCamera 4.7.3, Worklets Core 1.6.3 y OCR Plus 1.2.9. No actualizar automáticamente a VisionCamera 5/OCR Plus 2: tienen APIs diferentes. Worklets Core requiere tres complementos Babel que se declaran en `devDependencies`.

`npm ci` ejecuta `scripts/prepare-plate-ocr.cjs`, que verifica la versión del OCR, incorpora el modelo latino de Android y evita que respuestas de caché cuenten como nuevas lecturas. Los cambios son idempotentes y se reaplican al reinstalar. Si se instala con `--ignore-scripts`, ejecutar después `npm run postinstall` antes de compilar. No se utiliza el componente Camera del paquete OCR: su procesamiento síncrono se reemplaza por `runAsync`.

El mismo script alinea el NDK de Worklets Core con el de Expo para evitar instalar otro compilador nativo.

## Compilar para Android

En este equipo las herramientas se guardan en `.local-build/`, excluidas de Git. Para regenerar el APK de prueba para el A54:

```bash
npm run apk:local
```

El resultado se copia a `artifacts/consulta-vehicular-a54.apk`. Es una compilación ARM64 con firma de prueba y JavaScript incluido: se abre sin Expo Go ni Metro. La carpeta `.local-build/` contiene herramientas y cachés locales; no se distribuye dentro del APK. No contiene una prueba de cámara en un teléfono real.

Con Java 17 y Android SDK configurados, se puede abrir una sesión local conectando el celular:

```bash
npx expo run:android --device
```

También se incluye `eas.json` para una compilación en EAS (requiere cuenta Expo). El perfil `preview` genera un APK que puede abrirse sin Metro:

```bash
npx eas-cli build --platform android --profile preview
```

No publicar este APK como una versión de producción sin probarlo en dispositivos. iOS se configura con mínimo 16.0 para ML Kit, pero requiere compilación y pruebas propias en un iPhone.

## Comprobaciones

Con Node 22.6+ (las pruebas utilizan su soporte para TypeScript):

```bash
npm run test:scanner
npm run typecheck
npm run lint
npx expo install --check
```

El empaquetado JavaScript no comprueba el rendimiento de la cámara ni sustituye una compilación nativa.

### Prueba en Samsung A54

1. Instalar el APK de prueba. Conceder cámara y probar diez placas distintas, de cerca y con buena luz. Anotar placa real, lectura sugerida, correcciones necesarias y tiempo aproximado.
2. Repetir con sombra, reflejos y algo de inclinación. Probar luz y enfoque; no evaluar mientras se conduce.
3. Apuntar a texto que no sea una placa, colocar otra placa fuera del recuadro y mostrar dos dentro. No debería confirmarse una lectura ambigua.
4. Cerrar durante la lectura, reabrir, bloquear el celular y volver. No deberían reaparecer resultados anteriores.
5. Probar el lector en modo avión. Los portales de consulta sí necesitan internet.
6. En la compilación de desarrollo, al obtener un candidato la consola muestra `samples`, `meanOcrMs` y `timeToCandidateMs`, sin el número de placa. Usar esos datos para ajustar resolución/frecuencia después de medir.

## Limpieza anterior

Se retiraron nueve dependencias directas sin uso (`@react-navigation/bottom-tabs`, `@react-navigation/elements`, `expo-file-system`, `expo-haptics`, `expo-image`, `expo-image-manipulator`, `expo-symbols`, `expo-web-browser`, `react-native-gesture-handler`) y siete componentes de ejemplo. Expo conserva las dependencias transitivas que necesita. Las dependencias nuevas descritas arriba se usan en el escáner.

## Referencias

- [VisionCamera](https://github.com/mrousavy/react-native-vision-camera)
- [OCR Plus](https://github.com/jamenamcinteer/react-native-vision-camera-ocr-plus)
- [Compilaciones de desarrollo de Expo](https://docs.expo.dev/develop/development-builds/introduction/)

La aplicación facilita el acceso a portales públicos y no representa a entidades gubernamentales.

## Piloto de investigación versión 1.0.1

El menú municipal se genera desde la configuración y contiene SAT Lima, SATCH Chiclayo, SAT Ica y SAT Piura como fuentes candidatas. Las fuentes pendientes no aparecen como consultas disponibles. El piloto deberá confirmar disponibilidad, búsqueda equivalente y compatibilidad WebView en el teléfono.

La placa de Inicio se conserva durante la sesión y llega a los visores. El relleno automático solo intenta un campo identificado como placa; no reemplaza valores existentes ni envía formularios. Revisar siempre el campo antes de consultar. Los iframes de otros dominios y campos ambiguos requieren entrada manual. Se retiró el historial de ejemplo.

La guía, protocolo actualizado, inventario, planes e instrumentos están en `piloto/`. Para las mediciones principales se usa ingreso manual, sin OCR. El APK nuevo se encuentra en `artifacts/consulta-vehicular-a54.apk`; el archivo antiguo de la raíz no contiene estos cambios. La ficha de versión conserva hashes y archivos de código; cualquier modificación posterior requiere una nueva congelación antes de medir.

Prueba adicional del relleno de placa:

```bash
node --experimental-strip-types --test tests/plate-autofill.test.mjs
```
