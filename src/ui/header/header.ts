import { BaseComponent } from '@/core/base-component';
import { DIFFICULTY_LABELS } from '@/data/difficulty';
import type { HeaderView } from '@/types/view';
import { formatTime } from '@/utils/format-time';
import { html } from '@/utils/html';
import './header.scss';

export class Header extends BaseComponent<'header'> {
    private readonly scoreLabel: HTMLElement;
    private readonly timeLabel: HTMLElement;
    private readonly livesLabel: HTMLElement;
    private readonly timeProgress: HTMLElement;
    private readonly difficultyLabel: HTMLElement;

    constructor() {
        super('header', 'header');

        this.setHtml(html`
            <h1 class="header__title">Alchemist's Cauldron</h1>
            <p class="header__difficulty"></p>
            <span class="header__divider" aria-hidden="true"></span>
            <dl class="header__stats" aria-label="Game stats">
                <div>
                    <dt>Score</dt>
                    <dd data-stat="score">0</dd>
                </div>
                <div class="header__timer">
                    <dt>Time</dt>
                    <dd>
                        <span data-stat="time">00:00</span>
                        <span
                            class="header__time-progress"
                            role="progressbar"
                            aria-label="Time remaining"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <span class="header__time-fill"></span>
                        </span>
                    </dd>
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
        this.timeProgress = this.getElement('.header__time-progress');
        this.difficultyLabel = this.getElement('.header__difficulty');
    }

    public render({
        difficulty,
        score,
        timeLeft,
        lives,
        timeProgress,
        isTimeCritical,
    }: HeaderView): void {
        this.difficultyLabel.textContent = `${DIFFICULTY_LABELS[difficulty]} difficulty`;
        this.scoreLabel.textContent = String(score);
        this.timeLabel.textContent = formatTime(timeLeft);
        this.livesLabel.textContent = String(lives);
        this.element.classList.toggle('header--time-critical', isTimeCritical);
        this.timeProgress.style.setProperty('--time-progress', String(timeProgress / 100));
        this.timeProgress.setAttribute('aria-valuenow', String(timeProgress));
        this.timeProgress.setAttribute('aria-valuetext', `${formatTime(timeLeft)} remaining`);
    }
}
