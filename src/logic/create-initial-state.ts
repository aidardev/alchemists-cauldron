import type { GameState } from '@/types/game';

export function createInitialState(): GameState {
    return {
        status: 'menu',
        shelfStock: {},
        cauldronIngredientIds: [],
        activeRecipe: undefined,
    };
}
