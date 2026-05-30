import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  FlatList, StyleSheet, TextInput,
  TouchableOpacity, View,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const CIUDADES = [
  { id: '1',  nombre: 'Trujillo',    region: 'Norte',  ruta: '/municipales/trujillo', popular: true },
  { id: '2',  nombre: 'Cajamarca',   region: 'Norte',  ruta: '/municipales/cajamarca' },
  { id: '3',  nombre: 'Chimbote',    region: 'Norte',  ruta: '/municipales/chimbote' },
  { id: '4',  nombre: 'Chiclayo',    region: 'Norte',  ruta: '/municipales/chiclayo' },
  { id: '5',  nombre: 'Chachapoyas', region: 'Norte',  ruta: '/municipales/chachapoyas' },
  { id: '6',  nombre: 'Jaén',        region: 'Norte',  ruta: '/municipales/jaen' },
  { id: '7',  nombre: 'Piura',       region: 'Norte',  ruta: '/municipales/piura', popular: true },
  { id: '8',  nombre: 'Tumbes',      region: 'Norte',  ruta: '/municipales/tumbes' },
  { id: '9',  nombre: 'Tarapoto',    region: 'Norte',  ruta: '/municipales/tarapoto' },
  { id: '10', nombre: 'Huancayo',    region: 'Centro', ruta: '/municipales/huancayo' },
  { id: '11', nombre: 'Pucallpa',    region: 'Centro', ruta: '/municipales/pucallpa' },
  { id: '12', nombre: 'Huánuco',     region: 'Centro', ruta: '/municipales/huanuco' },
  { id: '13', nombre: 'Andahuaylas', region: 'Centro', ruta: '/municipales/andahuaylas' },
  { id: '14', nombre: 'Ica',         region: 'Sur',    ruta: '/municipales/ica', popular: true },
  { id: '15', nombre: 'Arequipa',    region: 'Sur',    ruta: '/municipales/arequipa', popular: true },
  { id: '16', nombre: 'Cusco',       region: 'Sur',    ruta: '/municipales/cusco', popular: true },
  { id: '17', nombre: 'Tacna',       region: 'Sur',    ruta: '/municipales/tacna' },
  { id: '19', nombre: 'Puno',        region: 'Sur',    ruta: '/municipales/puno' },
];

type Tab = 'Todo' | 'Norte' | 'Centro' | 'Sur';

const TABS: { label: Tab; color: string; icon: string }[] = [
  { label: 'Todo',   color: '#1A237E', icon: 'apps' },
  { label: 'Norte',  color: '#0D47A1', icon: 'boat' },
  { label: 'Centro', color: '#1B5E20', icon: 'business' },
  { label: 'Sur',    color: '#B71C1C', icon: 'mountain' },
];

const REGION_COLORS: Record<string, string> = {
  Norte:  '#1976D2',
  Centro: '#388E3C',
  Sur:    '#D32F2F',
};

const REGION_BG: Record<string, string> = {
  Norte:  '#E3F2FD',
  Centro: '#E8F5E9',
  Sur:    '#FFEBEE',
};

// --- Componente de Cabecera extraído para evitar remounting y cierre de teclado ---
const ListHeader = ({ 
  search, 
  setSearch, 
  activeTab, 
  setActiveTab, 
  populares, 
  router,
  showTitle 
}: any) => (
  <View>
    <View style={styles.heroBanner}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#90A4AE" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="¿En qué ciudad buscas multas?"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#90A4AE"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#CFD8DC" />
          </TouchableOpacity>
        )}
      </View>
    </View>

    <View style={styles.tabsContainer}>
      {TABS.map(({ label, color, icon }) => {
        const isActive = activeTab === label;
        return (
          <TouchableOpacity
            key={label}
            style={[styles.tab, isActive && { backgroundColor: color, borderColor: color }]}
            onPress={() => setActiveTab(label)}
            activeOpacity={0.8}
          >
            <Ionicons name={icon as any} size={18} color={isActive ? '#FFD600' : '#78909C'} />
            <ThemedText style={[styles.tabText, { color: isActive ? '#fff' : '#546E7A' }]}>
              {label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>

    {!search && populares.length > 0 && (
      <View style={styles.popularSection}>
        <ThemedText style={styles.sectionTitle}>Ciudades con más tráfico</ThemedText>
        <View style={styles.popularGrid}>
          {populares.slice(0, 4).map((city: any) => (
            <TouchableOpacity 
              key={city.id} 
              style={styles.popularCard}
              onPress={() => router.push(city.ruta as any)}
            >
              <View style={[styles.popularIcon, { backgroundColor: REGION_COLORS[city.region] }]}>
                <ThemedText style={styles.popularInitial}>{city.nombre[0]}</ThemedText>
              </View>
              <ThemedText style={styles.popularName} numberOfLines={1}>{city.nombre}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )}

    {showTitle && (
      <ThemedText style={styles.sectionTitle}>Todas las Municipalidades</ThemedText>
    )}
  </View>
);

export default function MunicipalesScreen() {
  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Todo');
  const router = useRouter();

  const { populares, filtered } = useMemo(() => {
    const matched = CIUDADES.filter(c => {
      const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase());
      const matchTab    = activeTab === 'Todo' || c.region === activeTab;
      return matchSearch && matchTab;
    });

    return {
      populares: matched.filter(c => c.popular),
      filtered: matched
    };
  }, [search, activeTab]);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <ListHeader 
            search={search}
            setSearch={setSearch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            populares={populares}
            router={router}
            showTitle={filtered.length > 0}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityCard}
            activeOpacity={0.7}
            onPress={() => router.push(item.ruta as any)}
          >
            <View style={[styles.cityIconWrap, { backgroundColor: REGION_BG[item.region] }]}>
              <MaterialCommunityIcons 
                name="city-variant-outline" 
                size={22} 
                color={REGION_COLORS[item.region]} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.cityName}>
                {item.nombre}
              </ThemedText>
              <View style={styles.regionTag}>
                <View style={[styles.regionDot, { backgroundColor: REGION_COLORS[item.region] }]} />
                <ThemedText style={styles.regionText}>
                  Perú {item.region}
                </ThemedText>
              </View>
            </View>
            <View style={styles.chevronWrap}>
              <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#ECEFF1" />
            <ThemedText style={styles.emptyText}>No encontramos resultados para tu búsqueda</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFB' },
  listContent: { paddingBottom: 30 },

  heroBanner: {
    backgroundColor: '#002B5C', // Azul Institucional
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabText: { fontSize: 12, fontWeight: '700' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  input: { flex: 1, fontSize: 16, color: '#263238', fontWeight: '500' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263238',
    marginHorizontal: 20,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  popularSection: { marginBottom: 30 },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  popularCard: {
    width: (width - 32 - 36) / 4,
    alignItems: 'center',
    gap: 8,
  },
  popularIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  popularInitial: { color: '#fff', fontSize: 22, fontWeight: '900' },
  popularName: { fontSize: 12, fontWeight: '700', color: '#455A64', textAlign: 'center' },

  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  cityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cityName: { fontSize: 17, fontWeight: '800', color: '#263238' },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  regionDot: { width: 8, height: 8, borderRadius: 4 },
  regionText: { fontSize: 12, color: '#78909C', fontWeight: '600' },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#90A4AE',
    fontSize: 15,
    lineHeight: 22,
  },
});
