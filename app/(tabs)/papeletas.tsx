// app/(tabs)/papeletas.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── Paleta Identidad Vehicular Perú ───────────────────────────────────────────
const AZUL_MTC       = '#002B5C';
const ORO_PLACA      = '#FFD600';
const ROJO_ALERTA    = '#C8102E';
const GRIS_FONDO     = '#F4F7F9';
const BLANCO         = '#FFFFFF';
const TEXTO_MENU     = '#1A1A2E';

const SECTIONS = [
  {
    label: 'Lima y Callao',
    options: [
      {
        route: '/papeletas/sat',
        icon: 'file-document-outline',
        title: 'Papeletas Lima',
        subtitle: 'SAT Lima Infracciones',
        color: ROJO_ALERTA,
        bg: '#FFEBEE',
      },
      {
        route: '/papeletas/callao',
        icon: 'file-document-outline',
        title: 'Papeletas Callao',
        subtitle: 'Infracciones Callao',
        color: ROJO_ALERTA,
        bg: '#FFEBEE',
      },
      {
        route: '/papeletas/orden-captura',
        icon: 'car-emergency',
        title: 'Orden de Captura',
        subtitle: 'Vehículos con captura SAT',
        color: ROJO_ALERTA,
        bg: '#FFEBEE',
      },
    ],
  },
  {
    label: 'Control de Velocidad',
    options: [
      {
        route: '/papeletas/fotopit',
        icon: 'camera-outline',
        title: 'Foto Papeletas',
        subtitle: 'FotoPIT — Cinemómetros',
        color: '#6A1B9A',
        bg: '#F3E5F5',
      },
    ],
  },
  {
    label: 'Transporte Nacional',
    options: [
      {
        route: '/papeletas/sutran',
        icon: 'highway',
        title: 'SUTRAN',
        subtitle: 'Récord de Infracciones',
        color: '#F57C00',
        bg: '#FFF3E0',
      },
      {
        route: '/papeletas/atu',
        icon: 'bus-outline',
        title: 'ATU',
        subtitle: 'Transporte Urbano',
        color: '#1565C0',
        bg: '#E3F2FD',
      },
    ],
  },
];

export default function PapeletasScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredSections = SECTIONS.map(section => ({
    ...section,
    options: section.options.filter(
      opt =>
        opt.title.toLowerCase().includes(search.toLowerCase()) ||
        opt.subtitle.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(section => section.options.length > 0);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ── BANNER DE ALERTA ── */}
      <View style={styles.alertBanner}>
        <View style={styles.alertContent}>
          <MaterialCommunityIcons name="alert-decagram" size={32} color={ORO_PLACA} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.alertTitle}>Control de Infracciones</ThemedText>
            <ThemedText style={styles.alertSubtitle}>Evita el internamiento de tu vehículo</ThemedText>
          </View>
        </View>
      </View>

      {/* ── BUSCADOR INTEGRADO ── */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#90A4AE" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="¿Qué infracción deseas consultar?"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#90A4AE"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#CFD8DC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredSections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#ECEFF1" />
            <ThemedText style={styles.emptyText}>No se encontraron servicios de consulta</ThemedText>
          </View>
        ) : (
          filteredSections.map((section, sIdx) => (
            <View key={sIdx} style={styles.section}>
              <ThemedText style={styles.sectionLabel}>{section.label}</ThemedText>
              <View style={styles.menuList}>
                {section.options.map((opt) => (
                  <TouchableOpacity
                    key={opt.route}
                    style={styles.optionCard}
                    activeOpacity={0.75}
                    onPress={() => router.push(opt.route as any)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: opt.color + '10' }]}>
                      <MaterialCommunityIcons name={opt.icon as any} size={24} color={opt.color} />
                    </View>
                    <View style={styles.textContainer}>
                      <ThemedText style={styles.optionTitle}>
                        {opt.title}
                      </ThemedText>
                      <ThemedText style={styles.optionSubtitle}>{opt.subtitle}</ThemedText>
                    </View>
                    <View style={styles.chevronWrap}>
                      <Ionicons name="chevron-forward" size={18} color="#B0BEC5" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}

        <View style={styles.noticeCard}>
          <Ionicons name="warning" size={20} color={ROJO_ALERTA} />
          <ThemedText style={styles.noticeText}>
            Las papeletas con orden de captura pueden resultar en el traslado inmediato del vehículo al depósito municipal.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GRIS_FONDO },

  alertBanner: {
    backgroundColor: AZUL_MTC,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  alertTitle: {
    color: BLANCO,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  alertSubtitle: {
    color: 'rgba(255,214,0,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },

  searchSection: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLANCO,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: { flex: 1, fontSize: 15, color: TEXTO_MENU, fontWeight: '500' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  section: { marginBottom: 25 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuList: { gap: 10 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLANCO,
    padding: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '800', color: TEXTO_MENU },
  optionSubtitle: { fontSize: 11, color: '#78909C', marginTop: 2, fontWeight: '600' },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F1',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: '#B71C1C',
    fontWeight: '600',
    lineHeight: 16,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
  },
});
