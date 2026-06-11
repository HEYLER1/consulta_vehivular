import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OptionItem } from '@/components/OptionItem';
import { Colors } from '@/constants/theme';

function VehiculoScreen() {
  const [plate, setPlate] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const navigateToService = (pathname: string, params: Record<string, string> = {}) => {
    router.push({ pathname: pathname as any, params: { ...params, plate } });
  };

  const checkPlateAndNavigate = (pathname: string, params: Record<string, string> = {}) => {
    if (!plate) {
      Alert.alert("Placa Requerida", "Por favor ingresa o escanea una placa primero.");
      return;
    }
    navigateToService(pathname, params);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.backgroundGris }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.brandRojo }]}>
            <FontAwesome5 name="car" size={35} color={theme.background} />
          </View>
          <ThemedText type="title">Trámites y Consultas</ThemedText>
          <ThemedText style={styles.subtitle}>Gestión vehicular SUNARP y técnica</ThemedText>
        </View>

        {/* Buscador de Placa */}
        <View style={[styles.searchSection, { backgroundColor: theme.background, borderColor: theme.backgroundGris }]}>
          <ThemedText type="defaultSemiBold" style={[styles.label, { color: theme.brandAzul }]}>Placa del Vehículo</ThemedText>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.backgroundGris, color: theme.textoTitulo }]}
              placeholder="Ej: ABC-123"
              placeholderTextColor="#999"
              value={plate}
              onChangeText={(text) => setPlate(text.toUpperCase())}
              maxLength={7}
            />
            <TouchableOpacity 
              style={[styles.scannerBtn, { backgroundColor: theme.brandAzul }]}
              onPress={() => Alert.alert("Escáner", "Escáner desactivado temporalmente")}
            >
              <Ionicons name="camera" size={24} color={theme.background} />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.searchHint}>Ingresa o escanea la placa para autocompletar</ThemedText>
        </View>

        <View style={[styles.menuList, { backgroundColor: theme.background }]}>
          <OptionItem 
            icon="search-outline" 
            title="Consulta vehicular (SUNARP)" 
            subtitle="Datos de tarjeta de propiedad" 
            color={theme.brandRojo} 
            onPress={() => checkPlateAndNavigate('/viewer/vehicular/sunarp')} 
          />
          <OptionItem 
            icon="history" 
            iconType="MaterialCommunityIcons"
            title="Historial de Propietarios" 
            subtitle="Transferencias registradas" 
            color="#002B5C" 
            onPress={() => checkPlateAndNavigate('/viewer/vehicular/duenos')} 
          />
          <OptionItem 
            icon="cash-outline" 
            title="Precio pagado" 
            subtitle="Valor de transferencia" 
            color="#388E3C" 
            onPress={() => checkPlateAndNavigate('/viewer/vehicular/sunarp')} 
          />
          <OptionItem 
            icon="hammer-outline" 
            title="Inspección técnica" 
            subtitle="Estado de revisiones (CITV)" 
            color="#7B1FA2" 
            onPress={() => checkPlateAndNavigate('/viewer/vehicular/citv')} 
          />
          <OptionItem 
            icon="flame-outline" 
            title="Vigencia GNV/GLP" 
            subtitle="Certificación de gas" 
            color="#E64A19" 
            onPress={() => checkPlateAndNavigate('/viewer/vehicular/gnv')} 
            isLast={true}
          />
        </View>
      </ScrollView>

    </ThemedView>
  );
}

export default VehiculoScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  subtitle: { opacity: 0.6, fontSize: 14 },
  
  searchSection: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
  },
  label: { marginBottom: 10, fontSize: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 2,
  },
  scannerBtn: {
    width: 55,
    height: 55,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  searchHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },

  menuList: {
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    paddingBottom: 0,
  },
});
