import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { SessionCompleteScreen } from './src/screens/SessionCompleteScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { Technique, TECHNIQUES } from './src/constants/phases';
import { colors } from './src/constants/theme';
import { saveSession, getSessions, getCurrentStreak } from './src/services/sessionStore';
import {
    getDefaultTechniqueId,
    setDefaultTechniqueId,
    getHapticsEnabled,
    setHapticsEnabled,
    getCycleCounts,
    setCycleCount,
} from './src/services/settingsStore';

export default function App() {
    const [activeTechnique, setActiveTechnique] = useState<Technique | null>(
        null
    );
    const [streakDays, setStreakDays] = useState(0);
    const [defaultTechniqueId, setDefaultTechniqueIdState] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [hapticsEnabled, setHapticsEnabledState] = useState(true);
    const [cycleCounts, setCycleCountsState] = useState<Record<string, number>>({});
    const [completedSummary, setCompletedSummary] = useState<{
        techniqueLabel: string;
        cyclesCompleted: number;
        durationSec: number;
    } | null>(null);

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

    useEffect(() => {
        (async () => {
            try {
                const id = await getDefaultTechniqueId();
                setDefaultTechniqueIdState(id);
                const defaultTechnique = TECHNIQUES.find((t) => t.id === id);
                if (defaultTechnique) {
                    setActiveTechnique(defaultTechnique);
                }
            } catch (error) {
                console.error('Could not load default technique:', error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const [haptics, counts] = await Promise.all([
                    getHapticsEnabled(),
                    getCycleCounts(),
                ]);
                setHapticsEnabledState(haptics);
                setCycleCountsState(counts);
            } catch (error) {
                console.error('Could not load settings:', error);
            }
        })();
    }, []);

    const handleChangeHapticsEnabled = async (enabled: boolean) => {
        setHapticsEnabledState(enabled);
        try {
            await setHapticsEnabled(enabled);
        } catch (error) {
            console.error('Could not save haptics setting:', error);
        }
    };

    const handleChangeCycleCount = async (techniqueId: string, count: number) => {
        setCycleCountsState((prev) => ({ ...prev, [techniqueId]: count }));
        try {
            await setCycleCount(techniqueId, count);
        } catch (error) {
            console.error('Could not save cycle count:', error);
        }
    };

    const handleToggleDefault = async (techniqueId: string) => {
        const next = defaultTechniqueId === techniqueId ? null : techniqueId;
        try {
            await setDefaultTechniqueId(next);
            setDefaultTechniqueIdState(next);
        } catch (error) {
            console.error('Could not update default technique:', error);
        }
    };

    const onComplete = async (summary: {
        techniqueId: string;
        cyclesCompleted: number;
        durationSec: number;
    }) => {
        try {
            await saveSession({
                techniqueId: summary.techniqueId,
                cyclesCompleted: summary.cyclesCompleted,
            });
            await refreshStreak();
        } catch (error) {
            console.error('Could not save session, continuing anyway:', error);
        }
        const technique = TECHNIQUES.find((t) => t.id === summary.techniqueId);
        setCompletedSummary({
            techniqueLabel: technique?.label ?? summary.techniqueId,
            cyclesCompleted: summary.cyclesCompleted,
            durationSec: summary.durationSec,
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: colors.background }}
                edges={['top', 'bottom']}
            >
                <StatusBar style="light" />
                {completedSummary ? (
                    <SessionCompleteScreen
                        techniqueLabel={completedSummary.techniqueLabel}
                        cyclesCompleted={completedSummary.cyclesCompleted}
                        durationSec={completedSummary.durationSec}
                        streakDays={streakDays}
                        onDone={() => {
                            setCompletedSummary(null);
                            setActiveTechnique(null);
                        }}
                    />
                ) : activeTechnique ? (
                    <SessionScreen
                        technique={activeTechnique}
                        onClose={() => setActiveTechnique(null)}
                        onComplete={onComplete}
                        isDefault={defaultTechniqueId === activeTechnique.id}
                        onToggleDefault={() => handleToggleDefault(activeTechnique.id)}
                        cycleCount={cycleCounts[activeTechnique.id] ?? activeTechnique.defaultCycles}
                        hapticsEnabled={hapticsEnabled}
                    />
                ) : showSettings ? (
                    <SettingsScreen
                        onClose={() => setShowSettings(false)}
                        cycleCounts={cycleCounts}
                        onChangeCycleCount={handleChangeCycleCount}
                        hapticsEnabled={hapticsEnabled}
                        onChangeHapticsEnabled={handleChangeHapticsEnabled}
                    />
                ) : showProgress ? (
                    <ProgressScreen onClose={() => setShowProgress(false)} />
                ) : (
                    <HomeScreen
                        streakDays={streakDays}
                        onSelectTechnique={setActiveTechnique}
                        defaultTechniqueId={defaultTechniqueId}
                        onOpenSettings={() => setShowSettings(true)}
                        onOpenProgress={() => setShowProgress(true)}
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}