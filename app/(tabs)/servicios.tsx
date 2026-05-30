// app/(tabs)/servicios.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Linking } from 'react-native';

const AZUL_MTC = '#002B5C';
const ORO_PLACA = '#FFD600';
const BLANCO = '#FFFFFF';
const GRIS_FONDO = '#F4F7F9';
const TEXTO_MENU = '#1A1A2E';

const OPTIONS = [
  {
    icon: 'calendar-clock',
    title: 'Citas en Línea',
    subtitle: 'Reserva de turnos para trámites presenciales',
    color: '#607D8B',
  },
  {
    icon: 'help-circle-outline',
    title: 'Preguntas Frecuentes',
    subtitle: 'Guía rápida de ayuda al usuario vehicular',
    color: '#F57C00',
  },
  {
    icon: 'map-marker-radius-outline',
    title: 'Centros de Atención',
    subtitle: 'Ubica oficinas de SUNARP, SUTRAN y SAT',
    color: '#D32F2F',
  },
];

export default function ServiciosScreen() {
  const router = useRouter();

  const openWhatsApp = () => {
    const phoneNumber = '5191669273';
    const message = 'Hola, deseo realizar una consulta sobre trámites vehiculares.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) { Linking.openURL(url); } 
      else { alert("WhatsApp no está instalado."); }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.heroBanner}>
        <MaterialCommunityIcons name="star-circle" size={48} color={ORO_PLACA} />
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.heroTitle}>Atención al Ciudadano</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Canales de ayuda y servicios adicionales</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* WhatsApp Destacado */}
        <TouchableOpacity style={styles.whatsappCard} onPress={openWhatsApp} activeOpacity={0.8}>
          <View style={styles.whatsappIconBox}>
            <Ionicons name="logo-whatsapp" size={30} color={BLANCO} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.whatsappTitle}>Canal WhatsApp Oficial</ThemedText>
            <ThemedText style={styles.whatsappSubtitle}>Chatea con un asesor en tiempo real</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={BLANCO} />
        </TouchableOpacity>

        <ThemedText style={styles.sectionLabel}>Otros Trámites</ThemedText>
        
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

        <View style={styles.footerInfo}>
          <ThemedText style={styles.footerText}>
            App de consulta informativa de libre acceso. No representa a una entidad gubernamental específica.
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
  whatsappCard: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 6,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  whatsappIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  whatsappTitle: { color: BLANCO, fontSize: 16, fontWeight: '800' },
  whatsappSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '500' },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#546E7A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  cardContainer: { backgroundColor: BLANCO, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden' },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionTitle: { fontSize: 15, fontWeight: '800', color: TEXTO_MENU },
  optionSubtitle: { fontSize: 11, color: '#78909C', marginTop: 3, fontWeight: '600' },
  footerInfo: { marginTop: 30, alignItems: 'center', paddingHorizontal: 20 },
  footerText: { fontSize: 10, color: '#90A4AE', textAlign: 'center', fontStyle: 'italic', lineHeight: 16 },
});
