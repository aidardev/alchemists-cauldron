import type { GameOverReason } from '@/types/game';
import type { GameOverView } from '@/types/view';
import { Dialog } from '@/ui/dialog/dialog';
import { html } from '@/utils/html';
import './game-over.scss';

const REASONS: Readonly<Record<GameOverReason, string>> = {
    'time-up': 'Time is up',
    'no-lives': 'No lives left',
    'out-of-ingredients': 'Out of ingredients',
};

export class GameOver extends Dialog {
    private readonly reasonLabel: HTMLElement;
    private readonly scoreLabel: HTMLElement;

    constructor(onPlayAgain: () => void) {
        super({
            modifier: 'game-over',
            labelledBy: 'game-over-title',
            describedBy: 'game-over-reason',
        });
        this.setLocked(true);

        this.setContent(html`
            <span class="game-over__symbol" aria-hidden="true">✧</span>
            <h2 class="dialog__title" id="game-over-title">Game Over</h2>
            <p class="dialog__description" id="game-over-reason"></p>
            <dl class="game-over__result">
                <dt>Final score</dt>
                <dd class="game-over__score">0</dd>
            </dl>
            <div class="dialog__actions">
                <button class="dialog__button" type="button" autofocus>Play again</button>
            </div>
        `);

        this.reasonLabel = this.getElement('#game-over-reason');
        this.scoreLabel = this.getElement('.game-over__score');
        this.getElement('.dialog__button').addEventListener('click', onPlayAgain, {
            signal: this.eventSignal,
        });
    }

    public render({ isVisible, score, reason }: GameOverView): void {
        this.reasonLabel.textContent = reason ? REASONS[reason] : '';
        this.scoreLabel.textContent = String(score);

        if (isVisible) this.open();
        else this.close();
    }
}
