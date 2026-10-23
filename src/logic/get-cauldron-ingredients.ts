import type { Ingredient } from '@/types/ingredient';

export function getCauldronIngredients(
    ids: readonly string[],
    catalog: readonly Ingredient[],
): readonly Ingredient[] {
    const byId = new Map(catalog.map((ingredient) => [ingredient.id, ingredient]));
    const ingredients: Ingredient[] = [];

    for (const id of ids) {
        const ingredient = byId.get(id);
        if (ingredient) ingredients.push(ingredient);
    }

    return ingredients;
}
