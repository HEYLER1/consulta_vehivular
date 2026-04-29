// app/index.tsx
// ─── Este archivo ES la pantalla de vehículo (no hay vehiculo.tsx separado) ───
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface MenuOption {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  gradient: [string, string];
  tag?: string;
  route?: string; // ruta interna de expo-router
}

interface SectionData {
  label: string;
  faIcon: string;
  color: string;
  items: MenuOption[];
}

// ─── Datos por categoría ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    label: 'Lima y Callao',
    options: [
      {
        route: '/sunarp-webview',
        icon: 'file-document-outline' as const,
        title: 'Papeletas Lima',
        subtitle: 'Infracciones de tránsito en Lima',
        color: '#E53935',
        bg: '#FFEBEE',
      },
      {
        route: '/sunarp-webview',
        icon: 'file-document-outline' as const,
        title: 'Papeletas Callao',
        subtitle: 'Infracciones de tránsito en el Callao',
        color: '#E53935',
        bg: '#FFEBEE',
      },
    ],
  },
  {
    label: 'Fotomultas',
    options: [
      {
        route: '/sunarp-webview',
        icon: 'camera-outline' as const,
        title: 'Foto Papeletas — FotoPIT',
        subtitle: 'Fotomultas por cámaras de control',
        color: '#6A1B9A',
        bg: '#F3E5F5',
      },
    ],
  },
  {
    label: 'Transporte',
    options: [
      {
        route: '/sunarp-webview',
        icon: 'highway' as const,
        title: 'SUTRAN',
        subtitle: 'Infracciones en carreteras nacionales',
        color: '#F57C00',
        bg: '#FFF3E0',
      },
      {
        route: '/sunarp-webview',
        icon: 'bus-outline' as const,
        title: 'ATU',
        subtitle: 'Infracciones de transporte urbano',
        color: '#1565C0',
        bg: '#E3F2FD',
      },
    ],
  },
];
// ─── Componente AnimatedCard ──────────────────────────────────────────────────
function AnimatedCard({
  item,
  index,
  delay,
  onPress,
}: {
  item: MenuOption;
  index: number;
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

  const handlePressIn  = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();

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
                <ThemedText style={[styles.tagText, { color: item.gradient[0] }]}>
                  {item.tag}
                </ThemedText>
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
    if (item.route) {
      router.push(item.route as any);
    } else {
      console.log(item.title);
    }
  };

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
            <Image
              source={require('@/assets/images/imagecar.jpg')}
              style={[
                styles.headerImage,
                imgSize
                  ? {
                      height:
                        (Dimensions.get('window').width * imgSize.height) / imgSize.width,
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
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
              <FontAwesome5 name={section.faIcon as any} size={13} color={section.color} />
              <ThemedText style={[styles.sectionLabel, { color: section.color }]}>
                {section.label}
              </ThemedText>
            </View>

            <View style={styles.cardGroup}>
              {section.items.map((item, idx) => {
                const delay = cardDelay;
                cardDelay += 80;
                return (
                  <AnimatedCard
                    key={item.title}
                    item={item}
                    index={idx}
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

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1 },
  scrollContent: { paddingHorizontal: 3, paddingTop: 16, paddingBottom: 20 },

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
  cardTitle:    { fontSize: 14, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  cardSubtitle: { fontSize: 12, color: '#888', lineHeight: 16 },

  tag:     { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontSize: 10, fontWeight: '700' },
});