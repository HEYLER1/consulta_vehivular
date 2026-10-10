import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { MUNICIPALES_CONFIG } from '@/constants/sites';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { AutoMunicipality, buildMunicipalAutomationScript, MUNICIPAL_ADAPTERS } from '@/utils/municipal-automation';
const SOURCES = Object.keys(MUNICIPAL_ADAPTERS) as AutoMunicipality[];
type Result = { status: string; message: string };
export function MunicipalBatchSearch({ plate, runId }: { plate: string; runId: string }) {
  const theme = Colors[useColorScheme() ?? 'light'];
  const [selected, setSelected] = useState<AutoMunicipality>('ica');
  const [results, setResults] = useState<Record<string, Result>>({});
  const finished = SOURCES.filter(id => results[id] && results[id].status !== 'submitted').length;
  const scheduled = SOURCES.slice(0, Math.min(SOURCES.length, 3 + finished));
  const sourceUrl = (id: AutoMunicipality) => MUNICIPALES_CONFIG[id].url.replace('{plate}', encodeURIComponent(plate));
  if (Platform.OS === 'web') return <ThemedText>La consulta automática está disponible en la app Android. Desde la web puedes abrir las fuentes individuales.</ThemedText>;
  return <View>
    <View style={styles.summary}><ThemedText style={styles.heading}>Resultados de {plate}</ThemedText><ThemedText style={{ color: theme.textoMuted, fontSize: 13 }}>{finished} de {SOURCES.length} fuentes completadas</ThemedText><View style={[styles.track, { backgroundColor: theme.border }]}><View style={[styles.progress, { width: `${finished / SOURCES.length * 100}%` }]} /></View></View>
    {SOURCES.map(id => <TouchableOpacity key={id} accessibilityRole="button" accessibilityState={{ selected: selected === id }} style={[styles.row, { backgroundColor: theme.background, borderColor: theme.border }, selected === id && styles.selected]} onPress={() => setSelected(id)}>
      <View style={[styles.resultIcon, { backgroundColor: theme.backgroundGris }]}><Ionicons name={results[id]?.status === 'error' ? 'alert-circle-outline' : results[id]?.status === 'manual' ? 'hand-left-outline' : results[id]?.status === 'result' ? 'document-text-outline' : 'time-outline'} size={22} color={results[id]?.status === 'error' ? '#D04848' : theme.tint} /></View><View style={{ flex: 1 }}><ThemedText style={styles.name}>{MUNICIPALES_CONFIG[id].title}</ThemedText><ThemedText style={[styles.message, { color: theme.textoMuted }]}>{results[id]?.message || (scheduled.includes(id) ? 'Consultando…' : 'En espera…')}</ThemedText></View>
      {(!results[id] || results[id].status === 'submitted') && <ActivityIndicator color="#26378B" />}
    </TouchableOpacity>)}
    <ThemedText style={styles.note}>Detalle del portal seleccionado. Cada municipio responde de forma independiente.</ThemedText>
    <View style={styles.portals}>{scheduled.map(id => <View key={id} pointerEvents={selected === id ? 'auto' : 'none'} style={[StyleSheet.absoluteFillObject, { opacity: selected === id ? 1 : 0, zIndex: selected === id ? 1 : 0 }]}>
      <TimedPortal source={{ uri: sourceUrl(id) }} javaScriptEnabled domStorageEnabled
        onTimeout={() => setResults(previous => previous[id] && previous[id].status !== "submitted" ? previous : ({ ...previous, [id]: { status: "error", message: "La fuente tardó demasiado. Abre su consulta individual para revisar." } }))}
        injectedJavaScript={buildMunicipalAutomationScript(id, plate, runId, sourceUrl(id))}
        onMessage={event => { try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.kind !== 'municipal' || data.run !== runId || data.plate !== plate || new URL(data.url).origin !== new URL(sourceUrl(id)).origin || !['submitted', 'result', 'manual'].includes(data.status)) return;
          setResults(previous => ({ ...previous, [id]: { status: data.status, message: String(data.message).slice(0, 500) } }));
        } catch { /* Ignore unrelated messages. */ } }}
        onError={() => setResults(previous => ({ ...previous, [id]: { status: 'error', message: 'No se pudo conectar con la fuente.' } }))}
        onHttpError={event => { if (event.nativeEvent.url !== sourceUrl(id)) return; setResults(previous => ({ ...previous, [id]: { status: 'error', message: `El portal respondió con error ${event.nativeEvent.statusCode}.` } })); }}
        style={{ flex: 1 }} />
    </View>)}</View>
  </View>;
}
function TimedPortal({ onTimeout, ...props }: WebViewProps & { onTimeout: () => void }) {
  const timeoutRef = React.useRef(onTimeout);
  timeoutRef.current = onTimeout;
  useEffect(() => { const timer = setTimeout(() => timeoutRef.current(), 60000); return () => clearTimeout(timer); }, []);
  return <WebView {...props} />;
}
const styles = StyleSheet.create({
  summary: { marginTop: 20, marginBottom: 16 }, track: { height: 5, borderRadius: 4, overflow: 'hidden', marginTop: 12 }, progress: { height: 5, backgroundColor: '#0A9D8C' }, resultIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, heading: { fontSize: 21, fontWeight: '700', marginVertical: 14 },
  row: { padding: 16, borderWidth: 1, borderColor: '#CBD1DC', borderRadius: 18, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  selected: { borderColor: '#26378B', borderWidth: 2 }, name: { fontSize: 16, fontWeight: '700' }, message: { fontSize: 14, lineHeight: 20 },
  note: { fontSize: 13, marginVertical: 8 }, portals: { height: 460, borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFFFFF' },
});
