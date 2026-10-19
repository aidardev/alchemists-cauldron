import { BaseComponent } from '@/core/base-component';
import type { Ingredient } from '@/types/ingredient';
import type { ShelfSlotView } from '@/types/view';
import { formatSigned } from '@/utils/format-signed';
import { html, SafeHtml } from '@/utils/html';
import { ingredientIcon } from '../ingredient-icon/ingredient-icon';
import './shelf-slot.scss';

const stat = (kind: string, label: string, value: number): SafeHtml => html`
    <span class="shelf-slot__stat shelf-slot__stat--${kind}">
        <span class="shelf-slot__stat-label">${label}</span>${formatSigned(value)}
    </span>
`;

export class ShelfSlot extends BaseComponent<'button'> {
    private readonly icon: HTMLElement;
    private readonly ingredient: Ingredient;
    private readonly stockBadge: HTMLElement;

    constructor(ingredient: Ingredient, onSelect: (ingredientId: string) => void) {
        super('button', 'shelf-slot');

        this.ingredient = ingredient;
        this.element.type = 'button';

        this.setHtml(html`
            <span class="shelf-slot__icon">${ingredientIcon(ingredient.id)}</span>
            <span class="shelf-slot__name">${ingredient.name}</span>
            <span class="shelf-slot__stats">
                ${stat('temperature', 'T', ingredient.temperature)}
                ${stat('density', 'D', ingredient.density)}
                ${stat('magic', 'MP', ingredient.magicPower)}
            </span>
            <span class="shelf-slot__stock"></span>
        `);

        this.icon = this.getElement('.ingredient-icon');
        this.stockBadge = this.getElement('.shelf-slot__stock');

        this.element.addEventListener('click', () => onSelect(ingredient.id), {
            signal: this.eventSignal,
        });
    }

    private describe(stock: number): string {
        const { name, temperature, density, magicPower } = this.ingredient;

        return `${name}: temperature ${formatSigned(temperature)}, density ${formatSigned(density)}, magic power ${formatSigned(magicPower)}. ${stock} left`;
    }

    public update({ stock, disabled }: ShelfSlotView): void {
        const isEmpty = stock === 0;

        this.stockBadge.textContent = String(stock);
        this.element.disabled = disabled;
        this.element.classList.toggle('shelf-slot--empty', isEmpty);
        this.icon.hidden = isEmpty;
        this.element.setAttribute('aria-label', this.describe(stock));
    }
}
