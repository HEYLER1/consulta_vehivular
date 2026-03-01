import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ServiciosScreen() {
  
  // Función para abrir WhatsApp (Simulando un número oficial)
  const openWhatsApp = () => {
    const phoneNumber = '51900000000'; // Sustituir por el número real
    const message = 'Hola, deseo realizar una consulta sobre trámites vehiculares.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("WhatsApp no está instalado en este dispositivo.");
      }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="star" size={40} color="white" />
          </View>
          <ThemedText type="title" style={styles.title}>Atención y Servicios</ThemedText>
          <ThemedText style={styles.subtitle}>Canales de ayuda y trámites adicionales</ThemedText>
        </View>

        {/* Lista de Opciones */}
        <View style={styles.menuList}>
          
          {/* BOTÓN WHATSAPP DESTACADO */}
          <TouchableOpacity 
            style={[styles.optionCard, styles.whatsappCard]} 
            onPress={openWhatsApp}
            activeOpacity={0.8}
          >
            <View style={styles.whatsappIconBox}>
              <Ionicons name="logo-whatsapp" size={30} color="white" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText type="defaultSemiBold" style={{ color: '#fff', fontSize: 16 }}>
                Canal WhatsApp
              </ThemedText>
              <ThemedText style={{ color: '#E8F5E9', fontSize: 12 }}>
                Chatea con un asesor en tiempo real
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          <OptionItem 
            icon="calendar-outline" 
            title="Citas en línea" 
            subtitle="Reserva de turnos para trámites"
            color="#607D8B"
          />

          <OptionItem 
            icon="help-buoy-outline" 
            title="Preguntas frecuentes" 
            subtitle="Guía rápida de ayuda al usuario"
            color="#FF9800"
          />

          <OptionItem 
            icon="location-outline" 
            title="Centros de atención" 
            subtitle="Ubica oficinas de SUNARP y SUTRAN"
            color="#D32F2F"
          />

        </View>

        {/* Footer Informativo */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            App de consulta informativa. No es una aplicación oficial del Gobierno del Perú.
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
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#FBC02D', // Dorado Servicios
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { opacity: 0.6, fontSize: 14, textAlign: 'center' },
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
  whatsappCard: {
    backgroundColor: '#25D366', // Color oficial WhatsApp
    borderWidth: 0,
    marginBottom: 10,
  },
  whatsappIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  footer: { marginTop: 40, paddingHorizontal: 20 },
  footerText: { fontSize: 11, color: '#999', textAlign: 'center', fontStyle: 'italic' },
});