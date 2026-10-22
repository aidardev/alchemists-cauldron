import type { GameStore } from './game-store';

export class GameVisibility {
    private readonly abortController = new AbortController();
    private readonly store: GameStore;
    private readonly page: Document;

    private handleVisibilityChange = (): void => {
        if (this.page.hidden) this.store.pause();
    };

    constructor(store: GameStore, page: Document = document) {
        this.store = store;
        this.page = page;
        this.page.addEventListener('visibilitychange', this.handleVisibilityChange, {
            signal: this.abortController.signal,
        });
        this.handleVisibilityChange();
    }

    public destroy(): void {
        this.abortController.abort();
    }
}
