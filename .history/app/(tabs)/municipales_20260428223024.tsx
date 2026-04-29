import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet, TextInput,
  TouchableOpacity, View
} from 'react-native';

const CIUDADES = [
  { id: '1',  nombre: 'Trujillo',    region: 'Norte',  ruta: '/municipales/trujillo' },
  { id: '2',  nombre: 'Cajamarca',   region: 'Norte',  ruta: '/municipales/cajamarca' },
  { id: '3',  nombre: 'Chimbote',    region: 'Norte',  ruta: '/municipales/chimbote' },
  { id: '4',  nombre: 'Chiclayo',    region: 'Norte',  ruta: '/municipales/chiclayo' },
  { id: '5',  nombre: 'Chachapoyas', region: 'Norte',  ruta: '/municipales/chachapoyas' },
  { id: '6',  nombre: 'Jaén',        region: 'Norte',  ruta: '/municipales/jaen' },
  { id: '7',  nombre: 'Piura',       region: 'Norte',  ruta: '/municipales/piura' },
  { id: '8',  nombre: 'Tumbes',      region: 'Norte',  ruta: '/municipales/tumbes' },
  { id: '9',  nombre: 'Tarapoto',    region: 'Norte',  ruta: '/municipales/tarapoto' },
  { id: '10', nombre: 'Huancayo',    region: 'Centro', ruta: '/municipales/huancayo' },
  { id: '11', nombre: 'Pucallpa',    region: 'Centro', ruta: '/municipales/pucallpa' },
  { id: '12', nombre: 'Huánuco',     region: 'Centro', ruta: '/municipales/huanuco' },
  { id: '13', nombre: 'Andahuaylas', region: 'Centro', ruta: '/municipales/andahuaylas' },
  { id: '14', nombre: 'Ica',         region: 'Sur',    ruta: '/municipales/ica' },
  { id: '15', nombre: 'Arequipa',    region: 'Sur',    ruta: '/municipales/arequipa' },
  { id: '16', nombre: 'Cusco',       region: 'Sur',    ruta: '/municipales/cusco' },
  { id: '17', nombre: 'Tacna',       region: 'Sur',    ruta: '/municipales/tacna' },
  { id: '18', nombre: 'Ayacucho',    region: 'Sur',    ruta: '/municipales/ayacucho' },
  { id: '19', nombre: 'Puno',        region: 'Sur',    ruta: '/municipales/puno' },
];

type Tab = 'Todo' | 'Norte' | 'Centro' | 'Sur';
const TABS: Tab[] = ['Todo', 'Norte', 'Centro', 'Sur'];

const TAB_COLORS: Record<Tab, string> = {
  Todo:   '#455A64',
  Norte:  '#185FA5',
  Centro: '#3B6D11',
  Sur:    '#993C1D',
};

const DOT_BG: Record<string, string> = {
  Norte:  '#E6F1FB',
  Centro: '#EAF3DE',
  Sur:    '#FAECE7',
};

export default function MunicipalesScreen() {
  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Todo');
  const router = useRouter();

  const filtered = CIUDADES.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase());
    const matchTab    = activeTab === 'Todo' || c.region === activeTab;
    return matchSearch && matchTab;
  });

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

      {/* Pestañas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                isActive && { backgroundColor: TAB_COLORS[tab], borderColor: TAB_COLORS[tab] },
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: isActive ? '#fff' : '#666' },
                ]}
              >
                {tab}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Buscador */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar ciudad..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityCard}
            activeOpacity={0.7}
            onPress={() => router.push(item.ruta as any)}
          >
            <View style={[styles.cityIcon, { backgroundColor: DOT_BG[item.region] }]}>
              <Ionicons
                name="location-outline"
                size={20}
                color={TAB_COLORS[item.region as Tab]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ color: '#333' }}>
                {item.nombre}
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: '#888' }}>
                Perú {item.region}
              </ThemedText>
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
  container:    { flex: 1 },
  header:       { alignItems: 'center', padding: 20, marginTop: 10 },
  iconCircle:   {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#455A64',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
  },
  title:        { fontSize: 24, fontWeight: 'bold' },
  subtitle:     { opacity: 0.6, fontSize: 14, textAlign: 'center', marginTop: 5 },

  tabsRow:      { paddingHorizontal: 20, gap: 8, marginBottom: 12, alignItems: 'center' },
  tab:          {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tabText:      { fontSize: 13, fontWeight: '600' },

  searchSection: { paddingHorizontal: 20, marginBottom: 10 },
  searchBar:    {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 15, height: 50,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
  },
  input:        { flex: 1, fontSize: 16 },

  listContent:  { padding: 20, gap: 10 },
  cityCard:     {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 15,
    borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0',
  },
  cityIcon:     {
    marginRight: 15, width: 36, height: 36,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  empty:        { textAlign: 'center', marginTop: 20, opacity: 0.5 },
});