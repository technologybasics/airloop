import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'airloop:settings';

interface Settings {
    defaultTechniqueId: string | null;
}

async function readSettings(): Promise<Settings> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return { defaultTechniqueId: null };
        return JSON.parse(raw) as Settings;
    } catch (error) {
        console.error('[settingsStore] Failed to read settings:', error);
        return { defaultTechniqueId: null };
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
