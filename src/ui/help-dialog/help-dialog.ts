import { DIFFICULTY_LABELS, DIFFICULTY_RULES } from '@/data/difficulty';
import { MAX_STOCK, MIN_STOCK } from '@/logic/create-stock';
import type { Difficulty } from '@/types/difficulty';
import { Dialog } from '@/ui/dialog/dialog';
import { html } from '@/utils/html';
import './help-dialog.scss';

export class HelpDialog extends Dialog {
    private readonly rules: HTMLElement;
    private renderedDifficulty: Difficulty | undefined;

    constructor() {
        super({ labelledBy: 'help-title' });
        this.element.id = 'help-dialog';
        this.setContent(html`
            <h2 class="dialog__title" id="help-title">How to play</h2>
            <div class="help-dialog__rules"></div>
            <div class="dialog__actions">
                <button class="dialog__button" type="button" autofocus>Back</button>
            </div>
        `);
        this.rules = this.getElement('.help-dialog__rules');
        this.getElement('.dialog__button').addEventListener('click', () => this.close(), {
            signal: this.eventSignal,
        });
    }

    public render(difficulty: Difficulty): void {
        if (difficulty === this.renderedDifficulty) return;
        this.renderedDifficulty = difficulty;
        const rules = DIFFICULTY_RULES[difficulty];
        this.rules.innerHTML = html`
            <p class="dialog__description">
                Selected difficulty: <strong>${DIFFICULTY_LABELS[difficulty]}</strong>
            </p>
            <ol>
                <li>
                    Press Start game to begin with ${rules.startTimeSeconds} seconds and
                    ${rules.lives} lives.
                </li>
                <li>
                    Click ingredients to add them to the cauldron. The shelf has ${rules.shelfSize}
                    ingredient types, each with ${MIN_STOCK}–${MAX_STOCK} portions. The cauldron
                    holds up to ${rules.maxCauldronSize} portions.
                </li>
                <li>
                    Every ingredient changes Temperature, Density and Magic Power. Match all three
                    recipe ranges; brewing allows ±${rules.tolerance} on each parameter.
                </li>
                <li>
                    Press Brew to check the mixture. Success awards ${rules.scorePerBrew} points,
                    adds ${rules.timeBonusSeconds} seconds (up to ${rules.startTimeSeconds}) and
                    draws another recipe. Failure costs one life.
                </li>
                <li>
                    Every brew clears the cauldron. Spent ingredients never return to the shelf.
                </li>
            </ol>
            <h3>Pause and resume</h3>
            <p>
                Pause stops the clock and hides the field. Hiding the browser tab also pauses the
                game. Resume continues the same mixture; Exit to Menu discards the run.
            </p>
            <h3>Game Over and scores</h3>
            <p>
                The run ends when time or lives reach zero, or when both the shelf and cauldron are
                empty. Submit a qualifying score to the Top 10 for your difficulty, replay, or
                return to the menu to choose another challenge.
            </p>
        `.value;
    }
}
