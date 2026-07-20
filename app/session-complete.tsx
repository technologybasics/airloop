import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SessionCompleteScreen } from '../src/screens/SessionCompleteScreen';
import { useAppSettings } from '../src/context/AppSettingsContext';

export default function SessionComplete() {
    const router = useRouter();
    const { streakDays } = useAppSettings();
    const { techniqueLabel, cyclesCompleted, durationSec } = useLocalSearchParams<{
        techniqueLabel: string;
        cyclesCompleted: string;
        durationSec: string;
    }>();

    return (
        <SessionCompleteScreen
            techniqueLabel={techniqueLabel}
            cyclesCompleted={Number(cyclesCompleted)}
            durationSec={Number(durationSec)}
            streakDays={streakDays}
            onDone={() => router.replace('/')}
        />
    );
}
