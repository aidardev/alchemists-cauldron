import { BaseComponent } from '@/core/base-component';
import type { Ingredient } from '@/types/ingredient';
import { ingredientIcon } from '@/ui/ingredient-icon/ingredient-icon';

export class CauldronIngredients extends BaseComponent<'div'> {
    private readonly icons: HTMLElement[] = [];
    private ingredientIds: readonly string[] = [];

    constructor() {
        super('div', 'cauldron__ingredients');
        this.element.setAttribute('aria-hidden', 'true');
    }

    public render(ingredients: readonly Ingredient[]): void {
        let unchanged = 0;
        while (
            unchanged < ingredients.length &&
            this.ingredientIds[unchanged] === ingredients[unchanged]?.id
        ) {
            unchanged += 1;
        }

        while (this.icons.length > unchanged) this.icons.pop()?.remove();
        for (const ingredient of ingredients.slice(unchanged)) {
            const icon = document.createElement('span');
            icon.className = 'cauldron__floating-ingredient';
            icon.innerHTML = ingredientIcon(ingredient.id).value;
            this.icons.push(icon);
            this.element.append(icon);
        }
        this.ingredientIds = ingredients.map((ingredient) => ingredient.id);
    }
}
