#!/bin/bash
set -euo pipefail
project_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_root"
tools_root="${CONSULTA_ANDROID_TOOLS:-$project_root/.local-build}"
if [ -z "${JAVA_HOME:-}" ]; then
  java_candidates=("$tools_root"/jdk-*/Contents/Home)
  if [ ! -x "${java_candidates[0]}/bin/java" ]; then
    echo 'Configura JAVA_HOME con Java 17 o recupera las herramientas de .local-build.' >&2
    exit 1
  fi
  export JAVA_HOME="${java_candidates[0]}"
fi
export ANDROID_HOME="${ANDROID_HOME:-$tools_root/sdk}"
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$tools_root/gradle}"
export NODE_ENV=production
if [ ! -d "$ANDROID_HOME/platforms/android-36" ]; then
  echo 'Falta Android SDK 36. Configura ANDROID_HOME o recupera .local-build/sdk.' >&2
  exit 1
fi
npm run postinstall
CI=1 ./node_modules/.bin/expo prebuild --clean --platform android --no-install
(
  cd android
  ./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a --max-workers=2 --console=plain --no-daemon \
    -Dorg.gradle.internal.http.connectionTimeout=30000 -Dorg.gradle.internal.http.socketTimeout=30000 "$@"
)
mkdir -p artifacts
apk_version="$(node -p "require('./app.json').expo.version")"
apk_output="artifacts/consulta-vehicular-munis-$apk_version.apk"
cp android/app/build/outputs/apk/release/app-release.apk "$apk_output"
echo "APK de prueba: $project_root/$apk_output"
