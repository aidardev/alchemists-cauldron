import { selectGameOver } from '@/logic/select-game-over';
import type { GameStore } from '@/state/game-store';
import { LeaderboardStore } from '@/state/leaderboard-store';
import { ClearLeaderboardDialog } from '@/ui/clear-leaderboard-dialog/clear-leaderboard-dialog';
import { GameOver } from '@/ui/game-over/game-over';
import { Leaderboard } from '@/ui/leaderboard/leaderboard';

export class GameResultsController {
    private readonly results: LeaderboardStore;
    private readonly leaderboard: Leaderboard;
    private readonly confirmation: ClearLeaderboardDialog;
    private readonly gameOver: GameOver;
    private readonly unsubscribe: () => void;

    constructor(store: GameStore) {
        this.results = new LeaderboardStore(store);
        this.confirmation = new ClearLeaderboardDialog(() => {
            const cleared = this.results.clear();
            this.leaderboard.render(
                this.results.getEntries(),
                cleared ? 'Leaderboard cleared.' : 'Could not clear results. Please try again.',
            );
        });
        this.leaderboard = new Leaderboard({ onClear: () => this.confirmation.open() });
        this.gameOver = new GameOver({
            onPlayAgain: () => store.startGame(),
            onLeaderboard: () => this.openLeaderboard(),
            onSubmit: (name) => this.results.submit(name),
        });

        const render = (): void => {
            this.gameOver.render(selectGameOver(store.getState()), this.results.canSubmit());
        };
        this.unsubscribe = store.subscribe(render);
        render();
    }

    public get elements(): readonly HTMLDialogElement[] {
        return [this.gameOver.element, this.leaderboard.element, this.confirmation.element];
    }

    public openLeaderboard(): void {
        this.leaderboard.render(this.results.getEntries());
        this.leaderboard.open();
    }

    public destroy(): void {
        this.unsubscribe();
        this.results.destroy();
        this.confirmation.destroy();
        this.leaderboard.destroy();
        this.gameOver.destroy();
    }
}
