import { isPlayerNameValid } from '@/logic/leaderboard';
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

interface GameOverOptions {
    readonly onPlayAgain: () => void;
    readonly onExitToMenu: () => void;
    readonly onLeaderboard: () => void;
    readonly onSubmit: (name: string) => boolean;
}

export class GameOver extends Dialog {
    private readonly reasonLabel: HTMLElement;
    private readonly scoreLabel: HTMLElement;
    private readonly form: HTMLFormElement;
    private readonly nameInput: HTMLInputElement;
    private readonly message: HTMLElement;
    private readonly replayButton: HTMLButtonElement;
    private wasVisible = false;

    constructor({ onPlayAgain, onExitToMenu, onLeaderboard, onSubmit }: GameOverOptions) {
        super({
            modifier: 'dialog--centered game-over',
            labelledBy: 'game-over-title',
            describedBy: 'game-over-reason',
        });
        this.setLocked(true);

        this.setContent(html`
            <h2 class="dialog__title" id="game-over-title">Game Over</h2>
            <p class="dialog__description" id="game-over-reason"></p>
            <dl class="dialog__summary dialog__summary--featured">
                <div>
                    <dt>Final score</dt>
                    <dd data-stat="score">0</dd>
                </div>
            </dl>
            <form class="dialog__form game-over__form" novalidate hidden>
                <p class="game-over__qualification">A place in the Top 10!</p>
                <label for="player-name">Alchemist name</label>
                <div class="game-over__entry">
                    <input
                        class="dialog__input"
                        id="player-name"
                        name="player-name"
                        autocomplete="nickname"
                        aria-describedby="player-name-hint score-message"
                        required
                    >
                    <p class="dialog__hint" id="player-name-hint">
                        2–15 characters: letters, digits, spaces, _ or -.
                    </p>
                    <button class="dialog__button game-over__submit" type="submit">
                        Save score
                    </button>
                </div>
            </form>
            <p class="dialog__description game-over__message" id="score-message" role="status"></p>
            <div class="game-over__actions">
                <button class="dialog__button" type="button" data-action="replay" autofocus>
                    Play again
                </button>
                <div class="game-over__secondary-actions">
                    <button
                        class="dialog__button dialog__button--secondary"
                        type="button"
                        data-action="leaderboard"
                        aria-haspopup="dialog"
                        aria-controls="leaderboard-dialog"
                    >
                        Leaderboard
                    </button>
                    <button
                        class="dialog__button dialog__button--secondary"
                        type="button"
                        data-action="exit"
                    >
                        Exit to Menu
                    </button>
                </div>
            </div>
        `);

        this.reasonLabel = this.getElement('#game-over-reason');
        this.scoreLabel = this.getElement('[data-stat="score"]');
        this.form = this.getElement('form');
        this.nameInput = this.getElement('input');
        this.message = this.getElement('#score-message');
        this.replayButton = this.getElement('[data-action="replay"]');
        this.form.addEventListener(
            'submit',
            (event) => {
                event.preventDefault();
                if (this.form.hidden) return;
                const name = this.nameInput.value.trim();
                const valid = isPlayerNameValid(name);
                this.nameInput.setAttribute('aria-invalid', String(!valid));
                if (!valid) {
                    this.message.textContent =
                        'Use 2–15 characters: letters, digits, spaces, _ or -.';
                    this.nameInput.focus();
                    return;
                }
                if (onSubmit(name)) {
                    this.setScoreFormVisible(false);
                    this.message.textContent = 'Score saved.';
                    this.replayButton.focus();
                } else {
                    this.message.textContent =
                        'Could not save the result. Storage may be unavailable or the Top 10 has changed. You can retry or play again.';
                }
            },
            { signal: this.eventSignal },
        );
        this.getElement('[data-action="leaderboard"]').addEventListener('click', onLeaderboard, {
            signal: this.eventSignal,
        });
        this.getElement('[data-action="replay"]').addEventListener('click', onPlayAgain, {
            signal: this.eventSignal,
        });
        this.getElement('[data-action="exit"]').addEventListener('click', onExitToMenu, {
            signal: this.eventSignal,
        });
    }

    private setScoreFormVisible(isVisible: boolean): void {
        this.form.hidden = !isVisible;
        this.replayButton.classList.toggle('dialog__button--secondary', isVisible);
    }

    public render({ isVisible, score, reason }: GameOverView, canSubmit: boolean): void {
        if (isVisible && !this.wasVisible) {
            this.form.reset();
            this.setScoreFormVisible(canSubmit);
            this.message.textContent = '';
            this.nameInput.removeAttribute('aria-invalid');
        }
        this.wasVisible = isVisible;
        this.reasonLabel.textContent = reason ? REASONS[reason] : '';
        this.scoreLabel.textContent = String(score);

        if (isVisible) {
            const wasOpen = this.element.open;
            this.open();
            if (!wasOpen && !this.form.hidden) this.nameInput.focus();
        } else this.close();
    }
}
