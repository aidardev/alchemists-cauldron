import type { PauseDialogView } from '@/types/view';
import { Dialog } from '@/ui/dialog/dialog';
import { formatTime } from '@/utils/format-time';
import { html } from '@/utils/html';

interface PauseDialogOptions {
    readonly onResume: () => void;
    readonly onExitToMenu: () => void;
}

export class PauseDialog extends Dialog {
    private readonly scoreLabel: HTMLElement;
    private readonly timeLabel: HTMLElement;

    constructor({ onResume, onExitToMenu }: PauseDialogOptions) {
        super({
            modifier: 'dialog--centered',
            labelledBy: 'pause-title',
            describedBy: 'pause-description',
            onClose: (returnValue) => {
                if (returnValue !== 'state-change') onResume();
            },
        });
        this.element.id = 'pause-dialog';

        this.setContent(html`
            <div class="dialog__emblem" aria-hidden="true">
                <svg viewBox="0 0 32 32" focusable="false">
                    <path d="M11 8v16M21 8v16"></path>
                </svg>
            </div>
            <h2 class="dialog__title" id="pause-title">Game paused</h2>
            <p class="dialog__description" id="pause-description">
                The clock is stopped. Your mixture is safe.
            </p>
            <dl class="dialog__summary">
                <div>
                    <dt>Score</dt>
                    <dd data-stat="score">0</dd>
                </div>
                <div>
                    <dt>Time left</dt>
                    <dd data-stat="time">00:00</dd>
                </div>
            </dl>
            <div class="dialog__actions">
                <button class="dialog__button" type="button" data-action="resume" autofocus>
                    Resume
                </button>
                <button
                    class="dialog__button dialog__button--secondary"
                    type="button"
                    data-action="exit"
                >
                    Exit to Menu
                </button>
            </div>
        `);

        this.scoreLabel = this.getElement('[data-stat="score"]');
        this.timeLabel = this.getElement('[data-stat="time"]');
        this.getElement('[data-action="resume"]').addEventListener('click', onResume, {
            signal: this.eventSignal,
        });
        this.getElement('[data-action="exit"]').addEventListener('click', onExitToMenu, {
            signal: this.eventSignal,
        });
    }

    public render({ isVisible, score, timeLeft }: PauseDialogView): void {
        this.scoreLabel.textContent = String(score);
        this.timeLabel.textContent = formatTime(timeLeft);
        if (isVisible) this.open();
        else this.close('state-change');
    }
}
