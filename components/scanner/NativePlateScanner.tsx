import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';
import { Camera, runAsync, runAtTargetFps, useCameraDevice, useCameraFormat, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useTextRecognition } from 'react-native-vision-camera-ocr-plus';
import { useRunOnJS } from 'react-native-worklets-core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { candidatesInRegion, PlateConsensus, SCAN_REGION } from '../../utils/plate-recognition';
import type { OcrLine, PlateProgress } from '../../utils/plate-recognition';
import { ScannerMessage } from './ScannerMessage';
import type { PlateScannerProps } from './types';

const OCR_OPTIONS = { language: 'latin' as const, frameSkipThreshold: 1, useLightweightMode: true };

export default function NativePlateScanner({ onClose, onConfirm }: PlateScannerProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionAttempted, setPermissionAttempted] = useState(false);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [result, setResult] = useState<PlateProgress | null>(null);
  const [edited, setEdited] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [permissionError, setPermissionError] = useState('');
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  const receive = useCallback((value: PlateProgress) => {
    setResult(value); setEdited(value.plate); Vibration.vibrate(60);
  }, []);
  const askPermission = async () => {
    try { await requestPermission(); setPermissionAttempted(true); }
    catch { setPermissionError('No se pudo solicitar el permiso de cámara.'); }
  };
  if (!hasPermission) return <SafeAreaView style={styles.root}><View style={styles.panel}>
    <Text style={styles.title}>Permitir acceso a la cámara</Text>
    <Text style={styles.copy}>La cámara lee la placa en tu celular. No se guardan fotos ni se envía video.</Text>
    {!!permissionError && <Text style={styles.copy}>{permissionError}</Text>}
    <Action label={permissionAttempted ? 'Abrir ajustes' : 'Permitir cámara'} onPress={permissionAttempted ? () => { void Linking.openSettings().catch(() => setPermissionError('Abre los ajustes del teléfono y permite la cámara.')); } : () => { void askPermission(); }} />
    <Action secondary label="Volver" onPress={onClose} />
  </View></SafeAreaView>;
  if (result) return <SafeAreaView style={styles.root}><ScrollView contentContainerStyle={styles.panel} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Revisa la placa</Text>
    <Text style={styles.copy}>Comprueba las letras y los números antes de continuar.</Text>
    <TextInput accessibilityLabel="Placa detectada, editable" value={edited} onChangeText={text => setEdited(text.toUpperCase().replace(/[^A-Z0-9-]/g, ''))} autoCapitalize="characters" autoCorrect={false} maxLength={7} style={styles.plateInput} />
    {result.corrected && <Text style={styles.copy}>Se ajustó un carácter que podría confundirse con un número. Revísalo con atención.</Text>}
    <Action label="Usar esta placa" disabled={!/^[A-Z0-9]{2,4}-?[A-Z0-9]{2,4}$/.test(edited.trim())} onPress={() => onConfirm(edited.trim())} />
    <Action secondary label="Escanear de nuevo" onPress={() => { setResult(null); setAttempt(v => v + 1); }} />
    <Action secondary label="Cancelar" onPress={onClose} />
  </ScrollView></SafeAreaView>;
  if (!active) return <ScannerMessage onClose={onClose} message="La cámara está en pausa. Vuelve a la aplicación para continuar." />;
  return <LiveScanner key={attempt} onClose={onClose} onResult={receive} />;
}

function LiveScanner({ onClose, onResult }: { onClose: () => void; onResult: (value: PlateProgress) => void }) {
  const device = useCameraDevice('back', { physicalDevices: ['wide-angle-camera'] });
  const format = useCameraFormat(device, [{ videoResolution: { width: 1280, height: 720 } }, { fps: 30 }]);
  const camera = useRef<Camera>(null);
  const alive = useRef(true);
  const done = useRef(false);
  const consensus = useRef(new PlateConsensus());
  const ignoreUntil = useRef(0);
  const stats = useRef({ count: 0, meanMs: 0, start: Date.now() });
  const [progress, setProgress] = useState<PlateProgress | null>(null);
  const [torch, setTorch] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [targetFps, setTargetFps] = useState(4);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('Centra la placa y mantén el celular vertical.');
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const errors = useRef(0);
  const { scanText } = useTextRecognition(OCR_OPTIONS);
  const aspect = format ? Math.min(format.videoWidth, format.videoHeight) / Math.max(format.videoWidth, format.videoHeight) : 9 / 16;
  const previewWidth = Math.min(bounds.width, bounds.height * aspect);
  const previewHeight = previewWidth / aspect;
  useEffect(() => {
    alive.current = true;
    const timer = setTimeout(() => {
      if (alive.current && !done.current) setHint('Acércate, evita reflejos y toca la placa para enfocar. También puedes ingresarla manualmente.');
    }, 10000);
    return () => { alive.current = false; clearTimeout(timer); };
  }, []);
  const receive = useRunOnJS((lines: OcrLine[], width: number, height: number, started: number, elapsed: number, failed: boolean) => {
    if (!alive.current || done.current || started < ignoreUntil.current) return;
    if (failed) {
      errors.current += 1;
      consensus.current.reset(); setProgress(null);
      if (errors.current >= 3) setError('El lector no pudo procesar la cámara. Intenta abrirlo de nuevo o ingresa la placa manualmente.');
      return;
    }
    errors.current = 0;
    if (Date.now() - started > 2200) { consensus.current.reset(); setProgress(null); return; }
    const s = stats.current;
    s.count++; s.meanMs += (elapsed - s.meanMs) / s.count;
    if (s.count >= 4) setTargetFps(s.meanMs > 250 ? 2 : 4);
    const next = consensus.current.observe(candidatesInRegion(lines, width, height), started);
    setProgress(next);
    if (next?.ready) {
      done.current = true;
      if (__DEV__) console.info('[PlateScanner] Métricas sin datos de placa', { samples: s.count, meanOcrMs: Math.round(s.meanMs), timeToCandidateMs: Date.now() - s.start });
      onResult(next);
    }
  }, [onResult]);
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    runAtTargetFps(targetFps, () => {
      'worklet';
      // runAsync drops new work while busy; the preview never waits for OCR.
      runAsync(frame, () => {
        'worklet';
        const started = Date.now();
        try {
          const result = scanText(frame);
          const rotated = frame.orientation === 'landscape-left' || frame.orientation === 'landscape-right';
          const width = rotated ? frame.height : frame.width;
          const height = rotated ? frame.width : frame.height;
          const lines: OcrLine[] = [];
          for (const block of result?.blocks ?? []) {
            for (const line of block.lines ?? []) {
              const box = line.lineFrame;
              // Native center coordinates are reliable on both platforms; x/y differ upstream.
              lines.push({ text: line.lineText, cx: box.boundingCenterX, cy: box.boundingCenterY, width: box.width, height: box.height });
            }
          }
          receive(lines, width, height, started, Date.now() - started, false);
        } catch {
          receive([], 0, 0, started, Date.now() - started, true);
        }
      });
    });
  }, [scanText, targetFps, receive]);
  const zoom = device ? Math.min(device.maxZoom, Math.max(device.minZoom, device.neutralZoom * zoomFactor)) : 1;
  const focus = useCallback((x: number, y: number) => {
    ignoreUntil.current = Date.now() + 400;
    consensus.current.reset(); setProgress(null);
    if (device?.supportsFocus) void camera.current?.focus({ x, y }).catch(() => {
      if (alive.current) setHint('No se pudo fijar el enfoque. Acércate un poco o mejora la iluminación.');
    });
  }, [device?.supportsFocus]);
  const guide = useMemo(() => ({ left: previewWidth * SCAN_REGION.left, top: previewHeight * SCAN_REGION.top, width: previewWidth * SCAN_REGION.width, height: previewHeight * SCAN_REGION.height }), [previewWidth, previewHeight]);
  if (!device) return <ScannerMessage onClose={onClose} message="No se encontró una cámara trasera. Usa un celular con cámara o ingresa la placa manualmente." />;
  if (error) return <ScannerMessage onClose={onClose} message={error} />;
  return <SafeAreaView style={styles.root}>
    <View style={styles.header}><Text style={styles.title}>Escanear placa</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar escáner" onPress={onClose} hitSlop={12}><Text style={styles.close}>Cerrar</Text></Pressable></View>
    <Text accessibilityLiveRegion="polite" style={styles.hint}>{progress ? `Verificando ${progress.plate} · ${Math.min(progress.matches, progress.required)}/${progress.required}` : hint}</Text>
    <View style={styles.previewArea} onLayout={event => setBounds(event.nativeEvent.layout)}>
      {previewWidth > 0 && <View style={{ width: previewWidth, height: previewHeight }}>
        <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} format={format} fps={format ? Math.max(format.minFps, Math.min(30, format.maxFps)) : undefined} isActive pixelFormat="yuv" outputOrientation="preview" resizeMode="contain" frameProcessor={frameProcessor} torch={torch && device.hasTorch ? 'on' : 'off'} zoom={zoom} onStarted={() => focus(previewWidth / 2, previewHeight / 2)} onError={() => setError('No se pudo iniciar la cámara. Cierra el escáner e inténtalo de nuevo.')} />
        <Pressable accessibilityLabel="Tocar para enfocar" style={StyleSheet.absoluteFill} onPress={event => focus(event.nativeEvent.locationX, event.nativeEvent.locationY)}>
          <View pointerEvents="none" style={[styles.guide, guide, { borderColor: progress ? '#63E6BE' : '#F2C94C' }]} />
        </Pressable>
      </View>}
    </View>
    <View style={styles.controls}>
      {device.hasTorch && <Action secondary label={torch ? 'Apagar luz' : 'Encender luz'} onPress={() => { ignoreUntil.current = Date.now() + 400; consensus.current.reset(); setProgress(null); setTorch(v => !v); }} />}
      {device.maxZoom >= device.neutralZoom * 1.5 && <Action secondary label={zoomFactor === 1 ? 'Acercar 1.5×' : 'Volver a 1×'} onPress={() => { ignoreUntil.current = Date.now() + 400; consensus.current.reset(); setProgress(null); setZoomFactor(v => v === 1 ? 1.5 : 1); }} />}
    </View>
    <View style={styles.footer}><Text style={styles.small}>Lectura automática · Sin guardar fotos</Text><Action secondary label="Ingresar placa manualmente" onPress={onClose} /></View>
  </SafeAreaView>;
}
function Action({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} onPress={onPress} disabled={disabled} style={[styles.button, secondary && styles.secondary, disabled && { opacity: 0.4 }]}><Text style={[styles.buttonText, secondary && { color: '#FFF' }]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#081525' }, panel: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '700' }, close: { color: '#F2C94C', fontSize: 16, paddingVertical: 10 },
  copy: { color: '#CFD8E3', fontSize: 16, lineHeight: 24 }, hint: { color: '#CFD8E3', paddingHorizontal: 20, minHeight: 66, fontSize: 15, lineHeight: 22 },
  previewArea: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  guide: { position: 'absolute', borderWidth: 3, borderRadius: 14, backgroundColor: 'transparent' },
  controls: { flexDirection: 'row', justifyContent: 'center', padding: 12, gap: 12, flexWrap: 'wrap' },
  footer: { paddingHorizontal: 20, paddingBottom: 12, gap: 10 }, small: { textAlign: 'center', color: '#A5B4C5', fontSize: 12 },
  button: { backgroundColor: '#F2C94C', padding: 15, minHeight: 48, borderRadius: 12 }, secondary: { backgroundColor: '#20334C' },
  buttonText: { color: '#081525', textAlign: 'center', fontWeight: '700', fontSize: 15 },
  plateInput: { color: '#FFF', backgroundColor: '#20334C', borderRadius: 14, padding: 18, fontSize: 36, fontWeight: '800', textAlign: 'center' },
});
