import type { GameState } from '@/types/game';
import type { GameStore } from './game-store';

export class GameTimer {
    private intervalId: ReturnType<typeof setInterval> | undefined;
    private readonly unsubscribe: () => void;

    constructor(store: GameStore) {
        const sync = (state: GameState): void => {
            if (state.status === 'playing') {
                this.intervalId ??= setInterval(() => store.tick(), 250);
            } else {
                this.stop();
            }
        };

        this.unsubscribe = store.subscribe(sync);
        sync(store.getState());
    }

    private stop(): void {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    public destroy(): void {
        this.unsubscribe();
        this.stop();
    }
}
