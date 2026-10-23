import { canEnterLeaderboard, isLeaderboardEntry, sortLeaderboard } from '@/logic/leaderboard';
import type { Difficulty } from '@/types/difficulty';
import type { LeaderboardEntry } from '@/types/leaderboard';

export function getLeaderboardKey(difficulty: Difficulty): string {
    return `alchemists-cauldron:leaderboard:${difficulty}`;
}

export class LeaderboardStorage {
    private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

    constructor(getStorage: LeaderboardStorage['getStorage'] = () => localStorage) {
        this.getStorage = getStorage;
    }

    private load(difficulty: Difficulty): LeaderboardEntry[] {
        const stored = this.getStorage().getItem(getLeaderboardKey(difficulty));
        let value: unknown;
        try {
            value = JSON.parse(stored ?? '[]');
        } catch {
            return [];
        }
        return Array.isArray(value)
            ? sortLeaderboard(
                  value
                      .filter(isLeaderboardEntry)
                      .filter((entry) => entry.difficulty === difficulty),
              )
            : [];
    }

    public read(difficulty: Difficulty): LeaderboardEntry[] {
        try {
            return this.load(difficulty);
        } catch {
            return [];
        }
    }

    public add(entry: LeaderboardEntry): boolean {
        if (!isLeaderboardEntry(entry)) return false;
        try {
            const entries = this.load(entry.difficulty);
            if (!canEnterLeaderboard(entries, entry.score)) return false;
            this.getStorage().setItem(
                getLeaderboardKey(entry.difficulty),
                JSON.stringify(sortLeaderboard([...entries, entry])),
            );
            return true;
        } catch {
            return false;
        }
    }

    public clear(difficulty: Difficulty): boolean {
        try {
            this.getStorage().removeItem(getLeaderboardKey(difficulty));
            return true;
        } catch {
            return false;
        }
    }
}
