import { BaseComponent } from '@/core/base-component';
import type { HeaderView } from '@/types/view';
import { html } from '@/utils/html';
import './header.scss';

export class Header extends BaseComponent<'header'> {
    private readonly scoreLabel: HTMLElement;
    private readonly timeLabel: HTMLElement;
    private readonly livesLabel: HTMLElement;

    constructor() {
        super('header', 'header');

        this.setHtml(html`
            <h1 class="header__title">Alchemist's Cauldron</h1>
            <span class="header__divider" aria-hidden="true"></span>
            <dl class="header__stats" aria-label="Game stats">
                <div>
                    <dt>Score</dt>
                    <dd data-stat="score">0</dd>
                </div>
                <div>
                    <dt>Time</dt>
                    <dd data-stat="time">00:00</dd>
                </div>
                <div>
                    <dt>Lives</dt>
                    <dd data-stat="lives">0</dd>
                </div>
            </dl>
        `);

        this.scoreLabel = this.getElement('[data-stat="score"]');
        this.timeLabel = this.getElement('[data-stat="time"]');
        this.livesLabel = this.getElement('[data-stat="lives"]');
    }

    public render({ score, timeLeft, lives }: HeaderView): void {
        this.scoreLabel.textContent = String(score);
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        this.timeLabel.textContent = `${minutes}:${seconds}`;
        this.livesLabel.textContent = String(lives);
    }
}
