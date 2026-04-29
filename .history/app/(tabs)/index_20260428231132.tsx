// app/index.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface MenuOption {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  gradient: [string, string];
  tag?: string;
  route?: string;
  url?: string;
}

interface SectionData {
  label: string;
  faIcon: string;
  color: string;
  items: MenuOption[];
}

const SECTIONS: SectionData[] = [
  {
    label: 'Consultas Principales',
    faIcon: 'search',
    color: '#C62828',
    items: [
      {
        icon: 'car-outline',
        title: 'Consulta Vehicular',
        subtitle: 'Datos de tarjeta de propiedad SUNARP',
        gradient: ['#E53935', '#C62828'],
        tag: 'SUNARP',
        url: 'https://consultavehicular.sunarp.gob.pe/',
      },
      {
        icon: 'receipt-outline',
        title: 'Impuesto Vehicular',
        subtitle: 'Consulta y pago de impuesto vehicular SAT',
        gradient: ['#F57C00', '#E65100'],
        tag: 'SAT',
        url: 'https://www.sat.gob.pe/VirtualSAT/principal.aspx',
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Consulta de SOAT',
        subtitle: 'Verifica tu seguro SOAT vigente',
        gradient: ['#1E88E5', '#1565C0'],
        tag: 'APESEG',
        url: 'https://www.apeseg.org.pe/consultas-soat/',
      },
    ],
  },
  {
    label: 'Propiedad y Registro',
    faIcon: 'file-alt',
    color: '#1565C0',
    items: [
      {
        icon: 'people-outline',
        title: 'Historial de Propietarios',
        subtitle: 'Antecedentes y dueños registrados en SUNARP',
        gradient: ['#1E88E5', '#1565C0'],
        tag: 'SUNARP',
        url: 'https://sprl.sunarp.gob.pe/sprl/ingreso',
      },
      {
        icon: 'cash-outline',
        title: 'Precio Pagado por Vehículo',
        subtitle: 'Valor de la última transferencia registrada',
        gradient: ['#43A047', '#2E7D32'],
        tag: 'SUNARP',
        url: 'https://sigueloplus.sunarp.gob.pe/siguelo/',
      },
      {
        icon: 'document-text-outline',
        title: 'Anotaciones SUNARP',
        subtitle: 'Robo, embargos, prendas y cambios de características',
        gradient: ['#8E24AA', '#6A1B9A'],
        tag: 'SUNARP',
        url: 'https://sigueloplus.sunarp.gob.pe/siguelo/',
      },
    ],
  },
];

// ─── AnimatedCard ─────────────────────────────────────────────────────────────
function AnimatedCard({
  item,
  delay,
  onPress,
}: {
  item: MenuOption;
  delay: number;
  onPress: () => void;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
        onPress={onPress}
        style={styles.card}
      >
        <View style={[styles.cardAccent, { backgroundColor: item.gradient[0] }]} />
        <View style={[styles.iconWrap, { backgroundColor: item.gradient[0] + '1A' }]}>
          <Ionicons name={item.icon} size={22} color={item.gradient[0]} />
        </View>
        <View style={styles.cardTextWrap}>
          <View style={styles.cardTitleRow}>
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            {item.tag && (
              <View style={[styles.tag, { backgroundColor: item.gradient[0] + '22' }]}>
                <ThemedText style={[styles.tagText, { color: item.gradient[0] }]}>{item.tag}</ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#bbb" style={{ marginRight: 4 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function VehiculoScreen() {
  const router     = useRouter();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [imgSize, setImgSize] = React.useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleCardPress = (item: MenuOption) => {
    if (item.route) router.push(item.route as any);
    else if (item.url)  router.push(item.url as any);
    else console.log(item.title);
  };

  let cardDelay = 100;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header imagen */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
              }],
            },
          ]}
        >
          <View style={styles.headerBg}>
            <Image
              source={require('@/assets/images/imagecar.jpg')}
              style={[
                styles.headerImage,
                imgSize ? { height: (width * imgSize.height) / imgSize.width } : undefined,
              ]}
              resizeMode="cover"
              onLoad={e => setImgSize({ width: e.nativeEvent.source.width, height: e.nativeEvent.source.height })}
            />
          </View>
        </Animated.View>

        {/* Secciones */}
        {SECTIONS.map(section => (
          <View key={section.label} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
              <FontAwesome5 name={section.faIcon as any} size={13} color={section.color} />
              <ThemedText style={[styles.sectionLabel, { color: section.color }]}>
                {section.label}
              </ThemedText>
            </View>

            <View style={styles.cardGroup}>
              {section.items.map(item => {
                const delay = cardDelay;
                cardDelay += 80;
                return (
                  <AnimatedCard
                    key={item.title}
                    item={item}
                    delay={delay}
                    onPress={() => handleCardPress(item)}
                  />
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

const styles = StyleSheet.create({
  container:     { flex: 1 },
  scrollContent: { paddingHorizontal: 3, paddingTop: 16, paddingBottom: 20 },

  header:   { marginBottom: 4 },
  headerBg: {
    borderRadius: 20,
    backgroundColor: '#B71C1C',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#B71C1C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  headerImage: { width: '100%', height: undefined },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingLeft: 4,
  },
  sectionDot:   { width: 6, height: 6, borderRadius: 3 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },

  cardGroup: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  cardAccent:   { width: 4, alignSelf: 'stretch', marginRight: 12 },
  iconWrap: {
    width: 42, height: 42, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardTextWrap: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  cardTitle:    { fontSize: 14, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  cardSubtitle: { fontSize: 12, color: '#888', lineHeight: 16 },
  tag:          { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  tagText:      { fontSize: 10, fontWeight: '700' },
});