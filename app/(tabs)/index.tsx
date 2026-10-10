import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { usePlate } from '@/components/PlateContext';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  useColorScheme,
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

const SHORTCUTS = [
  { icon: 'tools', title: 'Revisión Técnica', route: '/viewer/vehicular/citv', color: '#455A64' },
  { icon: 'gas-station', title: 'Certificado Gas', route: '/viewer/vehicular/gnv', color: '#E64A19' },
  { icon: 'police-badge', title: 'Requisitorias', route: '/viewer/seguridad/robo', color: '#B71C1C' },
  { icon: 'card-account-details', title: 'Gravámenes', route: '/viewer/vehicular/duenos', color: '#002B5C' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { plate: placa, setPlate: setPlaca } = usePlate();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── SECCIÓN: INICIO (Header) ── */}


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



      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 24 },
  
  header: { marginBottom: 20 },
  greeting: { fontSize: 29, lineHeight: 36, fontWeight: '800' },
  welcomeSubtitle: { fontSize: 14, color: '#78909C', fontWeight: '600' },

  sectionContainer: { marginBottom: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 15 },
  viewAll: { fontSize: 12, color: '#1A237E', fontWeight: '700' },

  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { 
    flexBasis: '46%',
    flexGrow: 1,
    borderRadius: 18, 
    padding: 12,
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
  shortcutItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 15 },
  shortcutBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F7F8' },
  shortcutIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  shortcutTitle: { fontSize: 14, fontWeight: '600' },

  infoBanner: { flexDirection: 'row', padding: 18, borderRadius: 18, alignItems: 'flex-start', gap: 12, marginTop: 10 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '600' },
});
