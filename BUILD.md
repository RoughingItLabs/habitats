# Running Habitats on a Phone

Habitats uses **Skia** and **Reanimated**, which require a **development build** — not the standard Expo Go app.

## Prerequisites

- Node.js 20+
- **iPhone:** Mac with Xcode, Apple ID, USB cable (or same Wi‑Fi for wireless debugging)
- **Android:** Android Studio, USB debugging enabled on the phone

## One-time setup

```bash
cd /path/to/habitats
npm install
npx expo install expo-dev-client react-native-safe-area-context react-native-screens react-native-gesture-handler expo-linking expo-constants
npx expo prebuild
```

`prebuild` generates the `ios/` and `android/` native projects.

## Build and install on your phone

### iPhone (USB)

1. Connect the phone and trust the computer.
2. Open Xcode once and sign in with your Apple ID (Settings → Accounts).
3. Run:

```bash
npm run ios:device
```

Pick your phone when prompted. The first build can take several minutes.

### Android (USB)

1. Enable **Developer options** → **USB debugging** on the phone.
2. Run:

```bash
npm run android:device
```

## Day-to-day development

After the dev client is installed on the phone:

```bash
npm start
```

Scan the QR code in the terminal with the **camera** (iOS) or the dev client app (Android), or press `i` / `a` with the device connected.

## Simulator (no physical device)

```bash
npm run ios      # iOS Simulator
npm run android  # Android emulator
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `No bundle URL` | Start Metro first: `npm start`, then open the app |
| iOS signing error | Open `ios/habitats.xcworkspace` in Xcode → Signing & Capabilities → select your Team |
| Skia / native module error | Re-run `npx expo prebuild --clean` then `npm run ios:device` |
| Android device not listed | `adb devices` — accept the debugging prompt on the phone |

Bundle ID: `com.habitats.app` (iOS and Android).
