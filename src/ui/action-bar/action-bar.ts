import { BaseComponent } from '@/core/base-component';
import { DIFFICULTY_LABELS } from '@/data/difficulty';
import type { GameSaveError } from '@/types/game-save';
import type { ActionBarView } from '@/types/view';
import { formatTime } from '@/utils/format-time';
import { html } from '@/utils/html';
import './action-bar.scss';

const SAVE_ERRORS: Readonly<Record<GameSaveError, string>> = {
    save: 'Progress could not be saved. It may be lost when you leave this page.',
    clear: 'Saved progress could not be cleared. It may reappear after a reload.',
};

interface ActionBarOptions {
    readonly onStart: () => void;
    readonly onBrew: () => void;
    readonly onPourOut: () => void;
    readonly onPause: () => void;
    readonly onContinue: () => void;
}

export class ActionBar extends BaseComponent<'div'> {
    private readonly startButton: HTMLButtonElement;
    private readonly brewButton: HTMLButtonElement;
    private readonly pourOutButton: HTMLButtonElement;
    private readonly pourOutCostLabel: HTMLElement;
    private readonly pauseButton: HTMLButtonElement;
    private readonly continueButton: HTMLButtonElement;
    private readonly saveSummary: HTMLElement;
    private readonly saveErrorLabel: HTMLElement;

    constructor({ onStart, onBrew, onPourOut, onPause, onContinue }: ActionBarOptions) {
        super('div', 'action-bar');

        this.setHtml(html`
            <button
                type="button"
                class="action-bar__button"
                data-action="continue"
                aria-describedby="saved-game-summary"
                hidden
            >
                Continue Game
            </button>
            <button type="button" class="action-bar__button" data-action="start">Start game</button>
            <button
                type="button"
                class="action-bar__button action-bar__button--secondary"
                data-action="pour-out"
                aria-keyshortcuts="X"
                hidden
                disabled
            >
                Pour Out
                <span class="action-bar__cost" aria-hidden="true"></span>
            </button>
            <button
                type="button"
                class="action-bar__button"
                data-action="brew"
                aria-keyshortcuts="B"
                disabled
            >
                Brew
            </button>
            <button
                type="button"
                class="action-bar__button action-bar__button--secondary"
                data-action="pause"
                aria-keyshortcuts="P Escape"
                aria-haspopup="dialog"
                aria-controls="pause-dialog"
                hidden
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8 5v14M16 5v14"></path>
                </svg>
                Pause
            </button>
            <p class="action-bar__save-summary" id="saved-game-summary" hidden></p>
            <p class="action-bar__save-error" role="status"></p>
        `);

        this.startButton = this.getElement('[data-action="start"]');
        this.brewButton = this.getElement('[data-action="brew"]');
        this.pourOutButton = this.getElement('[data-action="pour-out"]');
        this.pourOutCostLabel = this.getElement('.action-bar__cost');
        this.pauseButton = this.getElement('[data-action="pause"]');
        this.continueButton = this.getElement('[data-action="continue"]');
        this.saveSummary = this.getElement('#saved-game-summary');
        this.saveErrorLabel = this.getElement('.action-bar__save-error');

        this.startButton.addEventListener('click', onStart, { signal: this.eventSignal });
        this.brewButton.addEventListener('click', onBrew, { signal: this.eventSignal });
        this.pourOutButton.addEventListener('click', onPourOut, { signal: this.eventSignal });
        this.pauseButton.addEventListener('click', onPause, { signal: this.eventSignal });
        this.continueButton.addEventListener('click', onContinue, { signal: this.eventSignal });
    }

    public render({
        showStart,
        isRestart,
        isPaused,
        canBrew,
        showPourOut,
        canPourOut,
        pourOutCost,
        canPause,
        continueGame,
        saveError,
    }: ActionBarView): void {
        this.element.inert = isPaused;
        this.element.classList.toggle('action-bar--paused', isPaused);
        this.element.setAttribute('aria-hidden', String(isPaused));
        this.saveErrorLabel.textContent = saveError ? SAVE_ERRORS[saveError] : '';
        this.startButton.hidden = !showStart;
        this.startButton.textContent = continueGame
            ? 'New game'
            : isRestart
              ? 'Play again'
              : 'Start game';
        this.startButton.classList.toggle(
            'action-bar__button--secondary',
            continueGame !== undefined,
        );
        this.continueButton.hidden = !continueGame;
        this.saveSummary.hidden = !continueGame;
        this.saveSummary.textContent = continueGame
            ? `${DIFFICULTY_LABELS[continueGame.difficulty]} · Score ${continueGame.score} · ${formatTime(continueGame.timeLeft)} remaining. Continue opens the game paused.`
            : '';
        this.brewButton.hidden = showStart;
        this.brewButton.disabled = !canBrew;
        this.pourOutButton.hidden = !showPourOut;
        this.pourOutButton.disabled = !canPourOut;
        this.pourOutButton.setAttribute(
            'aria-label',
            `Pour out mixture (costs ${pourOutCost} seconds)`,
        );
        this.pourOutCostLabel.textContent = `−${pourOutCost} s`;
        this.pauseButton.hidden = !canPause;
    }
}
