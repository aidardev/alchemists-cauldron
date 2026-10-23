import { DIFFICULTY_LABELS } from '@/data/difficulty';
import type { Difficulty } from '@/types/difficulty';
import type { LeaderboardView } from '@/types/view';
import { Dialog } from '@/ui/dialog/dialog';
import { DifficultySelector } from '@/ui/difficulty-selector/difficulty-selector';
import { formatDate } from '@/utils/format-date';
import { html } from '@/utils/html';
import './leaderboard.scss';

interface LeaderboardOptions {
    readonly onClear: () => void;
    readonly onSelectDifficulty: (difficulty: Difficulty) => void;
}

export class Leaderboard extends Dialog {
    private readonly results: HTMLElement;
    private readonly clearButton: HTMLButtonElement;
    private readonly message: HTMLElement;
    private readonly selector: DifficultySelector;

    constructor({ onClear, onSelectDifficulty }: LeaderboardOptions) {
        super({ modifier: 'leaderboard', labelledBy: 'leaderboard-title' });
        this.element.id = 'leaderboard-dialog';
        this.setContent(html`
            <h2 class="dialog__title" id="leaderboard-title">Top alchemists</h2>
            <p class="dialog__description">The ten finest results from this browser.</p>
            <div data-selector></div>
            <div class="leaderboard__results"></div>
            <p class="dialog__description" role="status" data-message></p>
            <div class="dialog__actions">
                <button
                    class="dialog__button dialog__button--danger"
                    type="button"
                    data-action="clear"
                    aria-haspopup="dialog"
                >
                    Clear leaderboard
                </button>
                <button class="dialog__button" type="button" data-action="back" autofocus>
                    Back
                </button>
            </div>
        `);
        this.results = this.getElement('.leaderboard__results');
        this.selector = this.adopt(
            new DifficultySelector('Leaderboard difficulty', onSelectDifficulty),
        );
        this.getElement('[data-selector]').replaceWith(this.selector.element);
        this.message = this.getElement('[data-message]');
        this.clearButton = this.getElement('[data-action="clear"]');
        this.clearButton.addEventListener('click', onClear, { signal: this.eventSignal });
        this.getElement('[data-action="back"]').addEventListener('click', () => this.close(), {
            signal: this.eventSignal,
        });
    }

    public render({ difficulty, entries, message }: LeaderboardView): void {
        this.selector.render(difficulty);
        this.message.textContent = message;
        this.clearButton.disabled = entries.length === 0;
        this.results.innerHTML =
            entries.length === 0
                ? html`
                      <p class="leaderboard__empty">No results yet. Brew your way to the top!</p>
                  `.value
                : html`
                      <table class="leaderboard__table">
                          <caption class="leaderboard__caption">
                              ${DIFFICULTY_LABELS[difficulty]} · Top 10 results
                          </caption>
                          <thead>
                              <tr>
                                  <th scope="col">Rank</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Score</th>
                                  <th scope="col">Difficulty</th>
                                  <th scope="col">Date</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${entries.map(
                                  (entry, index) => html`
                                      <tr class="${index < 3 ? 'leaderboard__podium' : ''}">
                                          <td>${index + 1}</td>
                                          <th scope="row">${entry.name}</th>
                                          <td>${entry.score}</td>
                                          <td>${DIFFICULTY_LABELS[entry.difficulty]}</td>
                                          <td>
                                              <time
                                                  datetime="${new Date(entry.timestamp).toISOString()}"
                                                  >${formatDate(entry.timestamp)}</time
                                              >
                                          </td>
                                      </tr>
                                  `,
                              )}
                          </tbody>
                      </table>
                  `.value;
    }
}
