import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SeguridadScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="police-badge" size={40} color="white" />
          </View>
          <ThemedText type="title" style={styles.title}>Seguridad y Trámites PNP</ThemedText>
          <ThemedText style={styles.subtitle}>Consultas oficiales de la Policía Nacional del Perú</ThemedText>
        </View>

        {/* Lista de Opciones */}
        <View style={styles.menuList}>
          
          <OptionItem 
            icon="car-outline" 
            title="Consulta lunas polarizadas" 
            subtitle="Estado de permiso ante la PNP"
            color="#1A237E" // Azul Oscuro Policial
          />

          <OptionItem 
            icon="shield-search" 
            title="Requisitorias por robo" 
            subtitle="Verificar si el vehículo tiene orden de captura"
            color="#C62828" // Rojo Alerta
          />

          <OptionItem 
            icon="document-text-outline" 
            title="Denuncias policiales" 
            subtitle="Copia certificada de denuncias por pérdida"
            color="#455A64" // Gris Autoridad
          />

        </View>

        {/* Bloque de Información de Ayuda */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={24} color="#1A237E" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
              Recuerda
            </ThemedText>
            <ThemedText style={styles.infoText}>
              El permiso de lunas oscurecidas o polarizadas ahora es de vigencia indeterminada y está vinculado al vehículo.
            </ThemedText>
          </View>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

function OptionItem({ icon, title, subtitle, color }: any) {
  return (
    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color="white" />
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
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { opacity: 0.6, fontSize: 14, textAlign: 'center', marginTop: 5 },
  menuList: { gap: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 15, color: '#333' },
  optionSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  infoBox: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#E8EAF6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoIcon: { marginRight: 12, marginTop: 2 },
  infoTitle: { color: '#1A237E', fontSize: 14 },
  infoText: { fontSize: 12, color: '#3949AB', marginTop: 4, lineHeight: 18 },
});