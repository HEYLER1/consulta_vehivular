import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

export function OptionItem({ icon, title, subtitle, color }: any) {
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
    marginBottom: 12,
  },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 15, color: '#333' },
  optionSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
});