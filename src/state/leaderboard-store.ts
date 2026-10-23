import { canEnterLeaderboard } from '@/logic/leaderboard';
import { LeaderboardStorage } from '@/storage/leaderboard';
import type { Difficulty } from '@/types/difficulty';
import type { GameState } from '@/types/game';
import type { LeaderboardEntry } from '@/types/leaderboard';

export class LeaderboardStore {
    private readonly storage: LeaderboardStorage;
    private readonly now: () => number;
    private result: Omit<LeaderboardEntry, 'name'> | undefined;
    private wasGameOver = false;
    private hasSubmitted = false;

    constructor(
        storage: LeaderboardStorage = new LeaderboardStorage(),
        now: () => number = Date.now,
    ) {
        this.storage = storage;
        this.now = now;
    }

    public update(state: GameState): void {
        const isGameOver = state.status === 'game-over';
        if (isGameOver && !this.wasGameOver) {
            this.result = {
                difficulty: state.difficulty,
                score: state.score,
                timestamp: this.now(),
            };
            this.hasSubmitted = false;
        } else if (!isGameOver) {
            this.result = undefined;
        }
        this.wasGameOver = isGameOver;
    }

    public getEntries(difficulty: Difficulty): readonly LeaderboardEntry[] {
        return this.storage.read(difficulty);
    }

    public canSubmit(): boolean {
        return (
            !this.hasSubmitted &&
            this.result !== undefined &&
            canEnterLeaderboard(this.getEntries(this.result.difficulty), this.result.score)
        );
    }

    public submit(name: string): boolean {
        if (this.hasSubmitted || !this.result) return false;
        this.hasSubmitted = this.storage.add({ ...this.result, name });
        return this.hasSubmitted;
    }

    public clear(difficulty: Difficulty): boolean {
        return this.storage.clear(difficulty);
    }
}
