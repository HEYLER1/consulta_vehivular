// app/(tabs)/seguros.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

const AZUL_MTC = '#002B5C';
const ORO_PLACA = '#FFD600';
const BLANCO = '#FFFFFF';
const GRIS_FONDO = '#F4F7F9';
const TEXTO_MENU = '#1A1A2E';

const OPTIONS = [
  {
    icon: 'shield-check',
    title: 'Consulta SOAT (APESEG)',
    subtitle: 'Verifica la vigencia de tu seguro obligatorio',
    color: '#2E7D32',
  },
  {
    icon: 'tag-multiple-outline',
    title: 'Precios Referenciales',
    subtitle: 'Costos aproximados de seguros vehiculares',
    color: AZUL_MTC,
  },
  {
    icon: 'car-emergency',
    title: 'Choques y Siniestros',
    subtitle: 'Protocolo de acción ante accidentes',
    color: '#C62828',
  },
];

export default function SegurosScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.heroBanner}>
        <MaterialCommunityIcons name="shield-lock" size={48} color={ORO_PLACA} />
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.heroTitle}>Protección Vehicular</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Gestiona tu SOAT y seguros privados</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.sectionLabel}>Servicios de Aseguradoras</ThemedText>
        
        <View style={styles.cardContainer}>
          {OPTIONS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.optionCard, index === OPTIONS.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '10' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={26} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.optionTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.optionSubtitle}>{item.subtitle}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B0BEC5" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emergencyBox}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="call" size={18} color="#B71C1C" />
            <ThemedText style={styles.emergencyTitle}>ASISTENCIA 24/7</ThemedText>
          </View>
          <ThemedText style={styles.emergencyText}>
            En caso de emergencia grave en carretera, comunícate con la Policía de Carreteras marcando al <ThemedText style={{ fontWeight: '900' }}>110</ThemedText>.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GRIS_FONDO },
  heroBanner: {
    backgroundColor: AZUL_MTC,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  heroTitle: { color: BLANCO, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  heroSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  scrollContent: { padding: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#546E7A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  cardContainer: { backgroundColor: BLANCO, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden' },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionTitle: { fontSize: 15, fontWeight: '800', color: TEXTO_MENU },
  optionSubtitle: { fontSize: 11, color: '#78909C', marginTop: 3, fontWeight: '600' },
  emergencyBox: { marginTop: 25, backgroundColor: '#FFF1F1', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  emergencyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  emergencyTitle: { color: '#B71C1C', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  emergencyText: { color: '#D32F2F', fontSize: 12, lineHeight: 18, fontWeight: '500' },
});
