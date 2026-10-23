import { BaseComponent } from '@/core/base-component';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '@/data/difficulty';
import type { Difficulty } from '@/types/difficulty';
import './difficulty-selector.scss';

export class DifficultySelector extends BaseComponent<'div'> {
    private readonly buttons = new Map<Difficulty, HTMLButtonElement>();

    constructor(label: string, onSelect: (difficulty: Difficulty) => void) {
        super('div', 'difficulty-selector');
        this.element.setAttribute('role', 'group');
        this.element.setAttribute('aria-label', label);

        for (const difficulty of DIFFICULTIES) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'difficulty-selector__button';
            button.textContent = DIFFICULTY_LABELS[difficulty];
            button.addEventListener('click', () => onSelect(difficulty), {
                signal: this.eventSignal,
            });
            this.buttons.set(difficulty, button);
            this.element.append(button);
        }
    }

    public render(difficulty: Difficulty, isDisabled = false): void {
        for (const [value, button] of this.buttons) {
            button.setAttribute('aria-pressed', String(value === difficulty));
            button.disabled = isDisabled;
        }
    }
}
