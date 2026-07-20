import React from 'react';
import { useRouter } from 'expo-router';
import { ProgressScreen } from '../src/screens/ProgressScreen';

export default function Progress() {
    const router = useRouter();
    return <ProgressScreen onClose={() => router.back()} />;
}
