# Breathe App — MVP Scaffold

Box breathing + 4-7-8, built with Expo (React Native). Ocean Breath theme.

This folder contains the **source files only** (`App.tsx` + `src/`). You'll
generate a real Expo project first, then drop these files in on top.

---

## 1. Install prerequisites (one-time)

- **Node.js** — LTS version (18 or 20). Check with `node -v` in a terminal.
- **Expo Go app** on your phone (iOS App Store / Google Play) — this is how
  you preview the app live on your own phone without a full native build.
- **Git** — you likely have this already.

No Android Studio / Xcode needed yet for MVP — Expo Go handles it.

---

## 2. Create the Expo project

In WebStorm, open a terminal (Alt+F12 or the Terminal tab at the bottom) and run:

```bash
npx create-expo-app breathe-app --template blank-typescript
cd breathe-app
```

This scaffolds a fresh TypeScript Expo project with its own `package.json`,
`App.tsx`, `app.json`, etc.

---

## 3. Install the extra dependencies this scaffold uses

```bash
npx expo install @expo/vector-icons react-native-safe-area-context
```

Using `npx expo install` instead of plain `npm install` matters — Expo
resolves the correct compatible version for whatever Expo SDK version your
project is on.

---

## 4. Drop in these files

Copy `App.tsx` and the entire `src/` folder from this scaffold into your new
`breathe-app` project root, overwriting the placeholder `App.tsx` that
`create-expo-app` generated.

Your project structure should look like:

```
breathe-app/
├── App.tsx
├── app.json
├── package.json
├── src/
│   ├── components/
│   │   └── BreathingCircle.tsx
│   ├── constants/
│   │   ├── phases.ts
│   │   └── theme.ts
│   ├── hooks/
│   │   └── useBreathingCycle.ts
│   └── screens/
│       ├── HomeScreen.tsx
│       └── SessionScreen.tsx
```

---

## 5. Open in WebStorm

- `File → Open` and select the `breathe-app` folder.
- WebStorm should auto-detect it as a Node/React Native project and offer to
  install the TypeScript service — accept that.
- If you get red squiggly import errors on first open, run
  `File → Invalidate Caches / Restart` once dependencies are installed —
  WebStorm's TS server sometimes needs a nudge after a fresh `npm install`.

---

## 6. Run it

```bash
npx expo start
```

This opens a QR code in your terminal / browser (Metro Bundler dev tools).

- **On your phone**: open the Expo Go app and scan the QR code (iOS: use the
  Camera app instead, it'll offer to open in Expo Go).
- **iOS Simulator / Android Emulator**: press `i` or `a` in the terminal
  where `expo start` is running, if you have Xcode/Android Studio set up.
  Not required for MVP — your phone is faster to iterate on.

Any time you save a file, the app hot-reloads on your phone automatically.

---

## 7. Push to GitHub

```bash
git init
git add .
git commit -m "Initial breathing app scaffold: box breathing + 4-7-8"
```

Then create an empty repo on GitHub (no README/gitignore, since you already
have files), and:

```bash
git remote add origin https://github.com/<your-username>/breathe-app.git
git branch -M main
git push -u origin main
```

`create-expo-app` already generates a sensible `.gitignore` (excludes
`node_modules`, `.expo`, build artifacts) — no extra setup needed there.

---

## What's intentionally NOT in this MVP scaffold

- **No navigation library** — `App.tsx` just toggles between Home and
  Session with local state. Fine for 2 screens; swap in `expo-router` once
  you add Progress/Settings/onboarding.
- **No persistence** — streak count is hardcoded (`4`), and session
  completion just does `console.log`. Next step: `@react-native-async-storage/async-storage`
  to save session history and compute the real streak.
- **No sound/haptics** — worth adding early since you'll likely use this
  eyes-closed. `expo-haptics` for phase-transition taps is a quick win.

## Suggested next steps, in order

1. Get it running on your phone via Expo Go, confirm both techniques feel
   right for your own daily use.
2. Add `AsyncStorage` for session history + real streak calculation.
3. Add `expo-haptics` on phase transitions.
4. Build the Progress screen (calendar heatmap of completed sessions).
5. Only then: navigation library, if you're adding more screens.
