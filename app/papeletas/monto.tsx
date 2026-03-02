// papeletas/monto.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const MULTAS = [
  { codigo: 'G01', descripcion: 'Exceso de velocidad (hasta 20km/h)', monto: 'S/ 207', descuento: '25%' },
  { codigo: 'G02', descripcion: 'No usar cinturón de seguridad', monto: 'S/ 207', descuento: '25%' },
  { codigo: 'G03', descripcion: 'Usar celular al conducir', monto: 'S/ 414', descuento: '25%' },
  { codigo: 'G04', descripcion: 'Conducir en estado de ebriedad', monto: 'S/ 1,035', descuento: '0%' },
  { codigo: 'G05', descripcion: 'No respetar semáforo en rojo', monto: 'S/ 414', descuento: '25%' },
  { codigo: 'G06', descripcion: 'Estacionamiento prohibido', monto: 'S/ 207', descuento: '50%' },
];

export default function MontoScreen() {
  const [filter, setFilter] = useState<'todas' | 'descuento'>('todas');
  const filtered = filter === 'descuento' ? MULTAS.filter(m => m.descuento !== '0%') : MULTAS;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { borderLeftColor: '#2E7D32' }]}>
          <Ionicons name="cash-outline" size={20} color="#2E7D32" />
          <ThemedText style={styles.bannerText}>
            Montos vigentes según el Reglamento Nacional de Tránsito. Los descuentos aplican si se paga dentro del plazo.
          </ThemedText>
        </View>

        {/* Filtros */}
        <View style={styles.filterRow}>
          {(['todas', 'descuento'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && { backgroundColor: '#2E7D32' }]}
              onPress={() => setFilter(f)}
            >
              <ThemedText style={[styles.filterText, filter === f && { color: 'white' }]}>
                {f === 'todas' ? 'Todas' : 'Con descuento'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.map((m) => (
          <View key={m.codigo} style={styles.multaCard}>
            <View style={styles.multaLeft}>
              <View style={styles.codBadge}>
                <ThemedText style={styles.codText}>{m.codigo}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.multaDesc}>{m.descripcion}</ThemedText>
                <ThemedText style={styles.multaDescuento}>
                  {m.descuento !== '0%' ? `✓ Descuento al pronto pago: ${m.descuento}` : '✗ Sin descuento'}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.multaMonto}>{m.monto}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  banner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#F1F8E9', borderLeftWidth: 4,
    borderRadius: 10, padding: 14, marginBottom: 20, gap: 10,
  },
  bannerText: { fontSize: 13, color: '#555', flex: 1, lineHeight: 18 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#2E7D32',
  },
  filterText: { fontSize: 13, fontWeight: '600', color: '#2E7D32' },
  multaCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  multaLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 10 },
  codBadge: {
    backgroundColor: '#E8F5E9', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start',
  },
  codText: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },
  multaDesc: { fontSize: 13, color: '#333', fontWeight: '500', flex: 1, lineHeight: 18 },
  multaDescuento: { fontSize: 11, color: '#888', marginTop: 3 },
  multaMonto: { fontSize: 15, fontWeight: '700', color: '#2E7D32', marginLeft: 10 },
});