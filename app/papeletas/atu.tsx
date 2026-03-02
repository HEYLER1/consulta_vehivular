// papeletas/atu.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ATUScreen() {
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsulta = () => {
    if (!placa.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { borderLeftColor: '#1565C0' }]}>
          <Ionicons name="bus-outline" size={20} color="#1565C0" />
          <ThemedText style={styles.bannerText}>
            Consulta las multas emitidas por la ATU a vehículos de transporte público urbano en Lima y Callao.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Buscar por placa del vehículo</ThemedText>
          <View style={styles.inputRow}>
            <Ionicons name="bus-outline" size={20} color="#888" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Ej: ABC-123"
              placeholderTextColor="#bbb"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
              maxLength={8}
            />
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#1565C0', opacity: placa ? 1 : 0.5 }]}
            onPress={handleConsulta}
            disabled={!placa.trim()}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <ThemedText style={styles.btnText}>Consultar Multas ATU</ThemedText>
            }
          </TouchableOpacity>
        </View>

        {/* Info extra */}
        <View style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>¿Quién puede consultar?</ThemedText>
          <ThemedText style={styles.infoItem}>• Empresas de transporte urbano</ThemedText>
          <ThemedText style={styles.infoItem}>• Propietarios de vehículos concesionados</ThemedText>
          <ThemedText style={styles.infoItem}>• Conductores habilitados por ATU</ThemedText>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="bus-outline" size={50} color="#ddd" />
          <ThemedText style={styles.emptyText}>
            Ingresa la placa del vehículo de transporte para ver sus infracciones
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  banner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#E3F2FD', borderLeftWidth: 4,
    borderRadius: 10, padding: 14, marginBottom: 20, gap: 10,
  },
  bannerText: { fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 14 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, backgroundColor: '#FAFAFA',
  },
  input: { flex: 1, fontSize: 15, color: '#333' },
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  infoCard: {
    backgroundColor: '#F8F9FA', borderRadius: 14, padding: 16,
    marginBottom: 20, gap: 6,
  },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  infoItem: { fontSize: 13, color: '#666' },
  emptyState: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  emptyText: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingHorizontal: 30 },
});