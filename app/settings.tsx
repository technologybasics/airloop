import React from 'react';
import { useRouter } from 'expo-router';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { useAppSettings } from '../src/context/AppSettingsContext';

export default function Settings() {
    const router = useRouter();
    const { cycleCounts, changeCycleCount, hapticsEnabled, changeHapticsEnabled } = useAppSettings();

    return (
        <SettingsScreen
            onClose={() => router.back()}
            cycleCounts={cycleCounts}
            onChangeCycleCount={changeCycleCount}
            hapticsEnabled={hapticsEnabled}
            onChangeHapticsEnabled={changeHapticsEnabled}
        />
    );
}
