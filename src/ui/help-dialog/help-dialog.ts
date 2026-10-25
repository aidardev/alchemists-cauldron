import { DIFFICULTY_LABELS, DIFFICULTY_RULES } from '@/data/difficulty';
import { MAX_STOCK, MIN_STOCK } from '@/logic/create-stock';
import { POUR_OUT_COST_SECONDS } from '@/logic/pour-out';
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
                    Choose a difficulty in Settings before starting. Press Start game to begin with
                    ${rules.startTimeSeconds} seconds and ${rules.lives} lives. Difficulty stays
                    fixed for the run.
                </li>
                <li>
                    Click ingredients or drag them into the cauldron. The shelf has
                    ${rules.shelfSize} ingredient types, each with ${MIN_STOCK}–${MAX_STOCK}
                    portions. The cauldron holds up to ${rules.maxCauldronSize} portions.
                </li>
                <li>
                    Available cards can be dragged with a mouse. Drop one onto the highlighted
                    cauldron to add one portion. Cancelling a drag spends nothing; on touch screens,
                    tap a card to add it.
                </li>
                <li>
                    Temperature, Density and Magic Power are the sums of the added ingredient
                    values. Match all three recipe ranges. Brewing accepts values up to
                    ${rules.tolerance} below each range's minimum or above its maximum.
                </li>
                <li>
                    Press Brew to check the mixture. Success awards ${rules.scorePerBrew} points,
                    adds ${rules.timeBonusSeconds} seconds (up to ${rules.startTimeSeconds}) and
                    draws another recipe. Failure costs one life.
                </li>
                <li>
                    Every brew clears the cauldron. Spent ingredients never return to the shelf.
                </li>
                <li>
                    Pour Out clears a non-empty cauldron for ${POUR_OUT_COST_SECONDS} seconds
                    without losing a life. Ingredients are spent and the recipe stays the same. The
                    run ends if time or supplies run out.
                </li>
            </ol>
            <h3>Pause and resume</h3>
            <p>
                Pause stops the clock and hides the field. Hiding the browser tab also pauses the
                game. Resume continues the same mixture; Exit to Menu discards the run.
            </p>
            <h3>Keyboard controls</h3>
            <ul class="help-dialog__shortcuts">
                <li>
                    <kbd>1</kbd>–<kbd>${rules.shelfSize}</kbd> — add an ingredient in shelf order.
                    Empty slots keep their number.
                </li>
                <li><kbd>B</kbd> — Brew. <kbd>X</kbd> — Pour Out.</li>
                <li><kbd>P</kbd> or <kbd>Esc</kbd> — pause during play.</li>
                <li>
                    <kbd>Tab</kbd> moves focus; <kbd>Enter</kbd> or <kbd>Space</kbd> presses the
                    focused button. On pause, use Resume or close the dialog with <kbd>Esc</kbd>.
                </li>
            </ul>
            <p>
                Game shortcuts work only during play and are ignored while typing. Letter keys use
                their physical positions, so they also work with another keyboard layout.
            </p>
            <h3>Save and continue</h3>
            <p>
                Progress is saved automatically. After reloading or reopening the page, Continue
                Game restores your unfinished run in a paused state, including the mixture and
                remaining stock. Press Resume to continue. New game replaces the save; Exit to Menu
                clears it.
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
