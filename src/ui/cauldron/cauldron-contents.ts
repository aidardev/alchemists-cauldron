import { BaseComponent } from '@/core/base-component';
import type { CauldronView } from '@/types/view';
import { html, type SafeHtml } from '@/utils/html';
import { ingredientIcon } from '../ingredient-icon/ingredient-icon';

export class CauldronContents extends BaseComponent<'ol'> {
    private renderedCount = 0;

    constructor() {
        super('ol', 'cauldron__contents');

        this.element.setAttribute('aria-label', 'Added ingredients');
    }

    public render({ ingredients, capacity }: CauldronView): void {
        const length = Math.max(capacity, ingredients.length);
        const items: SafeHtml[] = [];

        for (let index = 0; index < length; index += 1) {
            const ingredient = ingredients[index];

            items.push(
                ingredient
                    ? html`
                          <li
                              class="cauldron__item ${
                                  index >= this.renderedCount ? 'cauldron__item--new' : ''
                              }"
                          >
                              ${ingredientIcon(ingredient.id)}<span>${ingredient.name}</span>
                          </li>
                      `
                    : html`<li
                          class="cauldron__item cauldron__item--empty"
                          aria-hidden="true"
                      ></li>`,
            );
        }

        this.renderedCount = ingredients.length;
        this.setHtml(html`${items}`);
    }
}
