import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PapeletasScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera Informativa */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="file-document-outline" size={35} color="white" />
          </View>
          <ThemedText type="title" style={styles.title}>Infracciones y Multas</ThemedText>
          <ThemedText style={styles.subtitle}>Consulta de infracciones de tránsito y transporte</ThemedText>
        </View>

        {/* Lista de Opciones de Papeletas */}
        <View style={styles.menuList}>
          
          <OptionItem 
            icon="business-outline" 
            title="Papeletas SAT" 
            subtitle="Infracciones en Lima (SAT)"
            color="#E53935"
          />

          <OptionItem 
            icon="clipboard-check-outline" 
            title="Record papeletas SUTRAN" 
            subtitle="Historial de infracciones en carreteras"
            color="#D32F2F"
          />

          <OptionItem 
            icon="cash-outline" 
            title="Monto papeletas" 
            subtitle="Costo actual y descuentos de multas"
            color="#388E3C"
          />

          <OptionItem 
            icon="bus-outline" 
            title="Multas ATU" 
            subtitle="Infracciones de transporte urbano"
            color="#1976D2"
          />

          <OptionItem 
            icon="camera-outline" 
            title="FotoPIT" 
            subtitle="Fotomultas registradas por cámaras"
            color="#455A64"
          />

        </View>
      </ScrollView>
    </ThemedView>
  );
}

// Componente para cada fila del menú
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
    backgroundColor: '#D32F2F', // Rojo SUTRAN
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
    padding: 15,
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
});