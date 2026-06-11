// app/(drawer)/seguridad.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { OptionItem } from '@/components/OptionItem';
import { Colors } from '@/constants/theme';

const OPTIONS = [
  {
    slug: 'lunas',
    icon: 'car-wash',
    title: 'Lunas Polarizadas',
    subtitle: 'Consulta de estado y vigencia PNP',
    color: '#002B5C',
  },
  {
    slug: 'robo',
    icon: 'shield-search',
    title: 'Requisitorias por Robo',
    subtitle: 'Verificar orden de captura policial',
    color: '#C62828',
  },
  {
    slug: 'denuncias',
    icon: 'file-document-edit-outline',
    title: 'Denuncias Policiales',
    subtitle: 'Copia certificada de denuncias por pérdida',
    color: '#455A64',
  },
];

export default function SeguridadScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.heroBanner, { backgroundColor: theme.brandAzul }]}>
        <MaterialCommunityIcons name="police-badge" size={48} color={theme.brandOro} />
        <View style={{ flex: 1 }}>
          <ThemedText style={[styles.heroTitle, { color: theme.background }]}>Seguridad PNP</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Trámites y alertas de la Policía Nacional</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.sectionLabel}>Consultas de Autoridad</ThemedText>
        
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
              onPress={() => router.push(`/viewer/seguridad/${item.slug}`)}
            />
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={theme.brandAzul} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.infoTitle}>DATO OFICIAL</ThemedText>
            <ThemedText style={styles.infoText}>
              El permiso de lunas oscurecidas ahora tiene vigencia indeterminada y está vinculado directamente al número de placa.
            </ThemedText>
          </View>
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
  infoBox: { marginTop: 25, backgroundColor: '#E1F5FE', padding: 20, borderRadius: 20, flexDirection: 'row', gap: 12 },
  infoTitle: { color: '#0277BD', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  infoText: { color: '#01579B', fontSize: 12, lineHeight: 18, fontWeight: '500' },
});
