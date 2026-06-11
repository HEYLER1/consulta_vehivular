import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity, View, Alert, useColorScheme } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface PlacaVirtualProps {
  placa: string;
  onChangePlaca: (text: string) => void;
}

export function PlacaVirtual({ placa, onChangePlaca }: PlacaVirtualProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.placaContainer, { opacity: fadeAnim, borderColor: theme.brandAzul, backgroundColor: theme.background }]}>
      <View style={[styles.placaHeader, { backgroundColor: theme.background }]}>
        <View style={[styles.placaStrip, { backgroundColor: theme.brandOro }]} />
        <ThemedText style={[styles.placaLabel, { color: theme.brandAzul }]}>PERÚ</ThemedText>
        <View style={styles.placaLogoWrap}>
          <MaterialCommunityIcons name="shield-check" size={24} color={theme.brandAzul} />
        </View>
      </View>
      <View style={styles.placaContent}>
        <TextInput 
          style={[styles.placaTitle, { color: theme.brandAzul }]}
          placeholder="ABC-123"
          placeholderTextColor="#90A4AE"
          value={placa}
          onChangeText={onChangePlaca}
          autoCapitalize="characters"
          maxLength={7}
        />
        <ThemedText style={styles.placaSubtitle}>TOCA PARA EDITAR PLACA</ThemedText>
      </View>
      
      <TouchableOpacity 
        style={[styles.scanBadge, { backgroundColor: theme.brandOro }]} 
        onPress={() => Alert.alert("Escáner", "Escáner desactivado temporalmente")}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={20} color={theme.brandAzul} />
        <ThemedText style={[styles.scanText, { color: theme.brandAzul }]}>ESCANEAR PLACA</ThemedText>
      </TouchableOpacity>

      <View style={[styles.placaFooter, { backgroundColor: theme.brandAzul }]}>
        <ThemedText style={styles.placaFooterText}>PLACA ÚNICA NACIONAL DE RODAJE</ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  placaContainer: {
    borderRadius: 15,
    borderWidth: 5,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
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
    height: 6,
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
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  placaTitle: {
    fontSize: 54,
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
    marginBottom: 20,
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
