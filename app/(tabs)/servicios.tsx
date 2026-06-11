// app/(drawer)/servicios.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Linking, useColorScheme } from 'react-native';
import { OptionItem } from '@/components/OptionItem';
import { Colors } from '@/constants/theme';

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

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
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.heroBanner, { backgroundColor: theme.brandAzul }]}>
        <MaterialCommunityIcons name="star-circle" size={48} color={theme.brandOro} />
        <View style={{ flex: 1 }}>
          <ThemedText style={[styles.heroTitle, { color: theme.background }]}>Atención al Ciudadano</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Canales de ayuda y servicios adicionales</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* WhatsApp Destacado */}
        <TouchableOpacity style={styles.whatsappCard} onPress={openWhatsApp} activeOpacity={0.8}>
          <View style={styles.whatsappIconBox}>
            <Ionicons name="logo-whatsapp" size={30} color={theme.background} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.whatsappTitle, { color: theme.background }]}>Canal WhatsApp Oficial</ThemedText>
            <ThemedText style={styles.whatsappSubtitle}>Chatea con un asesor en tiempo real</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.background} />
        </TouchableOpacity>

        <ThemedText style={styles.sectionLabel}>Otros Trámites</ThemedText>
        
        <View style={[styles.cardContainer, { backgroundColor: theme.background }]}>
          {OPTIONS.map((item, index) => (
            <OptionItem
              key={index}
              icon={item.icon}
              iconType="MaterialCommunityIcons"
              title={item.title}
              subtitle={item.subtitle}
              color={item.color}
              isLast={index === OPTIONS.length - 1}
              onPress={() => {}}
            />
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
  container: { flex: 1 },
  heroBanner: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  heroTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
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
  whatsappTitle: { fontSize: 16, fontWeight: '800' },
  whatsappSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '500' },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#546E7A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  cardContainer: { borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden' },
  footerInfo: { marginTop: 30, alignItems: 'center', paddingHorizontal: 20 },
  footerText: { fontSize: 10, color: '#90A4AE', textAlign: 'center', fontStyle: 'italic', lineHeight: 16 },
});
