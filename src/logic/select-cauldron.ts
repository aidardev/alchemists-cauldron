import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import type { CauldronView } from '@/types/view';
import { getCauldronIngredients } from './get-cauldron-ingredients';

export function selectCauldron(state: GameState, catalog: readonly Ingredient[]): CauldronView {
    return {
        ingredients: getCauldronIngredients(state.cauldronIngredientIds, catalog),
        capacity: DIFFICULTY_RULES[state.difficulty].maxCauldronSize,
    };
}
