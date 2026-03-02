// papeletas/fotopit.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function FotoPITScreen() {
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
        <View style={[styles.banner, { borderLeftColor: '#37474F' }]}>
          <Ionicons name="camera-outline" size={20} color="#37474F" />
          <ThemedText style={styles.bannerText}>
            Consulta las fotomultas capturadas por cámaras de control PIT instaladas en vías de Lima.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Consultar fotomultas por placa</ThemedText>
          <View style={styles.inputRow}>
            <Ionicons name="camera-outline" size={20} color="#888" style={{ marginRight: 10 }} />
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
            style={[styles.btn, { backgroundColor: '#37474F', opacity: placa ? 1 : 0.5 }]}
            onPress={handleConsulta}
            disabled={!placa.trim()}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <ThemedText style={styles.btnText}>Buscar Fotomultas</ThemedText>
            }
          </TouchableOpacity>
        </View>

        {/* ¿Cómo funciona? */}
        <View style={styles.howCard}>
          <ThemedText style={styles.howTitle}>¿Cómo funciona FotoPIT?</ThemedText>
          {[
            { icon: 'camera', text: 'Las cámaras capturan automáticamente infracciones de tránsito.' },
            { icon: 'image-outline', text: 'Se registra foto del vehículo con fecha, hora y ubicación.' },
            { icon: 'mail-outline', text: 'Se notifica al propietario para que pueda pagar o apelar.' },
          ].map((item, i) => (
            <View key={i} style={styles.howItem}>
              <View style={styles.howIcon}>
                <Ionicons name={item.icon as any} size={16} color="#37474F" />
              </View>
              <ThemedText style={styles.howText}>{item.text}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={50} color="#ddd" />
          <ThemedText style={styles.emptyText}>
            Ingresa la placa para ver fotomultas registradas por cámaras PIT
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
    backgroundColor: '#ECEFF1', borderLeftWidth: 4,
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
  howCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, marginBottom: 20, gap: 12,
  },
  howTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 4 },
  howItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  howIcon: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#ECEFF1', justifyContent: 'center', alignItems: 'center',
  },
  howText: { fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  emptyState: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  emptyText: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingHorizontal: 30 },
});