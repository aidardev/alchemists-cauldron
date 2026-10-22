import { canEnterLeaderboard } from '@/logic/leaderboard';
import { LeaderboardStorage } from '@/storage/leaderboard';
import type { GameState } from '@/types/game';
import type { LeaderboardEntry } from '@/types/leaderboard';
import type { GameStore } from './game-store';

export class LeaderboardStore {
    private readonly storage: LeaderboardStorage;
    private readonly unsubscribe: () => void;
    private result: Pick<LeaderboardEntry, 'score' | 'timestamp'> | undefined;
    private wasGameOver = false;
    private hasSubmitted = false;

    constructor(
        store: GameStore,
        storage: LeaderboardStorage = new LeaderboardStorage(),
        now: () => number = Date.now,
    ) {
        this.storage = storage;
        const update = (state: GameState): void => {
            const isGameOver = state.status === 'game-over';
            if (isGameOver && !this.wasGameOver) {
                this.result = { score: state.score, timestamp: now() };
                this.hasSubmitted = false;
            } else if (!isGameOver) {
                this.result = undefined;
            }
            this.wasGameOver = isGameOver;
        };
        this.unsubscribe = store.subscribe(update);
        update(store.getState());
    }

    public getEntries(): readonly LeaderboardEntry[] {
        return this.storage.read();
    }

    public canSubmit(): boolean {
        return (
            !this.hasSubmitted &&
            this.result !== undefined &&
            canEnterLeaderboard(this.getEntries(), this.result.score)
        );
    }

    public submit(name: string): boolean {
        if (this.hasSubmitted || !this.result) return false;
        this.hasSubmitted = this.storage.add({ ...this.result, name });
        return this.hasSubmitted;
    }

    public clear(): boolean {
        return this.storage.clear();
    }

    public destroy(): void {
        this.unsubscribe();
    }
}
