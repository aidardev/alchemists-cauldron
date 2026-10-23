import { BaseComponent } from '@/core/base-component';
import type { ActionBarView } from '@/types/view';
import { html } from '@/utils/html';
import './action-bar.scss';

interface ActionBarOptions {
    readonly onStart: () => void;
    readonly onBrew: () => void;
    readonly onPause: () => void;
}

export class ActionBar extends BaseComponent<'div'> {
    private readonly startButton: HTMLButtonElement;
    private readonly brewButton: HTMLButtonElement;
    private readonly pauseButton: HTMLButtonElement;

    constructor({ onStart, onBrew, onPause }: ActionBarOptions) {
        super('div', 'action-bar');

        this.setHtml(html`
            <button type="button" class="action-bar__button" data-action="start">Start game</button>
            <button type="button" class="action-bar__button" data-action="brew" disabled>
                Brew
            </button>
            <button
                type="button"
                class="action-bar__button action-bar__button--secondary"
                data-action="pause"
                aria-haspopup="dialog"
                aria-controls="pause-dialog"
                hidden
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8 5v14M16 5v14"></path>
                </svg>
                Pause
            </button>
        `);

        this.startButton = this.getElement('[data-action="start"]');
        this.brewButton = this.getElement('[data-action="brew"]');
        this.pauseButton = this.getElement('[data-action="pause"]');

        this.startButton.addEventListener('click', onStart, { signal: this.eventSignal });
        this.brewButton.addEventListener('click', onBrew, { signal: this.eventSignal });
        this.pauseButton.addEventListener('click', onPause, { signal: this.eventSignal });
    }

    public render({ showStart, isRestart, canBrew, canPause }: ActionBarView): void {
        this.startButton.hidden = !showStart;
        this.startButton.textContent = isRestart ? 'Play again' : 'Start game';
        this.brewButton.hidden = showStart;
        this.brewButton.disabled = !canBrew;
        this.pauseButton.hidden = !canPause;
    }
}
