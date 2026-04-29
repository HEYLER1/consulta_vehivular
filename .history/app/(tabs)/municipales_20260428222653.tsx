import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const CIUDADES = [
  // Norte
  { id: '1',  nombre: 'Trujillo',     region: 'Norte',  ruta: '/municipales/trujillo' },
  { id: '2',  nombre: 'Cajamarca',    region: 'Norte',  ruta: '/municipales/cajamarca' },
  { id: '3',  nombre: 'Chimbote',     region: 'Norte',  ruta: '/municipales/chimbote' },
  { id: '4',  nombre: 'Chiclayo',     region: 'Norte',  ruta: '/municipales/chiclayo' },
  { id: '5',  nombre: 'Chachapoyas', region: 'Norte',  ruta: '/municipales/chachapoyas' },
  { id: '6',  nombre: 'Jaén',         region: 'Norte',  ruta: '/municipales/jaen' },
  { id: '7',  nombre: 'Piura',        region: 'Norte',  ruta: '/municipales/piura' },
  { id: '8',  nombre: 'Tumbes',       region: 'Norte',  ruta: '/municipales/tumbes' },
  { id: '9',  nombre: 'Tarapoto',     region: 'Norte',  ruta: '/municipales/tarapoto' },
  // Centro
  { id: '10', nombre: 'Huancayo',     region: 'Centro', ruta: '/municipales/huancayo' },
  { id: '11', nombre: 'Pucallpa',     region: 'Centro', ruta: '/municipales/pucallpa' },
  { id: '12', nombre: 'Huánuco',      region: 'Centro', ruta: '/municipales/huanuco' },
  { id: '13', nombre: 'Andahuaylas',  region: 'Centro', ruta: '/municipales/andahuaylas' },
  // Sur
  { id: '14', nombre: 'Ica',          region: 'Sur',    ruta: '/municipales/ica' },
  { id: '15', nombre: 'Arequipa',     region: 'Sur',    ruta: '/municipales/arequipa' },
  { id: '16', nombre: 'Cusco',        region: 'Sur',    ruta: '/municipales/cusco' },
  { id: '17', nombre: 'Tacna',        region: 'Sur',    ruta: '/municipales/tacna' },
  { id: '18', nombre: 'Ayacucho',     region: 'Sur',    ruta: '/municipales/ayacucho' },
  { id: '19', nombre: 'Puno',         region: 'Sur',    ruta: '/municipales/puno' },
];

const REGIONES = ['Norte', 'Centro', 'Sur'];

const REGION_COLORS: Record<string, string> = {
  Norte:  '#1565C0',
  Centro: '#2E7D32',
  Sur:    '#6A1B9A',
};

export default function MunicipalesScreen() {
  const [search, setSearch] = useState('');
  const [filteredCiudades, setFilteredCiudades] = useState(CIUDADES);
  const router = useRouter();

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = CIUDADES.filter(c =>
      c.nombre.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCiudades(filtered);
  };

  const handleCityPress = (ciudad: (typeof CIUDADES)[0]) => {
    router.push(ciudad.ruta as any);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="city-variant-outline" size={35} color="white" />
        </View>
        <ThemedText type="title" style={styles.title}>Multas Municipales</ThemedText>
        <ThemedText style={styles.subtitle}>
          Selecciona la ciudad para consultar arbitrios o multas locales
        </ThemedText>
      </View>

      {/* Buscador */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar ciudad (Ej: Trujillo...)"
            style={styles.input}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Lista agrupada por región */}
      <FlatList
        data={REGIONES}
        keyExtractor={region => region}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: region }) => {
          const ciudadesDeRegion = filteredCiudades.filter(c => c.region === region);
          if (ciudadesDeRegion.length === 0) return null;

          return (
            <View style={styles.regionGroup}>
              {/* Encabezado de región */}
              <View style={[styles.regionHeader, { borderLeftColor: REGION_COLORS[region] }]}>
                <ThemedText type="defaultSemiBold" style={[styles.regionTitle, { color: REGION_COLORS[region] }]}>
                  Perú {region}
                </ThemedText>
              </View>

              {/* Ciudades de esa región */}
              {ciudadesDeRegion.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.cityCard}
                  activeOpacity={0.7}
                  onPress={() => handleCityPress(item)}
                >
                  <View style={[styles.cityIcon, { backgroundColor: REGION_COLORS[region] + '18' }]}>
                    <Ionicons name="location-outline" size={22} color={REGION_COLORS[region]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold" style={{ color: '#333' }}>
                      {item.nombre}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: '#888' }}>
                      Papeletas {region} del Perú
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          );
        }}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>No se encontró la ciudad</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#455A64',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title:    { fontSize: 24, fontWeight: 'bold' },
  subtitle: { opacity: 0.6, fontSize: 14, textAlign: 'center', marginTop: 5 },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  input: { flex: 1, fontSize: 16 },
  listContent: { padding: 20, gap: 16 },
  regionGroup: { gap: 8 },
  regionHeader: {
    borderLeftWidth: 4,
    paddingLeft: 10,
    marginBottom: 4,
  },
  regionTitle: { fontSize: 15 },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cityIcon: {
    marginRight: 15,
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { textAlign: 'center', marginTop: 20, opacity: 0.5 },
});