// app/(tabs)/_layout.tsx
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

// ── Paleta Identidad Vehicular Perú (MTC / Placa Única) ────────────────────────
const AZUL_MTC       = '#002B5C'; // Azul institucional profundo (Autoridad)
const ORO_PLACA      = '#FFD600'; // Amarillo vibrante de la Placa Nacional
const BLANCO         = '#FFFFFF';
const ROJO           = '#C8102E';
const TEXTO_MENU     = '#1A1A2E';
const TEXTO_MUTED    = '#6B7280';
const CREMA          = '#F8F9FA';

// ── Animación del escudo ──────────────────────────────────────────────────────
function AnimatedShield() {
  const scale  = useRef(new Animated.Value(0.85)).current;
  const glow   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Animated.View style={[styles.shieldWrapper, { transform: [{ scale }] }]}>
      <View style={styles.shieldRing}>
        <View style={styles.shieldInner}>
          <FontAwesome5 name="shield-alt" size={32} color={ORO_PLACA} />
          <Animated.View style={[styles.shieldSparkle, { opacity: glowOpacity }]}>
            <FontAwesome5 name="star" size={8} color={ORO_PLACA} />
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Contenido del Drawer ──────────────────────────────────────────────────────
function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header Institucional */}
        <View style={[styles.drawerHeader, { paddingTop: insets.top + 20 }]}>
          <AnimatedShield />
          <Text style={styles.brandName}>FILTRA TU CAÑA</Text>
          <Text style={styles.brandSubtitle}>Consultas Vehiculares · Perú</Text>
          
          <View style={styles.placaBadge}>
            <Text style={styles.placaText}>MTC OFFICIAL</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <DrawerItemList {...props} />
        </View>

        {/* Footer con Bandera */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.peruFlag}>
            <View style={[styles.flagStripe, { backgroundColor: ROJO }]} />
            <View style={[styles.flagStripe, { backgroundColor: BLANCO }]} />
            <View style={[styles.flagStripe, { backgroundColor: ROJO }]} />
          </View>
          <Text style={styles.footerText}>Servicio de Información Nacional</Text>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: AZUL_MTC,
          drawerInactiveTintColor: TEXTO_MENU,
          drawerActiveBackgroundColor: 'rgba(0,43,92,0.06)',
          drawerStyle: { backgroundColor: BLANCO, width: 280 },
          headerStyle: {
            backgroundColor: AZUL_MTC,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
          },
          headerTintColor: ORO_PLACA,
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 16,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: '700',
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginVertical: 4,
            marginHorizontal: 8,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Vehículo',
            title: 'Datos del Vehículo',
            drawerIcon: ({ color, size }) => <FontAwesome5 name="car" size={size - 2} color={color} />,
          }}
        />
        <Drawer.Screen
          name="papeletas"
          options={{
            drawerLabel: 'Papeletas',
            title: 'Récord de Papeletas',
            drawerIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="municipales"
          options={{
            drawerLabel: 'Municipalidades',
            title: 'Multas Municipales',
            drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="office-building" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="seguros"
          options={{
            drawerLabel: 'Seguros',
            title: 'SOAT y Seguros',
            drawerIcon: ({ color, size }) => <MaterialIcons name="security" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="seguridad"
          options={{
            drawerLabel: 'Seguridad',
            title: 'Seguridad Vial',
            drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="police-badge" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="servicios"
          options={{
            drawerLabel: 'Servicios',
            title: 'Otros Servicios',
            drawerIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="sunarp-webview"
          options={{
            drawerLabel: () => null,
            title: 'SUNARP',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BLANCO },
  drawerHeader: {
    backgroundColor: AZUL_MTC,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  shieldWrapper: { marginBottom: 12 },
  shieldRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: ORO_PLACA,
    justifyContent: 'center', alignItems: 'center',
  },
  shieldInner: { justifyContent: 'center', alignItems: 'center' },
  shieldSparkle: { position: 'absolute', top: -4, right: -4 },
  brandName: {
    color: BLANCO, fontSize: 18, fontWeight: '900', letterSpacing: 4,
  },
  brandSubtitle: {
    color: 'rgba(255,214,0,0.8)', fontSize: 10, fontWeight: '700', marginTop: 4,
  },
  placaBadge: {
    marginTop: 15, backgroundColor: ORO_PLACA, paddingHorizontal: 12, paddingVertical: 2, borderRadius: 4,
  },
  placaText: { color: AZUL_MTC, fontSize: 9, fontWeight: '900' },
  menuContainer: { flex: 1, paddingTop: 15 },
  footer: { alignItems: 'center', gap: 10 },
  peruFlag: { flexDirection: 'row', width: 30, height: 20, borderRadius: 2, overflow: 'hidden' },
  flagStripe: { flex: 1 },
  footerText: { fontSize: 10, color: TEXTO_MUTED, fontWeight: '600' },
});
