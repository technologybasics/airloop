import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppSettingsProvider, useAppSettings } from '../src/context/AppSettingsContext';
import { colors } from '../src/constants/theme';

SplashScreen.preventAutoHideAsync();

function RootStack() {
    const { hasOnboarded } = useAppSettings();

    useEffect(() => {
        if (hasOnboarded !== null) {
            SplashScreen.hideAsync();
        }
    }, [hasOnboarded]);

    if (hasOnboarded === null) {
        // Still loading the onboarding flag — render nothing rather than
        // flashing Home (if not onboarded) or Onboarding (if returning).
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="progress" />
            <Stack.Screen name="session/[techniqueId]" />
            <Stack.Screen name="session-complete" options={{ gestureEnabled: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
                <StatusBar style="light" />
                <AppSettingsProvider>
                    <RootStack />
                </AppSettingsProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
