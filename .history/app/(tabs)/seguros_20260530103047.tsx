import { OptionItem } from '@/components/OptionItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SegurosScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="shield-alt" size={35} color="white" />
          </View>
          <ThemedText type="title" style={styles.title}>Seguros y Siniestros</ThemedText>
          <ThemedText style={styles.subtitle}>Consulta de SOAT y asistencia en accidentes</ThemedText>
        </View>

        {/* Lista de Opciones */}
        <View style={styles.menuList}>
          
          <OptionItem 
            icon="checkmark-circle-outline" 
            title="Consulta SOAT (APESEG)" 
            subtitle="Verifica la vigencia de tu seguro obligatorio"
            color="#2E7D32" // Verde seguridad
          />

          <OptionItem 
            icon="pricetag-outline" 
            title="Precios referenciales" 
            subtitle="Compara costos aproximados de seguros"
            color="#1976D2" // Azul informativo
          />

          <OptionItem 
            icon="car-outline" 
            title="Choques y siniestros" 
            subtitle="Guía de pasos en caso de accidente"
            color="#D32F2F" // Rojo alerta
          />

        </View>

        {/* Nota de Emergencia */}
        <View style={styles.emergencyBox}>
          <Ionicons name="alert-circle" size={24} color="#D32F2F" />
          <ThemedText style={styles.emergencyText}>
            En caso de emergencia grave, llama al <ThemedText type="defaultSemiBold">110</ThemedText> (Policía de Carreteras).
          </ThemedText>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { opacity: 0.6, fontSize: 14, textAlign: 'center' },
  menuList: { gap: 12 },
  emergencyBox: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  emergencyText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#B71C1C',
  }
});
