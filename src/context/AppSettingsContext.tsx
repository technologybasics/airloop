import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveSession, getSessions, getCurrentStreak } from '../services/sessionStore';
import {
    getDefaultTechniqueId,
    setDefaultTechniqueId,
    getHapticsEnabled,
    setHapticsEnabled,
    getCycleCounts,
    setCycleCount,
    getHasOnboarded,
    setHasOnboarded,
} from '../services/settingsStore';

type AppSettingsContextValue = {
    hasOnboarded: boolean | null; // null while the initial async load is in flight
    completeOnboarding: () => Promise<void>;
    streakDays: number;
    defaultTechniqueId: string | null;
    toggleDefaultTechnique: (techniqueId: string) => Promise<void>;
    hapticsEnabled: boolean;
    changeHapticsEnabled: (enabled: boolean) => Promise<void>;
    cycleCounts: Record<string, number>;
    changeCycleCount: (techniqueId: string, count: number) => Promise<void>;
    recordSessionComplete: (summary: {
        techniqueId: string;
        cyclesCompleted: number;
    }) => Promise<void>;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
    const [streakDays, setStreakDays] = useState(0);
    const [defaultTechniqueId, setDefaultTechniqueIdState] = useState<string | null>(null);
    const [hapticsEnabled, setHapticsEnabledState] = useState(true);
    const [cycleCounts, setCycleCountsState] = useState<Record<string, number>>({});
    const [hasOnboarded, setHasOnboardedState] = useState<boolean | null>(null);

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
            } catch (error) {
                console.error('Could not load default technique:', error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const [haptics, counts, onboarded] = await Promise.all([
                    getHapticsEnabled(),
                    getCycleCounts(),
                    getHasOnboarded(),
                ]);
                setHapticsEnabledState(haptics);
                setCycleCountsState(counts);
                setHasOnboardedState(onboarded);
            } catch (error) {
                console.error('Could not load settings:', error);
            }
        })();
    }, []);

    const completeOnboarding = async () => {
        setHasOnboardedState(true);
        try {
            await setHasOnboarded(true);
        } catch (error) {
            console.error('Could not save onboarding flag:', error);
        }
    };

    const toggleDefaultTechnique = async (techniqueId: string) => {
        const next = defaultTechniqueId === techniqueId ? null : techniqueId;
        try {
            await setDefaultTechniqueId(next);
            setDefaultTechniqueIdState(next);
        } catch (error) {
            console.error('Could not update default technique:', error);
        }
    };

    const changeHapticsEnabled = async (enabled: boolean) => {
        setHapticsEnabledState(enabled);
        try {
            await setHapticsEnabled(enabled);
        } catch (error) {
            console.error('Could not save haptics setting:', error);
        }
    };

    const changeCycleCount = async (techniqueId: string, count: number) => {
        setCycleCountsState((prev) => ({ ...prev, [techniqueId]: count }));
        try {
            await setCycleCount(techniqueId, count);
        } catch (error) {
            console.error('Could not save cycle count:', error);
        }
    };

    const recordSessionComplete = async (summary: {
        techniqueId: string;
        cyclesCompleted: number;
    }) => {
        try {
            await saveSession(summary);
            await refreshStreak();
        } catch (error) {
            console.error('Could not save session, continuing anyway:', error);
        }
    };

    return (
        <AppSettingsContext.Provider
            value={{
                hasOnboarded,
                completeOnboarding,
                streakDays,
                defaultTechniqueId,
                toggleDefaultTechnique,
                hapticsEnabled,
                changeHapticsEnabled,
                cycleCounts,
                changeCycleCount,
                recordSessionComplete,
            }}
        >
            {children}
        </AppSettingsContext.Provider>
    );
}

export function useAppSettings(): AppSettingsContextValue {
    const ctx = useContext(AppSettingsContext);
    if (!ctx) {
        throw new Error('useAppSettings must be used within AppSettingsProvider');
    }
    return ctx;
}
