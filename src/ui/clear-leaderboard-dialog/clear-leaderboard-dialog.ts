import { DIFFICULTY_LABELS } from '@/data/difficulty';
import type { Difficulty } from '@/types/difficulty';
import { Dialog } from '@/ui/dialog/dialog';
import { html } from '@/utils/html';

export class ClearLeaderboardDialog extends Dialog {
    private difficulty: Difficulty | undefined;

    constructor(onConfirm: (difficulty: Difficulty) => void) {
        super({
            modifier: 'dialog--centered',
            labelledBy: 'clear-leaderboard-title',
            describedBy: 'clear-leaderboard-description',
        });
        this.setContent(html`
            <h2 class="dialog__title" id="clear-leaderboard-title">Clear leaderboard?</h2>
            <p class="dialog__description" id="clear-leaderboard-description"></p>
            <div class="dialog__actions">
                <button
                    class="dialog__button dialog__button--secondary"
                    type="button"
                    data-action="cancel"
                    autofocus
                >
                    Cancel
                </button>
                <button
                    class="dialog__button dialog__button--danger"
                    type="button"
                    data-action="confirm"
                >
                    Clear leaderboard
                </button>
            </div>
        `);
        this.getElement('[data-action="cancel"]').addEventListener('click', () => this.close(), {
            signal: this.eventSignal,
        });
        this.getElement('[data-action="confirm"]').addEventListener(
            'click',
            () => {
                if (!this.difficulty) return;
                this.close();
                onConfirm(this.difficulty);
            },
            { signal: this.eventSignal },
        );
    }

    public render(difficulty: Difficulty): void {
        this.difficulty = difficulty;
        this.getElement('#clear-leaderboard-description').textContent =
            `All ${DIFFICULTY_LABELS[difficulty]} results will be permanently removed. Other difficulties will be kept.`;
    }
}
