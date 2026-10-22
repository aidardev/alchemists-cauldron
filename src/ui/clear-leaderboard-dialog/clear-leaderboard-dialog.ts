import { Dialog } from '@/ui/dialog/dialog';
import { html } from '@/utils/html';

export class ClearLeaderboardDialog extends Dialog {
    constructor(onConfirm: () => void) {
        super({
            modifier: 'dialog--centered',
            labelledBy: 'clear-leaderboard-title',
            describedBy: 'clear-leaderboard-description',
        });
        this.setContent(html`
            <h2 class="dialog__title" id="clear-leaderboard-title">Clear leaderboard?</h2>
            <p class="dialog__description" id="clear-leaderboard-description">
                All saved results will be permanently removed.
            </p>
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
                this.close();
                onConfirm();
            },
            { signal: this.eventSignal },
        );
    }
}
