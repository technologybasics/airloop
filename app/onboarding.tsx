import React from 'react';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import { useAppSettings } from '../src/context/AppSettingsContext';

export default function Onboarding() {
    const router = useRouter();
    const { completeOnboarding } = useAppSettings();

    return (
        <OnboardingScreen
            onDone={async () => {
                await completeOnboarding();
                router.replace('/');
            }}
        />
    );
}
