import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, TextInput, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

// Lista de ciudades principales de Perú para el buscador
const CIUDADES = [
  { id: '1', nombre: 'Arequipa', region: 'Sierra Sur' },
  { id: '2', nombre: 'Cusco', region: 'Sierra Sur' },
  { id: '3', nombre: 'Trujillo', region: 'Costa Norte' },
  { id: '4', nombre: 'Piura', region: 'Costa Norte' },
  { id: '5', nombre: 'Chiclayo', region: 'Costa Norte' },
  { id: '6', nombre: 'Iquitos', region: 'Selva Norte' },
  { id: '7', nombre: 'Huancayo', region: 'Sierra Central' },
  { id: '8', nombre: 'Tacna', region: 'Costa Sur' },
  { id: '9', nombre: 'Puno', region: 'Sierra Sur' },
];

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

  const handleCityPress = (ciudad: typeof CIUDADES[0]) => {
    router.push({
      pathname: '/multas-ciudad',
      params: {
        id: ciudad.id,
        nombre: ciudad.nombre,
        region: ciudad.region,
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="city-variant-outline" size={35} color="white" />
        </View>
        <ThemedText type="title" style={styles.title}>Multas Municipales</ThemedText>
        <ThemedText style={styles.subtitle}>Selecciona la ciudad para consultar arbitrios o multas locales</ThemedText>
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

      {/* Lista de Ciudades */}
      <FlatList
        data={filteredCiudades}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityCard}
            activeOpacity={0.7}
            onPress={() => handleCityPress(item)}
          >
            <View style={styles.cityIcon}>
              <Ionicons name="location-outline" size={22} color="#D32F2F" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ color: '#333' }}>{item.nombre}</ThemedText>
              <ThemedText style={{ fontSize: 12, color: '#888' }}>{item.region}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
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
  title: { fontSize: 24, fontWeight: 'bold' },
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
  listContent: { padding: 20, gap: 10 },
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
    backgroundColor: '#FFF1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { textAlign: 'center', marginTop: 20, opacity: 0.5 }
});