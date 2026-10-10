import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import PlateScanner from './scanner/PlateScanner';
import { ThemedText } from './themed-text';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface PlacaVirtualProps {
  placa: string;
  onChangePlaca: (text: string) => void;
}

export function PlacaVirtual({ placa, onChangePlaca }: PlacaVirtualProps) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.placaContainer, { opacity: fadeAnim, borderColor: theme.border, backgroundColor: theme.background }]}>
      <View style={[styles.placaHeader, { backgroundColor: theme.background }]}>
        <View style={[styles.placaStrip, { backgroundColor: theme.brandOro }]} />
        <ThemedText style={[styles.placaLabel, { color: theme.tint }]}>PERÚ</ThemedText>
        <View style={styles.placaLogoWrap}>
          <MaterialCommunityIcons name="car-outline" size={24} color={theme.brandAzul} />
        </View>
      </View>
      <View style={styles.placaContent}>
        <TextInput 
          accessibilityLabel="Número de placa"
          style={[styles.placaTitle, { color: theme.tint }]}
          placeholder="ABC-123"
          placeholderTextColor="#90A4AE"
          value={placa}
          onChangeText={onChangePlaca}
          autoCapitalize="characters"
          maxLength={7}
        />
        <ThemedText style={styles.placaSubtitle}>INGRESA O ESCANEA TU PLACA</ThemedText>
      </View>
      
      <TouchableOpacity 
        accessibilityRole="button"
        accessibilityLabel="Escanear placa con la cámara"
        style={[styles.scanBadge, { backgroundColor: theme.brandOro }]} 
        onPress={() => setScannerOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={20} color={theme.brandAzul} />
        <ThemedText style={[styles.scanText, { color: theme.tint }]}>ESCANEAR PLACA</ThemedText>
      </TouchableOpacity>
      <Modal visible={scannerOpen} animationType="slide" onRequestClose={() => setScannerOpen(false)}>
        {scannerOpen && <PlateScanner onClose={() => setScannerOpen(false)} onConfirm={value => { onChangePlaca(value); setScannerOpen(false); }} />}
      </Modal>


    </Animated.View>
  );
}

const styles = StyleSheet.create({
  placaContainer: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    alignItems: 'center',
  },
  placaHeader: {
    width: '100%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placaStrip: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 3,
  },
  placaLabel: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 6,
  },
  placaLogoWrap: {
    position: 'absolute',
    right: 12,
  },
  placaContent: {
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  placaTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
    width: '100%',
    padding: 0,
  },
  placaSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#90A4AE',
    marginTop: -5,
    letterSpacing: 2,
  },
  scanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    gap: 8,
    elevation: 3,
  },
  scanText: {
    fontSize: 12,
    fontWeight: '900',
  },
  placaFooter: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  placaFooterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
