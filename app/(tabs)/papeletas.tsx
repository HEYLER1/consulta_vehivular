// app/(drawer)/papeletas.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { OptionItem } from '@/components/OptionItem';
import { Colors } from '@/constants/theme';

const SECTIONS = [
  {
    label: 'Lima y Callao',
    options: [
      {
        route: '/papeletas/sat',
        icon: 'file-document-outline',
        title: 'Papeletas Lima',
        subtitle: 'SAT Lima Infracciones',
        color: '#C8102E', // brandRojo
      },
      {
        route: '/papeletas/callao',
        icon: 'file-document-outline',
        title: 'Papeletas Callao',
        subtitle: 'Infracciones Callao',
        color: '#C8102E',
      },
      {
        route: '/papeletas/orden-captura',
        icon: 'car-emergency',
        title: 'Orden de Captura',
        subtitle: 'Vehículos con captura SAT',
        color: '#C8102E',
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
      },
      {
        route: '/papeletas/atu',
        icon: 'bus-outline',
        title: 'ATU',
        subtitle: 'Transporte Urbano',
        color: '#1565C0',
      },
    ],
  },
];

export default function PapeletasScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const filteredSections = SECTIONS.map(section => ({
    ...section,
    options: section.options.filter(
      opt =>
        opt.title.toLowerCase().includes(search.toLowerCase()) ||
        opt.subtitle.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(section => section.options.length > 0);

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle="light-content" />
      
      {/* ── BANNER DE ALERTA ── */}
      <View style={[styles.alertBanner, { backgroundColor: theme.brandAzul }]}>
        <View style={styles.alertContent}>
          <MaterialCommunityIcons name="alert-decagram" size={32} color={theme.brandOro} />
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.alertTitle, { color: theme.background }]}>Control de Infracciones</ThemedText>
            <ThemedText style={[styles.alertSubtitle, { color: theme.brandOro }]}>Evita el internamiento de tu vehículo</ThemedText>
          </View>
        </View>
      </View>

      {/* ── BUSCADOR INTEGRADO ── */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={20} color="#90A4AE" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="¿Qué infracción deseas consultar?"
            style={[styles.input, { color: theme.textoTitulo }]}
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
              <View style={[styles.menuList, { backgroundColor: theme.background }]}>
                {section.options.map((opt, iIdx) => (
                  <OptionItem
                    key={opt.route}
                    icon={opt.icon}
                    iconType="MaterialCommunityIcons"
                    title={opt.title}
                    subtitle={opt.subtitle}
                    color={opt.color}
                    isLast={iIdx === section.options.length - 1}
                    onPress={() => router.push(opt.route as any)}
                  />
                ))}
              </View>
            </View>
          ))
        )}

        <View style={styles.noticeCard}>
          <Ionicons name="warning" size={20} color={theme.brandRojo} />
          <ThemedText style={[styles.noticeText, { color: theme.brandRojo }]}>
            Las papeletas con orden de captura pueden resultar en el traslado inmediato del vehículo al depósito municipal.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  alertBanner: {
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
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  alertSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.85,
  },

  searchSection: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },

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
  menuList: {
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
