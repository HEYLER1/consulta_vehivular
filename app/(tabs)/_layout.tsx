import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textoMuted,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: 'rgba(0,0,0,0.05)',
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: theme.brandAzul,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vehiculo"
        options={{
          title: 'Trámites',
          tabBarLabel: 'Vehículo',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="car" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="papeletas"
        options={{
          title: 'Papeletas',
          tabBarLabel: 'Papeletas',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="municipales"
        options={{
          title: 'Municipales',
          tabBarLabel: 'Munis',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="office-building" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="seguros"
        options={{
          title: 'Seguros',
          tabBarLabel: 'Seguros',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="security" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="seguridad"
        options={{
          href: null, // Ocultar de la barra si son muchas opciones
        }}
      />
      <Tabs.Screen
        name="servicios"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
