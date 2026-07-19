import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { Technique } from './src/constants/phases';
import { colors } from './src/constants/theme';
import { saveSession, getSessions, getCurrentStreak } from './src/services/sessionStore';

export default function App() {
    const [activeTechnique, setActiveTechnique] = useState<Technique | null>(
        null
    );
    const [streakDays, setStreakDays] = useState(0);

    const refreshStreak = async () => {
        try {
            const sessions = await getSessions();
            setStreakDays(getCurrentStreak(sessions));
        } catch (error) {
            console.error('Could not load streak:', error);
        }
    };

    useEffect(() => {
        refreshStreak();
    }, []);

    const onComplete = async (summary: { techniqueId: string; cyclesCompleted: number }) => {
        try {
            await saveSession(summary);
            console.log('Session saved');
            await refreshStreak();
        } catch (error) {
            console.error('Could not save session, continuing anyway:', error);
        }
        setActiveTechnique(null);
    };

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
                        onComplete={onComplete}
                    />
                ) : (
                    <HomeScreen
                        streakDays={streakDays}
                        onSelectTechnique={setActiveTechnique}
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}