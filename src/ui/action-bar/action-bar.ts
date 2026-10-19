import { BaseComponent } from '@/core/base-component';
import type { GameStatus } from '@/types/game';
import { html } from '@/utils/html';
import './action-bar.scss';

interface ActionBarOptions {
    readonly onStart: () => void;
}

export class ActionBar extends BaseComponent<'div'> {
    private readonly startButton: HTMLButtonElement;
    private readonly brewButton: HTMLButtonElement;

    constructor({ onStart }: ActionBarOptions) {
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
    }

    public render(status: GameStatus): void {
        const isMenu = status === 'menu';

        this.startButton.hidden = !isMenu;
        this.brewButton.hidden = isMenu;
    }
}
