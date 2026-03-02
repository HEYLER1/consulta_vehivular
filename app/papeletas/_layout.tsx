// app/papeletas/_layout.tsx
import { Stack } from 'expo-router';

export default function PapeletasLayout() {
  return (
    <Stack
      screenOptions={{
       animation: 'fade_from_bottom' , // más suave en Android,   // animación suave al entrar
        animationDuration: 300,
        gestureEnabled: true,            // swipe para volver en iOS
        gestureDirection: 'horizontal',
        headerShown: false,              // oculta el header nativo
      }}
    />
  );
}