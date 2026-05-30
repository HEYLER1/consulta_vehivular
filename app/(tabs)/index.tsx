// app/(tabs)/index.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar
} from 'react-native';

const { width } = Dimensions.get('window');

// ── Paleta Identidad Vehicular Perú ───────────────────────────────────────────
const AZUL_MTC       = '#002B5C'; // Azul institucional profundo
const ORO_PLACA      = '#FFD600'; // Amarillo intenso de la Placa Nacional
const GRIS_FONDO     = '#F4F7F9';
const BLANCO         = '#FFFFFF';
const TEXTO_TITULO   = '#1A1A2E';

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
    color: AZUL_MTC,
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

const SECTIONS = [
  {
    label: 'Registros Oficiales',
    items: [
      {
        icon: 'card-account-details-outline',
        title: 'Impuesto Vehicular',
        subtitle: 'Deudas pendientes en el SAT',
        color: AZUL_MTC,
      },
      {
        icon: 'history',
        title: 'Historial de Propietarios',
        subtitle: 'Transferencias registradas',
        color: AZUL_MTC,
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

export default function VehiculoScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── PLACA VIRTUAL HEADER ── */}
        <Animated.View style={[styles.placaContainer, { opacity: fadeAnim }]}>
          <View style={styles.placaHeader}>
            <View style={styles.placaStrip} />
            <ThemedText style={styles.placaLabel}>PERÚ</ThemedText>
            <View style={styles.placaLogoWrap}>
              <MaterialCommunityIcons name="shield-check" size={24} color={AZUL_MTC} />
            </View>
          </View>
          <View style={styles.placaContent}>
            <ThemedText style={styles.placaTitle}>CONSULTA</ThemedText>
            <ThemedText style={styles.placaSubtitle}>DATOS DEL VEHÍCULO</ThemedText>
          </View>
          <View style={styles.placaFooter}>
            <ThemedText style={styles.placaFooterText}>PLACA ÚNICA NACIONAL DE RODAJE</ThemedText>
          </View>
        </Animated.View>

        {/* ── ACCIONES RÁPIDAS (ACCESO DIRECTO) ── */}
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionCard}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: item.color + '15' }]}>
                <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
              </View>
              <ThemedText style={styles.actionTitle}>{item.title}</ThemedText>
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
            <View style={styles.listCard}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity 
                  key={iIdx} 
                  style={[styles.listItem, iIdx === section.items.length - 1 && { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.listIconBox, { backgroundColor: item.color + '10' }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.listTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.listSubtitle}>{item.subtitle}</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#B0BEC5" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={AZUL_MTC} />
          <ThemedText style={styles.infoText}>
            La información mostrada proviene de bases de datos públicas oficiales de la República del Perú.
          </ThemedText>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GRIS_FONDO },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Estilo Placa Única
  placaContainer: {
    backgroundColor: BLANCO,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: AZUL_MTC,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  placaHeader: {
    height: 35,
    backgroundColor: BLANCO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placaStrip: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 4,
    backgroundColor: ORO_PLACA,
  },
  placaLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: AZUL_MTC,
    letterSpacing: 4,
  },
  placaLogoWrap: {
    position: 'absolute',
    right: 10,
  },
  placaContent: {
    paddingVertical: 25,
    alignItems: 'center',
    backgroundColor: BLANCO,
  },
  placaTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: AZUL_MTC,
    letterSpacing: -1,
  },
  placaSubtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#546E7A',
    marginTop: -5,
    letterSpacing: 1,
  },
  placaFooter: {
    backgroundColor: AZUL_MTC,
    paddingVertical: 6,
    alignItems: 'center',
  },
  placaFooterText: {
    color: BLANCO,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Acciones Rápidas
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  actionCard: {
    flex: 1,
    backgroundColor: BLANCO,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  actionIconBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXTO_TITULO,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 10,
    color: '#78909C',
    textAlign: 'center',
    marginTop: 2,
  },
  actionTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  actionTagText: {
    color: BLANCO,
    fontSize: 7,
    fontWeight: '900',
  },

  // Listas de Secciones
  sectionContainer: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 5,
  },
  listCard: {
    backgroundColor: BLANCO,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXTO_TITULO,
  },
  listSubtitle: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 1,
  },

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E1F5FE',
    padding: 15,
    borderRadius: 15,
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#0277BD',
    lineHeight: 16,
    fontWeight: '500',
  },
});
