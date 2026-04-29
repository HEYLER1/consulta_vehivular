// app/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROJO       = '#C8102E';
const ROJO_OSCURO = '#9B0B21';
const BLANCO     = '#FDF6F0';
const CREMA      = '#FDF6F0';
const ORO        = '#D4AF37';

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.flagLeft} />
        <View style={styles.flagCenter} />
        <View style={styles.flagRight} />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
        style={{ backgroundColor: 'white' }}
      >
        <View style={[styles.drawerHeader, { paddingTop: insets.top + 16 }]}>
          <View style={styles.shieldOuter}>
            <View style={styles.shieldInner}>
              <FontAwesome5 name="shield-alt" size={30} color={ORO} />
            </View>
          </View>
          <Text style={styles.brandName}>SUTRAN</Text>
          <Text style={styles.brandSubtitle}>Consultas Perú</Text>
          <View style={styles.tricolorBar}>
            <View style={[styles.tricolorSegment, { backgroundColor: ROJO }]} />
            <View style={[styles.tricolorSegment, { backgroundColor: BLANCO }]} />
            <View style={[styles.tricolorSegment, { backgroundColor: ROJO }]} />
          </View>
        </View>

        <View style={styles.sectionLabelWrap}>
          <View style={styles.sectionLabelLine} />
          <Text style={styles.sectionLabelText}>MENÚ PRINCIPAL</Text>
          <View style={styles.sectionLabelLine} />
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <FontAwesome5 name="flag" size={10} color={ROJO} />
          <Text style={styles.footerText}>  no copyright</Text>
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
          drawerActiveTintColor: ROJO,
          drawerInactiveTintColor: '#444',
          drawerActiveBackgroundColor: '#FFE5E9',
          headerStyle: {
            backgroundColor: ROJO,
            elevation: 6,
            shadowColor: ROJO_OSCURO,
            shadowOpacity: 0.5,
          },
          headerTintColor: BLANCO,
          headerTitleStyle: { fontWeight: '800', fontSize: 17 },
          drawerLabelStyle: { fontSize: 14, fontWeight: '700', marginLeft: -6 },
          drawerItemStyle: {
            borderRadius: 12,
            marginVertical: 1,
            marginHorizontal: 4,
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

        {/* ── Pantallas OCULTAS del drawer (sub-pantallas internas) ── */}
        <Drawer.Screen
          name="sunarp-webview"
          options={{
            drawerLabel: () => null,
            title: 'Consulta SUNARP',
            headerShown: false,        // usa su propia barra personalizada
            drawerItemStyle: { display: 'none' }, // ← oculta del menú
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREMA },

  flagLeft: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: '33.3%', backgroundColor: ROJO, opacity: 0.08,
  },
  flagCenter: {
    position: 'absolute', left: '33.3%', top: 0, bottom: 0,
    width: '33.4%', backgroundColor: BLANCO, opacity: 0.5,
  },
  flagRight: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: '33.3%', backgroundColor: ROJO, opacity: 0.08,
  },

  drawerHeader: {
    backgroundColor: ROJO,
    paddingBottom: 22,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 10,
    shadowColor: ROJO_OSCURO,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  shieldOuter: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2, borderColor: ORO,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
    shadowColor: ORO,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 8,
  },
  shieldInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  brandName: {
    color: BLANCO, fontSize: 22, fontWeight: '900',
    letterSpacing: 4, textTransform: 'uppercase',
  },
  brandSubtitle: {
    color: 'rgba(255,255,255,0.75)', fontSize: 11,
    letterSpacing: 1.5, marginTop: 3, marginBottom: 16,
    textTransform: 'uppercase',
  },
  tricolorBar: {
    flexDirection: 'row', width: 80, height: 4,
    borderRadius: 2, overflow: 'hidden',
  },
  tricolorSegment: { flex: 1 },

  sectionLabelWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 20, marginBottom: 6,
  },
  sectionLabelLine: {
    flex: 1, height: 1, backgroundColor: ROJO, opacity: 0.25,
  },
  sectionLabelText: {
    fontSize: 9, fontWeight: '800', color: ROJO,
    letterSpacing: 2, marginHorizontal: 8, opacity: 0.7,
  },

  drawerItemsContainer: { paddingHorizontal: 6 },

  footer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingTop: 10, marginTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(200,16,46,0.15)',
  },
  footerText: {
    fontSize: 11, color: ROJO, fontWeight: '600', opacity: 0.7,
  },
});