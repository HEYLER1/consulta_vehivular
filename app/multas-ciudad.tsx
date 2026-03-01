import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';

const CATEGORIAS = [
  { id: '1', label: 'Arbitrios', icon: 'home-outline', color: '#1565C0', bg: '#E3F2FD' },
  { id: '2', label: 'Multas de Tránsito', icon: 'car-outline', color: '#D32F2F', bg: '#FFEBEE' },
  { id: '3', label: 'Licencias y Permisos', icon: 'document-text-outline', color: '#2E7D32', bg: '#E8F5E9' },
  { id: '4', label: 'Infracciones Comerciales', icon: 'storefront-outline', color: '#E65100', bg: '#FFF3E0' },
];

export default function MultasCiudadScreen() {
  const { nombre, region } = useLocalSearchParams<{ nombre: string; region: string }>();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Back button + Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="city-variant-outline" size={35} color="white" />
        </View>
        <ThemedText type="title" style={styles.title}>{nombre}</ThemedText>
        <ThemedText style={styles.subtitle}>{region}</ThemedText>
      </View>

      {/* Categorías */}
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Selecciona una categoría
        </ThemedText>

        <View style={styles.grid}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.card} activeOpacity={0.7}>
              <View style={[styles.cardIcon, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
                {cat.label}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginTop: 4 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#455A64" />
          <ThemedText style={styles.infoText}>
            La información mostrada corresponde a la Municipalidad de {nombre}.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: '#455A64',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 5,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 },
  content: { padding: 20, gap: 16 },
  sectionTitle: { fontSize: 16, color: '#555', marginBottom: 4 },
  grid: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardLabel: { flex: 1, fontSize: 15, color: '#333' },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECEFF1',
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginTop: 8,
  },
  infoText: { flex: 1, fontSize: 13, color: '#546E7A' },
});