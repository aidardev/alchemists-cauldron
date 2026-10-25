import { BaseComponent } from '@/core/base-component';
import type { CauldronView } from '@/types/view';
import { html } from '@/utils/html';
import { ingredientIcon } from '../ingredient-icon/ingredient-icon';

export class CauldronContents extends BaseComponent<'ol'> {
    private readonly items: HTMLLIElement[] = [];
    private readonly ingredientIds: (string | undefined)[] = [];

    constructor() {
        super('ol', 'cauldron__contents');

        this.element.setAttribute('aria-label', 'Added ingredients');
    }

    public render({ ingredients, capacity }: CauldronView): void {
        const length = Math.max(capacity, ingredients.length);
        while (this.items.length > length) {
            this.items.pop()?.remove();
            this.ingredientIds.pop();
        }

        for (let index = 0; index < length; index += 1) {
            const ingredient = ingredients[index];
            let item = this.items[index];
            if (item && this.ingredientIds[index] === ingredient?.id) continue;
            if (!item) {
                item = document.createElement('li');
                this.items.push(item);
                this.element.append(item);
            }
            this.ingredientIds[index] = ingredient?.id;
            item.className = `cauldron__item cauldron__item--${ingredient ? 'new' : 'empty'}`;
            item.setAttribute('aria-hidden', String(!ingredient));
            item.innerHTML = ingredient
                ? html`${ingredientIcon(ingredient.id)}<span>${ingredient.name}</span>`.value
                : '';
        }
    }
}
