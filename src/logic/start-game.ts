import { LEVEL_ONE_RULES } from '@/data/game-rules';
import { INGREDIENTS } from '@/data/ingredients';
import { INITIAL_RECIPE } from '@/data/recipes';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { createStock } from './create-stock';

export function startGame(
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
): GameState {
    return {
        status: 'playing',
        shelfStock: createStock(catalog.slice(0, LEVEL_ONE_RULES.shelfSize), random),
        cauldronIngredientIds: [],
        activeRecipe: INITIAL_RECIPE,
    };
}
