import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const SECTIONS = [
  {
    label: 'Lima y Callao',
    options: [
      {
        route: '/papeletas/sat',
        icon: 'file-document-outline' as const,
        title: 'Papeletas Lima',
        subtitle: 'Infracciones de tránsito en Lima',
        color: '#E53935',
        bg: '#FFEBEE',
      },
      {
        route: '/papeletas/callao',
        icon: 'file-document-outline' as const,
        title: 'Papeletas Callao',
        subtitle: 'Infracciones de tránsito en el Callao',
        color: '#E53935',
        bg: '#FFEBEE',
      },
      {
        route: '/papeletas/orden-captura',
        icon: 'car-emergency' as const,
        title: 'Orden de Captura',
        subtitle: 'Vehículos con orden de captura SAT',
        color: '#E53935',
        bg: '#FFEBEE',
      },
      {
        route: '/papeletas/internamiento',
        icon: 'garage' as const,
        title: 'Internamiento',
        subtitle: 'Vehículos internados por la SAT',
        color: '#E53935',
        bg: '#FFEBEE',
      },
    ],
  },
  {
    label: 'Fotomultas',
    options: [
      {
        route: '/papeletas/fotopit',
        icon: 'camera-outline' as const,
        title: 'Foto Papeletas — FotoPIT',
        subtitle: 'Fotomultas por cámaras de control',
        color: '#6A1B9A',
        bg: '#F3E5F5',
      },
    ],
  },
  {
    label: 'Transporte',
    options: [
      {
        route: '/papeletas/sutran',
        icon: 'highway' as const,
        title: 'SUTRAN',
        subtitle: 'Infracciones en carreteras nacionales',
        color: '#F57C00',
        bg: '#FFF3E0',
      },
      {
        route: '/papeletas/monto',
        icon: 'cash-multiple' as const,
        title: 'Monto Infracción',
        subtitle: 'Generar ticket de pago SUTRAN',
        color: '#F57C00',
        bg: '#FFF3E0',
      },
      {
        route: '/papeletas/atu',
        icon: 'bus-outline' as const,
        title: 'ATU',
        subtitle: 'Infracciones de transporte urbano',
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

      {/* Header simplificado */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Infracciones y Multas</ThemedText>
        <ThemedText style={styles.subtitle}>
          Consulta tus papeletas de tránsito y transporte
        </ThemedText>
      </View>

      {/* Buscador */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar (Lima, SUTRAN, Foto...)"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#bbb"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
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
            <Ionicons name="search-outline" size={48} color="#ddd" />
            <ThemedText style={styles.emptyText}>No se encontró ninguna opción</ThemedText>
          </View>
        ) : (
          filteredSections.map((section) => (
            <View key={section.label} style={styles.section}>
              <ThemedText style={styles.sectionLabel}>{section.label}</ThemedText>
              <View style={styles.menuList}>
                {section.options.map((opt) => (
                  <TouchableOpacity
                    key={opt.route}
                    style={styles.optionCard}
                    activeOpacity={0.75}
                    onPress={() => router.push(opt.route as any)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: opt.bg }]}>
                      <MaterialCommunityIcons name={opt.icon as any} size={24} color={opt.color} />
                    </View>
                    <View style={styles.textContainer}>
                      <ThemedText style={[styles.optionTitle, { color: '#1A1A1A' }]}>
                        {opt.title}
                      </ThemedText>
                      <ThemedText style={styles.optionSubtitle}>{opt.subtitle}</ThemedText>
                    </View>
                    <View style={[styles.chevronBox, { backgroundColor: opt.bg }]}>
                      <Ionicons name="chevron-forward" size={16} color={opt.color} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: {
    opacity: 0.5,
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  input: { flex: 1, fontSize: 15, color: '#333' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#888',
    marginBottom: 8,
    marginLeft: 4,
  },
  menuList: { gap: 10 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '600' },
  optionSubtitle: { fontSize: 12, color: '#888', marginTop: 3 },
  chevronBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.4,
  },
});