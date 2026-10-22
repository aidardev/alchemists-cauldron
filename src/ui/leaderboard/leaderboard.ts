import type { LeaderboardEntry } from '@/types/leaderboard';
import { Dialog } from '@/ui/dialog/dialog';
import { formatDate } from '@/utils/format-date';
import { html } from '@/utils/html';
import './leaderboard.scss';

interface LeaderboardOptions {
    readonly onClear: () => void;
}

export class Leaderboard extends Dialog {
    private readonly results: HTMLElement;
    private readonly clearButton: HTMLButtonElement;
    private readonly message: HTMLElement;

    constructor({ onClear }: LeaderboardOptions) {
        super({ modifier: 'leaderboard', labelledBy: 'leaderboard-title' });
        this.element.id = 'leaderboard-dialog';
        this.setContent(html`
            <h2 class="dialog__title" id="leaderboard-title">Top alchemists</h2>
            <p class="dialog__description">The ten finest results from this browser.</p>
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
        this.message = this.getElement('[data-message]');
        this.clearButton = this.getElement('[data-action="clear"]');
        this.clearButton.addEventListener('click', onClear, { signal: this.eventSignal });
        this.getElement('[data-action="back"]').addEventListener('click', () => this.close(), {
            signal: this.eventSignal,
        });
    }

    public render(entries: readonly LeaderboardEntry[], message = ''): void {
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
                              Top 10 results
                          </caption>
                          <thead>
                              <tr>
                                  <th scope="col">Rank</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Score</th>
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
