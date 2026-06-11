import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  useColorScheme,
  FlatList
} from 'react-native';
import { PlacaVirtual } from '../../components/PlacaVirtual';
import { Colors } from '../../constants/theme';

interface QuickAction {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  color: string;
  route: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'magnify-expand', title: 'SUNARP', color: '#002B5C', route: '/viewer/vehicular/sunarp' },
  { icon: 'shield-check', title: 'SOAT', color: '#2E7D32', route: '/viewer/seguros/soat' },
  { icon: 'file-document-outline', title: 'Papeletas', color: '#C62828', route: '/papeletas' },
  { icon: 'office-building', title: 'Municipales', color: '#1976D2', route: '/municipales' },
];

const RECENT_SEARCHES = [
  { plate: 'ABC-123', date: 'Hace 5 min' },
  { plate: 'FGH-902', date: 'Ayer' },
  { plate: 'YUI-112', date: '20 May' },
];

const SHORTCUTS = [
  { icon: 'tools', title: 'Revisión Técnica', route: '/viewer/vehicular/citv', color: '#455A64' },
  { icon: 'gas-station', title: 'Certificado Gas', route: '/viewer/vehicular/gnv', color: '#E64A19' },
  { icon: 'police-badge', title: 'Requisitorias', route: '/viewer/seguridad/robo', color: '#B71C1C' },
  { icon: 'card-account-details', title: 'Gravámenes', route: '/viewer/vehicular/duenos', color: '#002B5C' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [placa, setPlaca] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── SECCIÓN: INICIO (Header) ── */}
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>¡Hola!</ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>Bienvenido al portal vehicular</ThemedText>
        </View>

        {/* Buscador Central */}
        <PlacaVirtual placa={placa} onChangePlaca={setPlaca} />

        {/* ── SECCIÓN: CONSULTAS RÁPIDAS ── */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Consultas Rápidas</ThemedText>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.actionCard, { backgroundColor: theme.background }]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.actionIconBox, { backgroundColor: item.color + '15' }]}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                </View>
                <ThemedText style={styles.actionTitle}>{item.title}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── SECCIÓN: ÚLTIMAS BÚSQUEDAS ── */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText style={styles.sectionTitle}>Últimas Búsquedas</ThemedText>
            <TouchableOpacity><ThemedText style={styles.viewAll}>Limpiar</ThemedText></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
            {RECENT_SEARCHES.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.recentCard, { backgroundColor: theme.background }]}
                onPress={() => setPlaca(item.plate)}
              >
                <Ionicons name="time-outline" size={14} color="#90A4AE" />
                <ThemedText style={styles.recentPlate}>{item.plate}</ThemedText>
                <ThemedText style={styles.recentDate}>{item.date}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── SECCIÓN: ACCESOS DIRECTOS ── */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Accesos Directos</ThemedText>
          <View style={[styles.shortcutsCard, { backgroundColor: theme.background }]}>
            {SHORTCUTS.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.shortcutItem, index !== SHORTCUTS.length - 1 && styles.shortcutBorder]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.shortcutIconBox, { backgroundColor: item.color }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.shortcutTitle}>{item.title}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CFD8DC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.infoBanner, { backgroundColor: theme.brandAzul + '10' }]}>
          <Ionicons name="information-circle" size={18} color={theme.brandAzul} />
          <ThemedText style={[styles.infoText, { color: theme.brandAzul }]}>
            La placa ingresada se usará automáticamente en todas las consultas del sistema.
          </ThemedText>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: '900', color: '#1A237E' },
  welcomeSubtitle: { fontSize: 14, color: '#78909C', fontWeight: '600' },

  sectionContainer: { marginBottom: 30 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#455A64', marginBottom: 15 },
  viewAll: { fontSize: 12, color: '#1A237E', fontWeight: '700' },

  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { 
    width: '48%', 
    borderRadius: 18, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionTitle: { fontSize: 13, fontWeight: '700' },

  recentScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  recentCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 30, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  recentPlate: { fontSize: 13, fontWeight: '800', color: '#1A237E' },
  recentDate: { fontSize: 10, color: '#90A4AE' },

  shortcutsCard: { borderRadius: 22, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  shortcutItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 15 },
  shortcutBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F7F8' },
  shortcutIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  shortcutTitle: { fontSize: 14, fontWeight: '600' },

  infoBanner: { flexDirection: 'row', padding: 18, borderRadius: 18, alignItems: 'flex-start', gap: 12, marginTop: 10 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '600' },
});
