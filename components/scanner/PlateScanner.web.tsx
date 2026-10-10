import { ScannerMessage } from './ScannerMessage';
import type { PlateScannerProps } from './types';
export default function PlateScanner({ onClose }: PlateScannerProps) {
  return <ScannerMessage onClose={onClose} message="El escaneo en vivo está disponible en la aplicación móvil instalada. Aquí puedes ingresar la placa manualmente." />;
}
