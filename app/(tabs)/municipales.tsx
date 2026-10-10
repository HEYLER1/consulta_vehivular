import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MUNICIPALES_CONFIG } from '@/constants/sites';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePlate } from '@/components/PlateContext';
import { MunicipalBatchSearch } from '@/components/MunicipalBatchSearch';
import { normalizeMunicipalPlate } from '@/utils/municipal-automation';
const FILTERS = [['all', 'Todas'], ['automatic', 'Automáticas'], ['manual', 'Con CAPTCHA'], ['unverified', 'Por verificar']] as const;
export default function MunicipalesScreen() {
  const { plate, setPlate } = usePlate();
  const [query, setQuery] = useState<{ plate: string; runId: string } | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const sources = Object.entries(MUNICIPALES_CONFIG);
  const consult = () => {
    const normalized = normalizeMunicipalPlate(plate);
    if (!/^[A-Z0-9]{6}$/.test(normalized)) { setError('Ingresa una placa de 6 letras o números.'); return; }
    setError(''); setQuery({ plate: normalized, runId: `${Date.now()}-${Math.random().toString(36).slice(2)}` });
  };
  return <ThemedView style={{ flex: 1, backgroundColor: theme.backgroundGris }}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={[styles.searchCard, { backgroundColor: theme.background }]}>
      <ThemedText style={styles.cardTitle}>Consultar por placa</ThemedText>
      <View style={[styles.inputWrap, { backgroundColor: theme.backgroundGris, borderColor: error ? '#DC3545' : theme.border }]}><View style={styles.plateCountry}><ThemedText style={styles.country}>PE</ThemedText></View><TextInput accessibilityLabel="Placa municipal" placeholder="A4D234" placeholderTextColor={theme.textoMuted} value={plate} onChangeText={text => { setPlate(text.toUpperCase()); setError(''); }} autoCapitalize="characters" autoCorrect={false} maxLength={7} style={[styles.input, { color: theme.textoTitulo }]} /></View>
      {!!error && <ThemedText accessibilityRole="alert" style={styles.error}>{error}</ThemedText>}
      <TouchableOpacity accessibilityRole="button" onPress={consult} activeOpacity={0.85} style={styles.button}><Ionicons name="search" size={21} color="#FFFFFF" /><ThemedText style={styles.buttonText}>Consultar municipios</ThemedText><Ionicons name="arrow-forward" size={20} color="#FFFFFF" /></TouchableOpacity>

    </View>
    {query && <MunicipalBatchSearch key={query.runId} plate={query.plate} runId={query.runId} />}
    <View style={styles.sectionHeader}><ThemedText style={styles.subtitle}>Municipios</ThemedText><ThemedText style={{ color: theme.textoMuted }}>{sources.length} fuentes</ThemedText></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{FILTERS.map(([value, label]) => <TouchableOpacity key={value} accessibilityRole="button" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.chip, { backgroundColor: filter === value ? '#26378B' : theme.background, borderColor: filter === value ? '#26378B' : theme.border }]}><ThemedText style={{ fontSize: 12, fontWeight: '700', color: filter === value ? '#FFFFFF' : theme.textoMuted }}>{label}</ThemedText></TouchableOpacity>)}</ScrollView>
    {sources.filter(([, c]) => filter === 'all' || (filter === 'unverified' ? !['automatic', 'manual'].includes(c.consultationMode ?? '') : c.consultationMode === filter)).map(([slug, config]) => {
      const automatic = config.consultationMode === 'automatic', manual = config.consultationMode === 'manual';
      const color = automatic ? '#087D70' : manual ? '#AF690C' : theme.textoMuted;
      return <TouchableOpacity accessibilityRole="button" key={slug} activeOpacity={0.75} style={[styles.source, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => router.push({ pathname: '/viewer/[category]/[slug]', params: { category: 'municipales', slug, plate: normalizeMunicipalPlate(plate) } })}>
        <View style={[styles.sourceIcon, { backgroundColor: theme.backgroundGris }]}><Ionicons name="business-outline" size={23} color={theme.tint} /></View><View style={{ flex: 1 }}><ThemedText style={styles.sourceTitle}>{config.title}</ThemedText><View style={styles.statusLine}><View style={[styles.dot, { backgroundColor: color }]} /><ThemedText style={{ fontSize: 12, color }}>{automatic ? 'Automática' : manual ? 'CAPTCHA' : 'Por verificar'}</ThemedText></View></View><Ionicons name="chevron-forward" size={19} color={theme.textoMuted} />
      </TouchableOpacity>;
    })}
  </ScrollView></ThemedView>;
}
const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 24 }, hero: { backgroundColor: '#172B58', padding: 24, borderRadius: 26, marginBottom: 18 }, heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, heroIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#304572', alignItems: 'center', justifyContent: 'center' }, eyebrow: { fontSize: 11, letterSpacing: 1.4, color: '#B9C9ED', fontWeight: '800' }, title: { fontSize: 34, lineHeight: 40, fontWeight: '800', color: '#FFFFFF', marginTop: 20 }, heroText: { color: '#D4DEF1', fontSize: 14, lineHeight: 21, marginTop: 10 }, heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20 }, badgeText: { color: '#8FE5D8', fontSize: 12, fontWeight: '700', flexShrink: 1 }, searchCard: { padding: 16, borderRadius: 18, marginBottom: 4 }, cardTitle: { fontSize: 18, fontWeight: '800' }, helper: { fontSize: 13, marginTop: 4 }, inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, marginVertical: 12, minHeight: 52 }, plateCountry: { paddingHorizontal: 17, borderRightWidth: 1, borderRightColor: '#CBD5E1' }, country: { fontSize: 13, fontWeight: '800', color: '#66809F' }, input: { flex: 1, paddingHorizontal: 18, fontSize: 24, letterSpacing: 2, fontWeight: '800', minHeight: 52 }, button: { backgroundColor: '#26378B', padding: 13, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }, buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, flex: 1 }, hint: { flexDirection: 'row', gap: 7, marginTop: 14 }, hintText: { fontSize: 12, lineHeight: 18, flex: 1 }, error: { color: '#DC3545', fontSize: 13, marginBottom: 12 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 10 }, subtitle: { fontSize: 18, fontWeight: '800' }, filters: { gap: 8, paddingBottom: 12 }, chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22, borderWidth: 1 }, source: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 }, sourceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, sourceTitle: { fontSize: 15, fontWeight: '700' }, statusLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }, dot: { width: 6, height: 6, borderRadius: 3 }, footer: { textAlign: 'center', fontSize: 12, marginTop: 14 },
});
