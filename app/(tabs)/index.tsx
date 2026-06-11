import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  useColorScheme
} from 'react-native';
import { PlacaVirtual } from '../../components/PlacaVirtual';
import { OptionItem } from '../../components/OptionItem';
import { Colors } from '../../constants/theme';

// ── SECCIONES DE DETALLE ── 

interface MenuOption {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  tag?: string;
  route?: string;
}

const QUICK_ACTIONS: MenuOption[] = [
  {
    icon: 'magnify-expand',
    title: 'Consulta SUNARP',
    subtitle: 'Datos de propiedad',
    color: '#002B5C',
    route: '/sunarp-webview',
    tag: 'OFICIAL'
  },
  {
    icon: 'shield-check',
    title: 'SOAT Vigente',
    subtitle: 'Consulta APESEG',
    color: '#2E7D32',
    tag: 'ALERTA'
  },
];

interface SectionItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
}

interface Section {
  label: string;
  items: SectionItem[];
}

const SECTIONS: Section[] = [
  {
    label: 'Registros Oficiales',
    items: [
      {
        icon: 'card-account-details-outline',
        title: 'Impuesto Vehicular',
        subtitle: 'Deudas pendientes en el SAT',
        color: '#002B5C',
      },
      {
        icon: 'history',
        title: 'Historial de Propietarios',
        subtitle: 'Transferencias registradas',
        color: '#002B5C',
      },
      {
        icon: 'alert-decagram-outline',
        title: 'Gravámenes y Embargos',
        subtitle: 'Cargas sobre el vehículo',
        color: '#C62828',
      },
    ],
  },
  {
    label: 'Servicios Técnicos',
    items: [
      {
        icon: 'tools',
        title: 'Revisión Técnica',
        subtitle: 'Estado del CITV vigente',
        color: '#455A64',
      },
      {
        icon: 'gas-station',
        title: 'Certificación GNV/GLP',
        subtitle: 'Vigencia de chips de gas',
        color: '#E64A19',
      },
    ],
  },
];

function HomeScreen() {
  const router = useRouter();
  const [placa, setPlaca] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── PLACA VIRTUAL HEADER ── */}
        <PlacaVirtual placa={placa} onChangePlaca={setPlaca} />

        {/* ── ACCIONES RÁPIDAS ── */}
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.actionCard, { backgroundColor: theme.background }]}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: item.color + '15' }]}>
                <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
              </View>
              <ThemedText style={[styles.actionTitle, { color: theme.textoTitulo }]}>{item.title}</ThemedText>
              <ThemedText style={styles.actionSubtitle}>{item.subtitle}</ThemedText>
              {item.tag && (
                <View style={[styles.actionTag, { backgroundColor: item.color }]}>
                  <ThemedText style={styles.actionTagText}>{item.tag}</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SECCIONES DE DETALLE ── */}
        {SECTIONS.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionContainer}>
            <ThemedText style={styles.sectionLabel}>{section.label}</ThemedText>
            <View style={[styles.listCard, { backgroundColor: theme.background }]}>
              {section.items.map((item, iIdx) => (
                <OptionItem
                  key={iIdx}
                  icon={item.icon}
                  iconType="MaterialCommunityIcons"
                  title={item.title}
                  subtitle={item.subtitle}
                  color={item.color}
                  isLast={iIdx === section.items.length - 1}
                  onPress={() => {}} // Placeholder for now, or add specific routes
                />
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.infoBanner, { backgroundColor: theme.backgroundGris }]}>
          <Ionicons name="information-circle" size={18} color={theme.brandAzul} />
          <ThemedText style={[styles.infoText, { color: theme.brandAzul }]}>
            La placa ingresada se usará automáticamente en todas las consultas del sistema.
          </ThemedText>
        </View>

      </ScrollView>

    </ThemedView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  quickActionsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  actionCard: { flex: 1, borderRadius: 22, padding: 18, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6 },
  actionIconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionTitle: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  actionSubtitle: { fontSize: 10, color: '#78909C', textAlign: 'center', marginTop: 3 },
  actionTag: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  actionTagText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' },

  sectionContainer: { marginBottom: 25 },
  sectionLabel: { fontSize: 13, fontWeight: '900', color: '#546E7A', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
  listCard: { borderRadius: 22, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },

  infoBanner: { flexDirection: 'row', padding: 18, borderRadius: 18, alignItems: 'flex-start', gap: 12 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '600' },
});
