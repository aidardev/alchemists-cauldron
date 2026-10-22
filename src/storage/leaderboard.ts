import { canEnterLeaderboard, isLeaderboardEntry, sortLeaderboard } from '@/logic/leaderboard';
import type { LeaderboardEntry } from '@/types/leaderboard';

export const LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';

export class LeaderboardStorage {
    private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

    constructor(getStorage: LeaderboardStorage['getStorage'] = () => localStorage) {
        this.getStorage = getStorage;
    }

    private load(): LeaderboardEntry[] {
        const stored = this.getStorage().getItem(LEADERBOARD_KEY);
        let value: unknown;
        try {
            value = JSON.parse(stored ?? '[]');
        } catch {
            return [];
        }
        return Array.isArray(value) ? sortLeaderboard(value.filter(isLeaderboardEntry)) : [];
    }

    public read(): LeaderboardEntry[] {
        try {
            return this.load();
        } catch {
            return [];
        }
    }

    public add(entry: LeaderboardEntry): boolean {
        if (!isLeaderboardEntry(entry)) return false;
        try {
            const entries = this.load();
            if (!canEnterLeaderboard(entries, entry.score)) return false;
            this.getStorage().setItem(
                LEADERBOARD_KEY,
                JSON.stringify(sortLeaderboard([...entries, entry])),
            );
            return true;
        } catch {
            return false;
        }
    }

    public clear(): boolean {
        try {
            this.getStorage().removeItem(LEADERBOARD_KEY);
            return true;
        } catch {
            return false;
        }
    }
}
