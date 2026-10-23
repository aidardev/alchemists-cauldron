import { selectGameOver } from '@/logic/select-game-over';
import type { GameStore } from '@/state/game-store';
import { LeaderboardStore } from '@/state/leaderboard-store';
import type { Difficulty } from '@/types/difficulty';
import type { GameState } from '@/types/game';
import { ClearLeaderboardDialog } from '@/ui/clear-leaderboard-dialog/clear-leaderboard-dialog';
import { GameOver } from '@/ui/game-over/game-over';
import { Leaderboard } from '@/ui/leaderboard/leaderboard';

export class GameResultsController {
    private readonly results: LeaderboardStore;
    private readonly leaderboard: Leaderboard;
    private readonly confirmation: ClearLeaderboardDialog;
    private readonly gameOver: GameOver;
    private readonly unsubscribe: () => void;
    private readonly store: GameStore;
    private viewedDifficulty: Difficulty;

    constructor(store: GameStore) {
        this.store = store;
        this.viewedDifficulty = store.getState().difficulty;
        this.results = new LeaderboardStore();
        this.confirmation = new ClearLeaderboardDialog((difficulty) => {
            const cleared = this.results.clear(difficulty);
            this.renderLeaderboard(
                cleared ? 'Leaderboard cleared.' : 'Could not clear results. Please try again.',
            );
        });
        this.leaderboard = new Leaderboard({
            onClear: () => {
                this.confirmation.render(this.viewedDifficulty);
                this.confirmation.open();
            },
            onSelectDifficulty: (difficulty) => {
                this.viewedDifficulty = difficulty;
                this.renderLeaderboard();
            },
        });
        this.gameOver = new GameOver({
            onPlayAgain: () => store.startGame(),
            onExitToMenu: () => store.exitToMenu(),
            onLeaderboard: () => this.openLeaderboard(),
            onSubmit: (name) => this.results.submit(name),
        });

        const render = (state: GameState): void => {
            this.results.update(state);
            this.gameOver.render(selectGameOver(state), this.results.canSubmit());
        };
        this.unsubscribe = store.subscribe(render);
        render(store.getState());
    }

    private renderLeaderboard(message = ''): void {
        this.leaderboard.render({
            difficulty: this.viewedDifficulty,
            entries: this.results.getEntries(this.viewedDifficulty),
            message,
        });
    }

    public get elements(): readonly HTMLDialogElement[] {
        return [this.gameOver.element, this.leaderboard.element, this.confirmation.element];
    }

    public openLeaderboard(): HTMLDialogElement {
        this.viewedDifficulty = this.store.getState().difficulty;
        this.renderLeaderboard();
        this.leaderboard.open();
        return this.leaderboard.element;
    }

    public destroy(): void {
        this.unsubscribe();
        this.confirmation.destroy();
        this.leaderboard.destroy();
        this.gameOver.destroy();
    }
}
