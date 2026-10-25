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
            <div class="header__brand">
                <span class="header__mark" aria-hidden="true"></span>
                <h1 class="header__title">Alchemist's Cauldron</h1>
            </div>
            <dl class="header__stats" aria-label="Game stats">
                <div>
                    <dt>
                        <svg
                            class="header__stat-icon"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                d="M8 3h8v6a4 4 0 0 1-8 0ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v5m-4 3h8m-7-3h6v3"
                            ></path>
                        </svg>
                        Score
                    </dt>
                    <dd data-stat="score">0</dd>
                </div>
                <div class="header__timer">
                    <dt>
                        <svg
                            class="header__stat-icon"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M12 7v5h4"></path>
                        </svg>
                        Time
                    </dt>
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
                    <dt>
                        <svg
                            class="header__stat-icon header__stat-icon--lives"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path d="m12 20-8-8a5 5 0 0 1 8-6 5 5 0 0 1 8 6Z"></path>
                        </svg>
                        Lives
                    </dt>
                    <dd data-stat="lives">0</dd>
                </div>
            </dl>
            <p class="header__difficulty">
                <span class="header__difficulty-label">Difficulty</span>
                <strong class="header__difficulty-value"></strong>
            </p>
        `);

        this.scoreLabel = this.getElement('[data-stat="score"]');
        this.timeLabel = this.getElement('[data-stat="time"]');
        this.livesLabel = this.getElement('[data-stat="lives"]');
        this.timeProgress = this.getElement('.header__time-progress');
        this.difficultyLabel = this.getElement('.header__difficulty-value');
    }

    public render({
        difficulty,
        score,
        timeLeft,
        lives,
        timeProgress,
        isTimeCritical,
    }: HeaderView): void {
        this.difficultyLabel.textContent = DIFFICULTY_LABELS[difficulty];
        this.scoreLabel.textContent = String(score);
        this.timeLabel.textContent = formatTime(timeLeft);
        this.livesLabel.textContent = String(lives);
        this.element.classList.toggle('header--time-critical', isTimeCritical);
        this.timeProgress.style.setProperty('--time-progress', String(timeProgress / 100));
        this.timeProgress.setAttribute('aria-valuenow', String(timeProgress));
        this.timeProgress.setAttribute('aria-valuetext', `${formatTime(timeLeft)} remaining`);
    }
}
