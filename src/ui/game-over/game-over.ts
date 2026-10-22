import type { GameOverReason } from '@/types/game';
import type { GameOverView } from '@/types/view';
import { Dialog } from '@/ui/dialog/dialog';
import { html } from '@/utils/html';

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
            modifier: 'dialog--centered',
            labelledBy: 'game-over-title',
            describedBy: 'game-over-reason',
        });
        this.setLocked(true);

        this.setContent(html`
            <div class="dialog__emblem" aria-hidden="true">
                <svg viewBox="0 0 32 32" focusable="false">
                    <path d="M16 5 28 26H4Z"></path>
                    <circle cx="16" cy="19" r="4"></circle>
                </svg>
            </div>
            <h2 class="dialog__title" id="game-over-title">Game Over</h2>
            <p class="dialog__description" id="game-over-reason"></p>
            <dl class="dialog__summary dialog__summary--featured">
                <div>
                    <dt>Final score</dt>
                    <dd data-stat="score">0</dd>
                </div>
            </dl>
            <div class="dialog__actions">
                <button class="dialog__button" type="button" autofocus>Play again</button>
            </div>
        `);

        this.reasonLabel = this.getElement('#game-over-reason');
        this.scoreLabel = this.getElement('[data-stat="score"]');
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
