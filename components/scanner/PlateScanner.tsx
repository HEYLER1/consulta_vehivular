import React, { Component, lazy, Suspense } from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ScannerMessage } from './ScannerMessage';
import type { PlateScannerProps } from './types';
// Loading only on demand also keeps the other screens usable in Expo Go.
const NativeScanner = lazy(() => import('./NativePlateScanner'));
class ScannerBoundary extends Component<React.PropsWithChildren<{ onClose: () => void }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <ScannerMessage onClose={this.props.onClose} message="No se pudo iniciar el lector. Instala la versión de la aplicación que incluye el escáner o ingresa la placa manualmente." />;
    return this.props.children;
  }
}
export default function PlateScanner(props: PlateScannerProps) {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return <ScannerMessage onClose={props.onClose} message="El escáner en vivo necesita la versión instalada de esta aplicación. Mientras usas Expo Go puedes ingresar la placa manualmente." />;
  }
  return <ScannerBoundary onClose={props.onClose}>
    <Suspense fallback={<ScannerMessage onClose={props.onClose} message="Preparando cámara…" />}><NativeScanner {...props} /></Suspense>
  </ScannerBoundary>;
}
