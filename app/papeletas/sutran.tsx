// papeletas/sutran.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SUTRANScreen() {
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
        <View style={[styles.banner, { borderLeftColor: '#D32F2F' }]}>
          <Ionicons name="information-circle-outline" size={20} color="#D32F2F" />
          <ThemedText style={styles.bannerText}>
            Consulta el historial de infracciones de tránsito en carreteras nacionales supervisadas por SUTRAN.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Buscar por placa o conductor</ThemedText>
          <View style={styles.inputRow}>
            <Ionicons name="car-sport-outline" size={20} color="#888" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Placa del vehículo"
              placeholderTextColor="#bbb"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
              maxLength={8}
            />
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#D32F2F', opacity: placa ? 1 : 0.5 }]}
            onPress={handleConsulta}
            disabled={!placa.trim()}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <ThemedText style={styles.btnText}>Ver Record SUTRAN</ThemedText>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={50} color="#ddd" />
          <ThemedText style={styles.emptyText}>
            Ingresa la placa para ver el historial de infracciones en carreteras
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
    backgroundColor: '#FFF5F5', borderLeftWidth: 4,
    borderRadius: 10, padding: 14, marginBottom: 20, gap: 10,
  },
  bannerText: { fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, marginBottom: 24,
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
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 12 },
  emptyText: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingHorizontal: 30 },
});