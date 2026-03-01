import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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

function OptionItem({ icon, title, subtitle, color }: any) {
  return (
    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold" style={styles.optionTitle}>{title}</ThemedText>
        <ThemedText style={styles.optionSubtitle}>{subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
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
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 15, color: '#333' },
  optionSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
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