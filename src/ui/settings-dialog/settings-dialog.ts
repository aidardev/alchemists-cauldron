import { DIFFICULTY_LABELS, DIFFICULTY_RULES } from '@/data/difficulty';
import type { Difficulty } from '@/types/difficulty';
import type { SettingsView } from '@/types/view';
import { Dialog } from '@/ui/dialog/dialog';
import { DifficultySelector } from '@/ui/difficulty-selector/difficulty-selector';
import { html } from '@/utils/html';
import './settings-dialog.scss';

export class SettingsDialog extends Dialog {
    private readonly selector: DifficultySelector;
    private readonly rules: HTMLElement;
    private readonly description: HTMLElement;
    private renderedDifficulty: Difficulty | undefined;

    constructor(onSelect: (difficulty: Difficulty) => void) {
        super({ labelledBy: 'settings-title', describedBy: 'settings-description' });
        this.element.id = 'settings-dialog';
        this.setContent(html`
            <h2 class="dialog__title" id="settings-title">Settings</h2>
            <p class="dialog__description" id="settings-description">
                Choose your challenge, then use Start game when you are ready.
            </p>
            <h3 class="settings-dialog__section-title">Difficulty</h3>
            <div data-selector></div>
            <section
                class="settings-dialog__rules"
                aria-label="Selected difficulty rules"
                aria-live="polite"
            ></section>
            <div class="dialog__actions">
                <button class="dialog__button" type="button" autofocus>Back</button>
            </div>
        `);
        this.selector = this.adopt(new DifficultySelector('Game difficulty', onSelect));
        this.getElement('[data-selector]').replaceWith(this.selector.element);
        this.rules = this.getElement('.settings-dialog__rules');
        this.description = this.getElement('#settings-description');
        this.getElement('.dialog__button').addEventListener('click', () => this.close(), {
            signal: this.eventSignal,
        });
    }

    public render({ difficulty, canChange }: SettingsView): void {
        this.selector.render(difficulty, !canChange);
        this.description.textContent = canChange
            ? 'Choose your challenge, then use Start game when you are ready.'
            : 'Difficulty is locked for this run. Return to the main menu to change it.';
        if (difficulty === this.renderedDifficulty) return;
        this.renderedDifficulty = difficulty;
        const rules = DIFFICULTY_RULES[difficulty];
        this.rules.innerHTML = html`
            <h3 class="settings-dialog__heading">${DIFFICULTY_LABELS[difficulty]}</h3>
            <dl class="settings-dialog__stats">
                <div>
                    <dt>Ingredients on shelf</dt>
                    <dd>${rules.shelfSize}</dd>
                </div>
                <div>
                    <dt>Cauldron capacity</dt>
                    <dd>${rules.maxCauldronSize}</dd>
                </div>
                <div>
                    <dt>Starting time</dt>
                    <dd>${rules.startTimeSeconds} s</dd>
                </div>
                <div>
                    <dt>Lives</dt>
                    <dd>${rules.lives}</dd>
                </div>
                <div>
                    <dt>Brew allowance</dt>
                    <dd>±${rules.tolerance}</dd>
                </div>
                <div>
                    <dt>Score per brew</dt>
                    <dd>${rules.scorePerBrew}</dd>
                </div>
                <div>
                    <dt>Time bonus</dt>
                    <dd>+${rules.timeBonusSeconds} s</dd>
                </div>
            </dl>
        `.value;
    }
}
