import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { Technique } from './src/constants/phases';
import { colors } from './src/constants/theme';

// MVP: no navigation library yet. A single piece of state decides which
// screen is shown. Swap this for expo-router or React Navigation once you
// add more screens (Progress, Settings, onboarding, etc).
export default function App() {
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(
    null
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={['top', 'bottom']}
      >
        <StatusBar style="light" />
        {activeTechnique ? (
          <SessionScreen
            technique={activeTechnique}
            onClose={() => setActiveTechnique(null)}
            onComplete={(summary) => {
              // TODO: persist to AsyncStorage — session history + streak update
              console.log('Session complete:', summary);
              setActiveTechnique(null);
            }}
          />
        ) : (
          <HomeScreen
            streakDays={4}
            onSelectTechnique={setActiveTechnique}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
