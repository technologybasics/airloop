import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'airloop:settings';

interface Settings {
    defaultTechniqueId: string | null;
    hapticsEnabled: boolean;
    cycleCounts: Record<string, number>;
    hasOnboarded: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    defaultTechniqueId: null,
    hapticsEnabled: true,
    cycleCounts: {},
    hasOnboarded: false,
};

async function readSettings(): Promise<Settings> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as Settings;
    } catch (error) {
        console.error('[settingsStore] Failed to read settings:', error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Returns the id of the technique marked as default, or null if none is set.
 */
export async function getDefaultTechniqueId(): Promise<string | null> {
    const settings = await readSettings();
    return settings.defaultTechniqueId;
}

/**
 * Sets (or clears, with null) the default technique id.
 */
export async function setDefaultTechniqueId(id: string | null): Promise<void> {
    try {
        const settings = await readSettings();
        const updated: Settings = { ...settings, defaultTechniqueId: id };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('[settingsStore] Failed to save settings:', error);
        throw error;
    }
}

/**
 * Whether phase-transition haptics are enabled. Defaults to true.
 */
export async function getHapticsEnabled(): Promise<boolean> {
    const settings = await readSettings();
    return settings.hapticsEnabled;
}

export async function setHapticsEnabled(enabled: boolean): Promise<void> {
    try {
        const settings = await readSettings();
        const updated: Settings = { ...settings, hapticsEnabled: enabled };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('[settingsStore] Failed to save settings:', error);
        throw error;
    }
}

/**
 * The full technique id -> cycle count override map.
 */
export async function getCycleCounts(): Promise<Record<string, number>> {
    const settings = await readSettings();
    return settings.cycleCounts;
}

export async function setCycleCount(techniqueId: string, count: number): Promise<void> {
    try {
        const settings = await readSettings();
        const updated: Settings = {
            ...settings,
            cycleCounts: { ...settings.cycleCounts, [techniqueId]: count },
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('[settingsStore] Failed to save settings:', error);
        throw error;
    }
}

/**
 * Whether the user has completed the first-run onboarding intro.
 */
export async function getHasOnboarded(): Promise<boolean> {
    const settings = await readSettings();
    return settings.hasOnboarded;
}

export async function setHasOnboarded(value: boolean): Promise<void> {
    try {
        const settings = await readSettings();
        const updated: Settings = { ...settings, hasOnboarded: value };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('[settingsStore] Failed to save settings:', error);
        throw error;
    }
}
