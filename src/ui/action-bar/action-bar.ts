import { BaseComponent } from '@/core/base-component';
import type { ActionBarView } from '@/types/view';
import { html } from '@/utils/html';
import './action-bar.scss';

interface ActionBarOptions {
    readonly onStart: () => void;
    readonly onBrew: () => void;
}

export class ActionBar extends BaseComponent<'div'> {
    private readonly startButton: HTMLButtonElement;
    private readonly brewButton: HTMLButtonElement;

    constructor({ onStart, onBrew }: ActionBarOptions) {
        super('div', 'action-bar');

        this.setHtml(html`
            <button type="button" class="action-bar__button" data-action="start">Start game</button>
            <button type="button" class="action-bar__button" data-action="brew" disabled>
                Brew
            </button>
        `);

        this.startButton = this.getElement('[data-action="start"]');
        this.brewButton = this.getElement('[data-action="brew"]');

        this.startButton.addEventListener('click', onStart, { signal: this.eventSignal });
        this.brewButton.addEventListener('click', onBrew, { signal: this.eventSignal });
    }

    public render({ showStart, isRestart, canBrew }: ActionBarView): void {
        this.startButton.hidden = !showStart;
        this.startButton.textContent = isRestart ? 'Play again' : 'Start game';
        this.brewButton.hidden = showStart;
        this.brewButton.disabled = !canBrew;
    }
}
