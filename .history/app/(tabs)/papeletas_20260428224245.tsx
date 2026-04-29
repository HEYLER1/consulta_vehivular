import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

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

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="file-document-outline" size={36} color="white" />
          </View>
          <ThemedText type="title" style={styles.title}>Infracciones y Multas</ThemedText>
          <ThemedText style={styles.subtitle}>
            Consulta tus papeletas de tránsito y transporte
          </ThemedText>
        </View>

        {/* Sections */}
        {SECTIONS.map((section) => (
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
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 6,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: {
    opacity: 0.55,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
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
});