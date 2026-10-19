import type { ShelfStock } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';

export const MIN_STOCK = 2;
export const MAX_STOCK = 15;

// random is injectable, so tests don't depend on real randomness.
export function createStock(
    ingredients: readonly Ingredient[],
    random: () => number = Math.random,
): ShelfStock {
    const stock: ShelfStock = {};

    for (const ingredient of ingredients) {
        stock[ingredient.id] = Math.floor(random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
    }

    return stock;
}
