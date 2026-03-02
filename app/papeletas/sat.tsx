// papeletas/sat.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SATScreen() {
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsulta = () => {
    if (!placa.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // Simula consulta
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={[styles.banner, { borderLeftColor: '#E53935' }]}>
          <Ionicons name="information-circle-outline" size={20} color="#E53935" />
          <ThemedText style={styles.bannerText}>
            Consulta las infracciones de tránsito emitidas por el SAT en Lima Metropolitana.
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Buscar por placa</ThemedText>
          <View style={styles.inputRow}>
            <Ionicons name="car-outline" size={20} color="#888" style={{ marginRight: 10 }} />
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
            style={[styles.btn, { backgroundColor: '#E53935', opacity: placa ? 1 : 0.5 }]}
            onPress={handleConsulta}
            disabled={!placa.trim()}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <ThemedText style={styles.btnText}>Consultar Infracciones</ThemedText>
            }
          </TouchableOpacity>
        </View>

        {/* Placeholder resultado */}
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={50} color="#ddd" />
          <ThemedText style={styles.emptyText}>
            Ingresa la placa para ver las infracciones registradas
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  bannerText: { fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  input: { flex: 1, fontSize: 15, color: '#333' },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 12 },
  emptyText: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingHorizontal: 30 },
});