import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import type { CauldronView } from '@/types/view';

export function selectCauldron(state: GameState, catalog: readonly Ingredient[]): CauldronView {
    const byId = new Map(catalog.map((ingredient) => [ingredient.id, ingredient]));
    const ingredients: Ingredient[] = [];

    for (const id of state.cauldronIngredientIds) {
        const ingredient = byId.get(id);

        if (ingredient) ingredients.push(ingredient);
    }

    return { ingredients, capacity: 4 };
}
