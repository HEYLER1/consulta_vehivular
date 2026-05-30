import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

interface OptionItemProps {
  icon: string;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons';
  title: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function OptionItem({ 
  icon, 
  iconType = 'Ionicons',
  title, 
  subtitle, 
  color, 
  onPress,
  style 
}: OptionItemProps) {
  const IconComponent = iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity 
      style={[styles.optionCard, style]} 
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <IconComponent name={icon as any} size={24} color="white" />
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
    marginRight: 15 
  },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 15, color: '#333' },
  optionSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
});
