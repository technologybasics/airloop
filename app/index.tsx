import React, { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { HomeScreen } from '../src/screens/HomeScreen';
import { useAppSettings } from '../src/context/AppSettingsContext';

// Module-level, not component state: must persist for the whole JS lifetime
// so the default technique only ever auto-launches once per cold start,
// even if this screen unmounts/remounts via back-navigation.
let hasAutoLaunchedDefault = false;

export default function Index() {
    const router = useRouter();
    const { streakDays, defaultTechniqueId, hasOnboarded } = useAppSettings();

    useEffect(() => {
        if (!hasOnboarded) return;
        if (!hasAutoLaunchedDefault && defaultTechniqueId) {
            hasAutoLaunchedDefault = true;
            router.push({
                pathname: '/session/[techniqueId]',
                params: { techniqueId: defaultTechniqueId },
            });
        }
    }, [hasOnboarded, defaultTechniqueId]);

    if (!hasOnboarded) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <HomeScreen
            streakDays={streakDays}
            defaultTechniqueId={defaultTechniqueId}
            onSelectTechnique={(technique) =>
                router.push({
                    pathname: '/session/[techniqueId]',
                    params: { techniqueId: technique.id },
                })
            }
            onOpenSettings={() => router.push('/settings')}
            onOpenProgress={() => router.push('/progress')}
        />
    );
}
