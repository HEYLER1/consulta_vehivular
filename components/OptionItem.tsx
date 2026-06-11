import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

interface OptionItemProps {
  icon: string;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons';
  title: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
  style?: ViewStyle;
  isLast?: boolean;
}

export function OptionItem({ 
  icon, 
  iconType = 'Ionicons',
  title, 
  subtitle, 
  color, 
  onPress,
  style,
  isLast = false
}: OptionItemProps) {
  const IconComponent = iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity 
      style={[styles.listItem, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.backgroundGris }, style]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.listIconBox, { backgroundColor: color + '10' }]}>
        <IconComponent name={icon as any} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={[styles.listTitle, { color: theme.textoTitulo }]}>{title}</ThemedText>
        <ThemedText style={[styles.listSubtitle, { color: theme.textoMuted }]}>{subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#B0BEC5" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  listIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  listTitle: { fontSize: 15, fontWeight: '800' },
  listSubtitle: { fontSize: 12, marginTop: 2 },
});
