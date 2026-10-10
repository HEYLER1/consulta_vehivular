// Small, version-checked native fixes. Fail loudly if upstream changes these paths.
const fs = require('node:fs');
const path = require('node:path');
const root = path.dirname(require.resolve('react-native-vision-camera-ocr-plus/package.json'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.version !== '1.2.9') throw new Error('Review native OCR fixes before upgrading from 1.2.9');
function replace(file, before, after) {
  const target = path.join(root, file);
  const content = fs.readFileSync(target, 'utf8');
  if (!content.includes(before)) {
    if (content.includes(after)) return;
    throw new Error(`OCR patch no longer matches: ${file}`);
  }
  fs.writeFileSync(target, content.split(before).join(after));
}
// Bundle the Latin model so the first scan does not wait for Play Services downloads.
replace('android/build.gradle', "implementation 'com.google.android.gms:play-services-mlkit-text-recognition:19.0.1'", "implementation 'com.google.mlkit:text-recognition:16.0.1'");
// Cached responses are not independent readings and must never count toward consensus.
replace('android/src/main/java/com/rnvisioncameraocr/RNVisionCameraOCRPlugin.kt', 'return getCachedResult()', 'return null // plate-scanner: no cached evidence');
replace('android/src/main/java/com/rnvisioncameraocr/RNVisionCameraOCRPlugin.kt', '            getCachedResult()\n        } finally', '            throw e // plate-scanner: surface OCR failures\n        } finally');
replace('ios/RNVisionCameraOCR.swift', 'return getCachedResult()', 'return [:] // plate-scanner: no cached evidence');
// Worklets otherwise uses AGP's default NDK, different from Expo/React Native.
const workletsRoot = path.dirname(require.resolve('react-native-worklets-core/package.json'));
const workletsPackage = JSON.parse(fs.readFileSync(path.join(workletsRoot, 'package.json'), 'utf8'));
if (workletsPackage.version !== '1.6.3') throw new Error('Review NDK alignment before upgrading Worklets Core');
const gradlePath = path.join(workletsRoot, 'android/build.gradle');
const gradle = fs.readFileSync(gradlePath, 'utf8');
const compileSdkLine = '  compileSdkVersion getExtOrIntegerDefault("compileSdkVersion")';
const ndkLine = '  ndkVersion rootProject.ext.ndkVersion // plate-scanner: use Expo NDK';
if (!gradle.includes(ndkLine)) {
  if (!gradle.includes(compileSdkLine)) throw new Error('Worklets NDK patch no longer matches');
  fs.writeFileSync(gradlePath, gradle.replace(compileSdkLine, `${compileSdkLine}\n${ndkLine}`));
}
console.log('OCR native fixes and Worklets NDK alignment ready.');
