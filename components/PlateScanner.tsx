import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';

interface PlateScannerProps {
  visible: boolean;
  onClose: () => void;
  onPlateDetected: (plate: string) => void;
}

const AZUL_MTC = '#002B5C';
const ORO_PLACA = '#FFD600';

export function PlateScanner({ visible, onClose, onPlateDetected }: PlateScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  if (!permission) return null;

  const handleCapture = async () => {
    if (!cameraRef.current || isScanning) return;

    try {
      setIsScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      // Simulación de procesamiento OCR (En una app real aquí llamarías a una API o MLKit)
      // Para efectos del prototipo funcional, simularemos que detectamos una placa estándar
      setTimeout(() => {
        setIsScanning(false);
        const dummyPlate = "ABC-123"; 
        onPlateDetected(dummyPlate);
        onClose();
      }, 2000);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo procesar la imagen");
      setIsScanning(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {!permission.granted ? (
          <View style={styles.center}>
            <Text style={styles.text}>Necesitamos permiso para usar la cámara</Text>
            <TouchableOpacity style={styles.btn} onPress={requestPermission}>
              <Text style={styles.btnText}>Dar Permiso</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView style={styles.camera} ref={cameraRef}>
            <View style={styles.overlay}>
              {/* Marco de Escaneo Estilo Placa */}
              <View style={styles.scanFrame}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
                
                {isScanning && (
                  <View style={styles.scanningLine} />
                )}
              </View>

              <Text style={styles.hintText}>
                Encuadra la placa dentro del recuadro
              </Text>

              <View style={styles.controls}>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.captureBtn, isScanning && { opacity: 0.5 }]} 
                  onPress={handleCapture}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <ActivityIndicator color={AZUL_MTC} size="large" />
                  ) : (
                    <View style={styles.captureInner} />
                  )}
                </TouchableOpacity>

                <View style={{ width: 40 }} />
              </View>
            </View>
          </CameraView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 140,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderLeftWidth: 4, borderTopWidth: 4, borderColor: ORO_PLACA },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderRightWidth: 4, borderTopWidth: 4, borderColor: ORO_PLACA },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderLeftWidth: 4, borderBottomWidth: 4, borderColor: ORO_PLACA },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderRightWidth: 4, borderBottomWidth: 4, borderColor: ORO_PLACA },
  
  scanningLine: {
    width: '100%',
    height: 2,
    backgroundColor: ORO_PLACA,
    position: 'absolute',
    top: '50%',
    shadowColor: ORO_PLACA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },

  hintText: {
    color: 'white',
    marginTop: 30,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: AZUL_MTC,
  },
  closeBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  btn: { backgroundColor: ORO_PLACA, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  btnText: { color: AZUL_MTC, fontWeight: '900' },
});
