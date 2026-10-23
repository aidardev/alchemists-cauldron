import type { Difficulty } from './difficulty';

export interface LeaderboardEntry {
    readonly difficulty: Difficulty;
    readonly name: string;
    readonly score: number;
    readonly timestamp: number;
}
