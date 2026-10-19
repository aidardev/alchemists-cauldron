import type { GameState } from '../types/game';
import { canAddIngredient } from './can-add-ingredient';

export function addIngredient(state: GameState, id: string): GameState {
    if (!canAddIngredient(state, id)) {
        return state;
    }

    return {
        ...state,
        shelfStock: {
            ...state.shelfStock,
            [id]: (state.shelfStock[id] ?? 0) - 1,
        },
        cauldronIngredientIds: [...state.cauldronIngredientIds, id],
    };
}
