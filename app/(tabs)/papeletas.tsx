import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const OPTIONS = [
  {
    route: '/papeletas/sat',
    icon: 'business-outline' as const,
    title: 'Papeletas SAT',
    subtitle: 'Infracciones en Lima (SAT)',
    color: '#E53935',
    bg: '#FFEBEE',
  },
  {
    route: '/papeletas/sutran',
    icon: 'checkmark-circle-outline' as const,
    title: 'Record SUTRAN',
    subtitle: 'Historial de infracciones en carreteras',
    color: '#D32F2F',
    bg: '#FFEBEE',
  },
  {
    route: '/papeletas/monto',
    icon: 'cash-outline' as const,
    title: 'Monto de Multas',
    subtitle: 'Costo actual y descuentos disponibles',
    color: '#2E7D32',
    bg: '#E8F5E9',
  },
  {
    route: '/papeletas/atu',
    icon: 'bus-outline' as const,
    title: 'Multas ATU',
    subtitle: 'Infracciones de transporte urbano',
    color: '#1565C0',
    bg: '#E3F2FD',
  },
  {
    route: '/papeletas/fotopit',
    icon: 'camera-outline' as const,
    title: 'FotoPIT',
    subtitle: 'Fotomultas por cámaras de control',
    color: '#37474F',
    bg: '#ECEFF1',
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
            Consulta tus infracciones de tránsito y transporte
          </ThemedText>
        </View>

        {/* Cards */}
        <View style={styles.menuList}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.route}
              style={styles.optionCard}
              activeOpacity={0.75}
              onPress={() => router.push(opt.route as any)}
            >
                  <View style={[styles.iconBox, { backgroundColor: opt.bg }]}>
                  {MaterialCommunityIcons.hasOwnProperty(opt.icon) ? (
                    <MaterialCommunityIcons name={opt.icon as any} size={24} color={opt.color} />
                  ) : (
                    <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF0000" />
                  )}
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
  menuList: { gap: 12 },
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