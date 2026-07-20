import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SessionScreen } from '../../src/screens/SessionScreen';
import { TECHNIQUES } from '../../src/constants/phases';
import { useAppSettings } from '../../src/context/AppSettingsContext';

export default function Session() {
    const router = useRouter();
    const { techniqueId } = useLocalSearchParams<{ techniqueId: string }>();
    const {
        defaultTechniqueId,
        toggleDefaultTechnique,
        cycleCounts,
        hapticsEnabled,
        recordSessionComplete,
    } = useAppSettings();

    const technique = TECHNIQUES.find((t) => t.id === techniqueId);

    if (!technique) {
        // Shouldn't happen from normal in-app navigation; bail to Home defensively.
        router.replace('/');
        return null;
    }

    return (
        <SessionScreen
            technique={technique}
            onClose={() => router.back()}
            isDefault={defaultTechniqueId === technique.id}
            onToggleDefault={() => toggleDefaultTechnique(technique.id)}
            cycleCount={cycleCounts[technique.id] ?? technique.defaultCycles}
            hapticsEnabled={hapticsEnabled}
            onComplete={async (summary) => {
                await recordSessionComplete(summary);
                router.replace({
                    pathname: '/session-complete',
                    params: {
                        techniqueLabel: technique.label,
                        cyclesCompleted: String(summary.cyclesCompleted),
                        durationSec: String(summary.durationSec),
                    },
                });
            }}
        />
    );
}
