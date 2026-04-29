// app/_layout.tsx
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Paleta ────────────────────────────────────────────────────────────────────
const ROJO        = '#C8102E';
const ROJO_OSCURO = '#9B0B21';
const BLANCO      = '#FFFFFF';
const CREMA       = '#FDF6F0';
const ORO         = '#D4AF37';
const ORO_CLARO   = '#F0D060';
const GRIS_SUAVE  = '#F5F0EC';
const TEXTO_MENU  = '#1A1A2E';
const TEXTO_MUTED = '#6B7280';

// ── Animación del escudo ──────────────────────────────────────────────────────
function AnimatedShield() {
  const spin   = useRef(new Animated.Value(0)).current;
  const glow   = useRef(new Animated.Value(0)).current;
  const scale  = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Entrada suave
    Animated.spring(scale, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulso de brillo continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Rotación sutil periódica
    Animated.loop(
      Animated.sequence([
        Animated.delay(4000),
        Animated.timing(spin, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(spin, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate     = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '8deg'] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.9] });

  return (
    <Animated.View style={[styles.shieldWrapper, { transform: [{ scale }, { rotate }] }]}>
      {/* Halo exterior animado */}
      <Animated.View style={[styles.shieldHalo, { opacity: glowOpacity }]} />
      {/* Aro dorado */}
      <View style={styles.shieldRing}>
        <View style={styles.shieldInner}>
          <FontAwesome5 name="shield-alt" size={32} color={ORO} />
          {/* Destello en el icono */}
          <Animated.View style={[styles.shieldSparkle, { opacity: glowOpacity }]}>
            <FontAwesome5 name="star" size={8} color={ORO_CLARO} />
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Barra decorativa tricolor mejorada ────────────────────────────────────────
function TricolorBar() {
  return (
    <View style={styles.tricolorBar}>
      <View style={[styles.tricolorSegment, { backgroundColor: ROJO }]} />
      <View style={[styles.tricolorSegment, { backgroundColor: '#E8D5B7' }]} />
      <View style={[styles.tricolorSegment, { backgroundColor: ROJO }]} />
    </View>
  );
}

// ── Separador de sección ──────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionLine} />
      <View style={styles.sectionPill}>
        <Text style={styles.sectionText}>{label}</Text>
      </View>
      <View style={styles.sectionLine} />
    </View>
  );
}

// ── Contenido del Drawer ──────────────────────────────────────────────────────
function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, delay: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.root}>

      {/* Fondo sutil con textura de bandera */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bgStripeLeft} />
        <View style={styles.bgStripeRight} />
        {/* Línea diagonal decorativa */}
        <View style={styles.diagonalAccent} />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0, flexGrow: 1 }}
        style={{ backgroundColor: 'transparent' }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header del Drawer ── */}
        <View style={[styles.drawerHeader, { paddingTop: insets.top + 20 }]}>

          {/* Patrón de puntos decorativos */}
          <View style={styles.headerDots} pointerEvents="none">
            {[...Array(6)].map((_, i) => (
              <View key={i} style={[styles.dot, { opacity: 0.08 + i * 0.03 }]} />
            ))}
          </View>

          <AnimatedShield />

          <Text style={styles.brandName}>FILTRA TU CAÑA</Text>
          <Text style={styles.brandSubtitle}>Consultas Vehicular · Perú</Text>

          <TricolorBar />

          {/* Badge de versión */}
          <View style={styles.versionBadge}>
            <FontAwesome5 name="circle" size={5} color={ORO} solid />
            <Text style={styles.versionText}>  v2.0 · 2025</Text>
          </View>
        </View>

        {/* ── Items del menú ── */}
        <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
          <SectionDivider label="MENÚ PRINCIPAL" />
          <View style={styles.drawerItemsContainer}>
            <DrawerItemList {...props} />
          </View>
        </Animated.View>

        {/* ── Footer ── */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.footerContent}>
            <View style={styles.footerFlag}>
              <View style={[styles.footerFlagStripe, { backgroundColor: ROJO }]} />
              <View style={[styles.footerFlagStripe, { backgroundColor: '#E8D5B7' }]} />
              <View style={[styles.footerFlagStripe, { backgroundColor: ROJO }]} />
            </View>
            <Text style={styles.footerText}>Hecho con ❤️ en Perú</Text>
          </View>
          <Text style={styles.footerCopy}>No copyright · Uso libre</Text>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

// ── Componente raíz ───────────────────────────────────────────────────────────
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: ROJO,
          drawerInactiveTintColor: TEXTO_MENU,
          drawerActiveBackgroundColor: 'rgba(200,16,46,0.09)',
          drawerStyle: {
            backgroundColor: CREMA,
            width: 300,
          },
          headerStyle: {
            backgroundColor: ROJO,
            elevation: 8,
            shadowColor: ROJO_OSCURO,
            shadowOpacity: 0.6,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 8,
          },
          headerTintColor: BLANCO,
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 17,
            letterSpacing: 0.5,
          },
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: '700',
            marginLeft: -4,
            color: TEXTO_MENU,
          },
          drawerItemStyle: {
            borderRadius: 14,
            marginVertical: 2,
            marginHorizontal: 6,
            paddingVertical: 2,
          },
        }}
      >
        {/* ── Pantallas visibles en el drawer ── */}
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Vehículo',
            title: 'Consultar Vehículo',
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="car" size={size - 2} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="papeletas"
          options={{
            drawerLabel: 'Papeletas y multas',
            title: '📄 Récord SUTRAN',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="municipales"
          options={{
            drawerLabel: 'Multas municipales',
            title: '🏛️ SAT / Municipios',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="office-building" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="seguros"
          options={{
            drawerLabel: 'Seguros',
            title: '🛡️ SOAT y Seguros',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="security" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="seguridad"
          options={{
            drawerLabel: 'Seguridad',
            title: '👮 Seguridad Vial',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="police-badge" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="servicios"
          options={{
            drawerLabel: 'Servicios',
            title: '⭐ Otros Servicios',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="star" size={size} color={color} />
            ),
          }}
        />

        {/* ── Pantallas ocultas del drawer ── */}
        <Drawer.Screen
          name="sunarp-webview"
          options={{
            drawerLabel: () => null,
            title: 'Consulta SUNARP',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREMA,
  },

  // Fondo
  bgStripeLeft: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 4, backgroundColor: ROJO, opacity: 0.6,
  },
  bgStripeRight: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: 4, backgroundColor: ROJO, opacity: 0.6,
  },
  diagonalAccent: {
    position: 'absolute',
    bottom: 80, right: -60,
    width: 160, height: 160,
    borderRadius: 80,
    backgroundColor: ROJO,
    opacity: 0.03,
    transform: [{ scaleX: 2 }],
  },

  // Header
  drawerHeader: {
    backgroundColor: ROJO,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 12,
    shadowColor: ROJO_OSCURO,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    overflow: 'hidden',
  },
  headerDots: {
    position: 'absolute',
    top: 12, right: 16,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: BLANCO,
  },

  // Escudo animado
  shieldWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldHalo: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: ORO,
    opacity: 0.15,
  },
  shieldRing: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2.5,
    borderColor: ORO,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ORO,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  shieldInner: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldSparkle: {
    position: 'absolute',
    top: 6, right: 6,
  },

  // Texto del header
  brandName: {
    color: BLANCO,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  brandSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 18,
    textTransform: 'uppercase',
  },

  // Tricolor
  tricolorBar: {
    flexDirection: 'row',
    width: 72,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: ORO,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 12,
  },
  tricolorSegment: { flex: 1 },

  // Badge versión
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
  },
  versionText: {
    color: ORO_CLARO,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Menú
  menuContainer: {
    flex: 1,
  },
  sectionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionLine: {
    flex: 1, height: 1,
    backgroundColor: ROJO,
    opacity: 0.18,
  },
  sectionPill: {
    backgroundColor: 'rgba(200,16,46,0.07)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(200,16,46,0.15)',
  },
  sectionText: {
    fontSize: 9,
    fontWeight: '800',
    color: ROJO,
    letterSpacing: 2.5,
    opacity: 0.85,
  },
  drawerItemsContainer: {
    paddingHorizontal: 4,
  },

  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,16,46,0.12)',
    alignItems: 'center',
    gap: 6,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerFlag: {
    flexDirection: 'row',
    width: 18, height: 12,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  footerFlagStripe: { flex: 1 },
  footerText: {
    fontSize: 12,
    color: TEXTO_MENU,
    fontWeight: '600',
    opacity: 0.75,
  },
  footerCopy: {
    fontSize: 10,
    color: TEXTO_MUTED,
    letterSpacing: 0.5,
  },
});