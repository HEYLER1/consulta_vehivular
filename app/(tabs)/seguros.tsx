// app/(drawer)/seguros.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { OptionItem } from '@/components/OptionItem';
import { Colors } from '@/constants/theme';

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
    color: '#002B5C',
  },
  {
    icon: 'car-emergency',
    title: 'Choques y Siniestros',
    subtitle: 'Protocolo de acción ante accidentes',
    color: '#C62828',
  },
];

export default function SegurosScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.heroBanner, { backgroundColor: theme.brandAzul }]}>
        <MaterialCommunityIcons name="shield-lock" size={48} color={theme.brandOro} />
        <View style={{ flex: 1 }}>
          <ThemedText style={[styles.heroTitle, { color: theme.background }]}>Protección Vehicular</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Gestiona tu SOAT y seguros privados</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.sectionLabel}>Servicios de Aseguradoras</ThemedText>
        
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
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#546E7A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  cardContainer: { borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden' },
  emergencyBox: { marginTop: 25, backgroundColor: '#FFF1F1', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  emergencyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  emergencyTitle: { color: '#B71C1C', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  emergencyText: { color: '#D32F2F', fontSize: 12, lineHeight: 18, fontWeight: '500' },
});
