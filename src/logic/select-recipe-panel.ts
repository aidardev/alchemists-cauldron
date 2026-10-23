import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { GameState } from '@/types/game';
import type { RecipePanelView } from '@/types/view';

export function selectRecipePanel(state: GameState): RecipePanelView {
    const ingredientCount = state.cauldronIngredientIds.length;
    const { maxCauldronSize: capacity, tolerance } = DIFFICULTY_RULES[state.difficulty];

    return {
        recipe: state.activeRecipe,
        ingredientCount,
        capacity,
        isFull: ingredientCount >= capacity,
        tolerance,
        lastBrew: state.lastBrew,
        isGameOver: state.status === 'game-over',
    };
}
