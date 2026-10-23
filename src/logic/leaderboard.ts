import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { LeaderboardEntry } from '@/types/leaderboard';

export const LEADERBOARD_LIMIT = 10;

export function isPlayerNameValid(name: string): boolean {
    const length = [...name].length;
    return length >= 2 && length <= 15 && /^[\p{L}\p{Nd} _-]+$/u.test(name);
}

export function sortLeaderboard(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
    return entries
        .toSorted((a, b) => b.score - a.score || a.timestamp - b.timestamp)
        .slice(0, LEADERBOARD_LIMIT);
}

export function canEnterLeaderboard(entries: readonly LeaderboardEntry[], score: number): boolean {
    return (
        Number.isSafeInteger(score) &&
        score >= 0 &&
        (entries.length < LEADERBOARD_LIMIT || score > (entries.at(-1)?.score ?? 0))
    );
}

export function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
    return (
        typeof value === 'object' &&
        value !== null &&
        'difficulty' in value &&
        typeof value.difficulty === 'string' &&
        Object.hasOwn(DIFFICULTY_RULES, value.difficulty) &&
        'name' in value &&
        typeof value.name === 'string' &&
        isPlayerNameValid(value.name) &&
        'score' in value &&
        typeof value.score === 'number' &&
        Number.isSafeInteger(value.score) &&
        value.score >= 0 &&
        'timestamp' in value &&
        typeof value.timestamp === 'number' &&
        Number.isSafeInteger(value.timestamp) &&
        value.timestamp >= 0 &&
        !Number.isNaN(new Date(value.timestamp).getTime())
    );
}
