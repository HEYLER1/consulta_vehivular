import { Pressable, StyleSheet, Text, View } from 'react-native';
export function ScannerMessage({ message, onClose }: { message: string; onClose: () => void }) {
  return <View style={styles.container}>
    <Text style={styles.title}>Escanear placa</Text>
    <Text style={styles.text}>{message}</Text>
    <Pressable accessibilityRole="button" onPress={onClose} style={styles.button}><Text style={styles.label}>Volver e ingresar la placa</Text></Pressable>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081525', justifyContent: 'center', padding: 28, gap: 24 },
  title: { color: '#FFF', fontSize: 26, fontWeight: '700' }, text: { color: '#CFD8E3', fontSize: 17, lineHeight: 25 },
  button: { backgroundColor: '#F2C94C', padding: 18, borderRadius: 14 }, label: { color: '#081525', textAlign: 'center', fontWeight: '700' },
});
