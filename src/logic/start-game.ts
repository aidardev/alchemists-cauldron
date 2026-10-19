import { INGREDIENTS } from '@/data/ingredients';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { createStock } from './create-stock';

export function startGame(
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
): GameState {
    return {
        status: 'playing',
        shelfStock: createStock(catalog.slice(0, 6), random),
        cauldronIngredientIds: [],
    };
}
