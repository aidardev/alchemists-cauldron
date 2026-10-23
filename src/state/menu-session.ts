import type { GameState } from '@/types/game';
import type { GameStore } from './game-store';

export class MenuSession {
    private readonly store: GameStore;
    private readonly page: Document;
    private readonly abortController = new AbortController();
    private pausedState: GameState | undefined;
    private active = false;

    constructor(store: GameStore, page: Document = document) {
        this.store = store;
        this.page = page;
        this.page.addEventListener(
            'visibilitychange',
            () => {
                if (this.page.hidden) this.pausedState = undefined;
            },
            { signal: this.abortController.signal },
        );
    }

    public get isActive(): boolean {
        return this.active;
    }

    public begin(): boolean {
        if (this.active) return false;
        this.active = true;
        const wasPlaying = this.store.getState().status === 'playing';
        if (wasPlaying) this.store.pause();
        const state = this.store.getState();

        // A click at the deadline must show Game Over, rather than covering it with a menu.
        if (wasPlaying && state.status !== 'paused') {
            this.active = false;
            return false;
        }

        this.pausedState = wasPlaying && !this.page.hidden ? state : undefined;
        return true;
    }

    public end(): void {
        if (!this.active) return;
        this.active = false;
        // Only resume the exact pause created by this session.
        const shouldResume = !this.page.hidden && this.pausedState === this.store.getState();
        this.pausedState = undefined;
        if (shouldResume) this.store.resume();
    }

    public destroy(): void {
        this.abortController.abort();
        this.active = false;
        this.pausedState = undefined;
    }
}
