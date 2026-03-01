// app/vehiculo.tsx
import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

// ─── Tipos ──────────────────────────────────────────────────────────────────
interface MenuOption {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  gradient: [string, string];
  tag?: string;
}

interface SectionData {
  label: string;
  faIcon: string;
  color: string;
  items: MenuOption[];
}

// ─── Datos por categoría ─────────────────────────────────────────────────────
const SECTIONS: SectionData[] = [
  {
    label: 'Registro & Propiedad',
    faIcon: 'file-alt',
    color: '#C62828',
    items: [
      {
        icon: 'search-outline',
        title: 'Consulta Vehicular SUNARP',
        subtitle: 'Datos de tarjeta de propiedad',
        gradient: ['#E53935', '#C62828'],
        tag: 'SUNARP',
      },
      {
        icon: 'people-outline',
        title: 'Historial de Dueños y Gravámenes',
        subtitle: 'Antecedentes y propietarios registrados',
        gradient: ['#1E88E5', '#1565C0'],
      },
      {
        icon: 'cash-outline',
        title: 'Precio Pagado del Vehículo',
        subtitle: 'Valor de última transferencia',
        gradient: ['#43A047', '#2E7D32'],
      },
    ],
  },
  {
    label: 'Trámites Oficiales',
    faIcon: 'exchange-alt',
    color: '#F57F17',
    items: [
      {
        icon: 'swap-horizontal-outline',
        title: 'Cambio de Placa',
        subtitle: 'Tramita tu nueva placa nacional',
        gradient: ['#FFB300', '#F57F17'],
        tag: 'Trámite',
      },
      {
        icon: 'hammer-outline',
        title: 'Inspección Técnica (CITV)',
        subtitle: 'Estado de revisiones técnico-vehiculares',
        gradient: ['#8E24AA', '#6A1B9A'],
      },
    ],
  },
  {
    label: 'Gas Natural (GNV)',
    faIcon: 'fire',
    color: '#E64A19',
    items: [
      {
        icon: 'flame-outline',
        title: 'Vigencia GNV',
        subtitle: 'Certificación de gas natural vigente',
        gradient: ['#F4511E', '#BF360C'],
        tag: 'Certificado',
      },
      {
        icon: 'card-outline',
        title: 'Deuda GNV',
        subtitle: 'Pagos pendientes de carga de gas',
        gradient: ['#546E7A', '#37474F'],
      },
    ],
  },
];

// ─── Componente AnimatedCard ──────────────────────────────────────────────────
function AnimatedCard({
  item,
  index,
  delay,
}: {
  item: MenuOption;
  index: number;
  delay: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => console.log(item.title)}
        style={styles.card}
      >
        {/* Franja de color izquierda */}
        <View
          style={[
            styles.cardAccent,
            { backgroundColor: item.gradient[0] },
          ]}
        />

        {/* Icono */}
        <View style={[styles.iconWrap, { backgroundColor: item.gradient[0] + '1A' }]}>
          <Ionicons name={item.icon} size={22} color={item.gradient[0]} />
        </View>

        {/* Texto */}
        <View style={styles.cardTextWrap}>
          <View style={styles.cardTitleRow}>
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            {item.tag && (
              <View style={[styles.tag, { backgroundColor: item.gradient[0] + '22' }]}>
                <ThemedText style={[styles.tagText, { color: item.gradient[0] }]}>
                  {item.tag}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
        </View>

        {/* Flecha */}
        <Ionicons name="chevron-forward" size={18} color="#bbb" style={{ marginRight: 4 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function VehiculoScreen() {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [imgSize, setImgSize] = React.useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  let cardDelay = 100;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.headerBg}>
            {/* Imagen centrada y autoajustable */}
            <Image
              source={require('@/assets/images/imagecar.jpg')}
              style={[
                styles.headerImage,
                imgSize
                  ? {
                      height:
                        (Dimensions.get('window').width * imgSize.height) /
                        imgSize.width,
                    }
                  : undefined,
              ]}
              resizeMode="cover"
              onLoad={(e) =>
                setImgSize({
                  width: e.nativeEvent.source.width,
                  height: e.nativeEvent.source.height,
                })
              }
            />

           
          </View>
        </Animated.View>

        {/* ── Secciones ── */}
        {SECTIONS.map((section) => (
          <View key={section.label} style={styles.section}>
            {/* Encabezado de sección */}
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
              <FontAwesome5 name={section.faIcon as any} size={13} color={section.color} />
              <ThemedText style={[styles.sectionLabel, { color: section.color }]}>
                {section.label}
              </ThemedText>
            </View>

            {/* Cards */}
            <View style={styles.cardGroup}>
              {section.items.map((item, idx) => {
                const delay = cardDelay;
                cardDelay += 80;
                return (
                  <AnimatedCard key={item.title} item={item} index={idx} delay={delay} />
                );
              })}
            </View>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </ThemedView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 3, paddingTop: 16, paddingBottom: 20 },

  // Header
  
  header: { marginBottom: 4 },
  headerBg: {
    borderRadius: 20,
    backgroundColor: '#B71C1C',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#B71C1C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  headerImage: {
    width: '100%',
    height: undefined,
    aspectRatio: undefined,
    flexShrink: 1,
    alignSelf: 'center',
  },
  headerTextBlock: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'center',
  },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingLeft: 4,
  },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },

  // Card group
  cardGroup: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTextWrap: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  cardSubtitle: { fontSize: 12, color: '#888', lineHeight: 16 },

  // Tag
  tag: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: '700' },
});