# Filtra Tu Caña - Consulta Vehicular Perú 🇵🇪

Una aplicación móvil moderna construida con **Expo SDK 54** diseñada para centralizar las consultas vehiculares más importantes en Perú. Optimizada para funcionar exclusivamente en **Expo Go** sin necesidad de compilaciones nativas.

## 🚀 Características Principales

- **Consulta SUNARP:** Acceso directo a datos de propiedad y tarjeta vehicular.
- **Récord de Papeletas:** Consulta de infracciones en el SAT (Lima), Callao y SUTRAN.
- **Multas Municipales:** Buscador integrado para más de 15 municipalidades provinciales.
- **Seguridad PNP:** Verificación de lunas polarizadas y requisitorias por robo.
- **Servicios Técnicos:** Consulta de vigencia de Revisión Técnica (CITV) y GNV/GLP.
- **SOAT:** Verificación de seguros vigentes vía APESEG.

## 🛠️ Stack Tecnológico

- **Framework:** [Expo SDK 54](https://expo.dev/)
- **Navegación:** [Expo Router v6](https://docs.expo.dev/router/introduction/) (Basado en File-based Routing)
- **UI:** React Native con Componentes Tematizados (Dark/Light mode).
- **WebViews:** Integración con portales oficiales mediante `react-native-webview`.

## 📦 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/HEYLER1/consulta_vehivular.git
   cd consulta_vehivular
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el proyecto:**
   ```bash
   npx expo start --clear
   ```

4. **Ejecutar en tu dispositivo:**
   - Descarga la app **Expo Go** en tu smartphone (Android o iOS).
   - Escanea el código QR que aparece en la terminal.

## 🔄 Reciente Migración (Vía Gemini CLI)

El proyecto ha sido optimizado recientemente para eliminar dependencias nativas pesadas como `react-native-reanimated` y `react-native-worklets`. 

- **Navegación:** Se migró de `Drawer` (Menú lateral) a `Tabs` (Barra inferior) para garantizar compatibilidad total con el runtime de **Expo Go**.
- **Estabilidad:** Se eliminaron errores de `TurboModule` y `NullPointerException` vinculados a módulos nativos no compatibles con el sandbox de Expo.
- **Limpieza:** Se corrigieron warnings de navegación obsoleta y se optimizó la estructura de rutas.

## 📂 Estructura del Proyecto

- `app/`: Contiene las rutas y layouts de la aplicación (Expo Router).
- `components/`: Componentes reutilizables como WebViews personalizados y UI elements.
- `constants/`: Configuraciones de sitios oficiales, colores y temas.
- `hooks/`: Custom hooks para manejo de estado global y temas.

## 📄 Notas Importantes

Esta aplicación es una herramienta informativa que facilita el acceso a portales públicos del estado peruano. No representa a ninguna entidad gubernamental de forma oficial.

---
Desarrollado con ❤️ para conductores y gestores vehiculares en Perú.
