import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'airloop:sessions';

export interface Session {
    id: string;
    techniqueId: string;
    completedAt: string; // ISO 8601 timestamp
    cyclesCompleted: number;
}

/**
 * Saves a completed session to local storage.
 * Reads existing sessions, appends the new one, writes back.
 */
export async function saveSession(
    session: Omit<Session, 'id' | 'completedAt'>
): Promise<Session> {
    const newSession: Session = {
        ...session,
        id: generateId(),
        completedAt: new Date().toISOString(),
    };

    try {
        const existing = await getSessions();
        const updated = [...existing, newSession];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newSession;
    } catch (error) {
        console.error('[sessionStore] Failed to save session:', error);
        throw error;
    }
}

/**
 * Retrieves all saved sessions, sorted newest first.
 * Returns an empty array if nothing is stored yet or on parse failure.
 */
export async function getSessions(): Promise<Session[]> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw) as Session[];
        return parsed.sort(
            (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
    } catch (error) {
        console.error('[sessionStore] Failed to read sessions:', error);
        return [];
    }
}

/**
 * Optional but recommended: clear all history (useful for a settings screen later).
 */
export async function clearSessions(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('[sessionStore] Failed to clear sessions:', error);
        throw error;
    }
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}