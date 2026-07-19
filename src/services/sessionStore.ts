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

/**
 * Calculates the current consecutive-day streak from a list of sessions.
 * A day counts if it has at least one completed session. The streak counts
 * backward from today; if today has no session yet, it counts backward from
 * yesterday instead so an unbroken streak isn't zeroed out before the day ends.
 * Breaks (stops counting) at the first missed day.
 */
export function getCurrentStreak(sessions: Session[]): number {
    const activeDays = new Set(
        sessions.map((session) => toCalendarDay(new Date(session.completedAt)))
    );

    const cursor = new Date();
    if (!activeDays.has(toCalendarDay(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (activeDays.has(toCalendarDay(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toCalendarDay(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}