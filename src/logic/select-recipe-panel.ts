import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { GameState } from '@/types/game';
import type { RecipePanelView } from '@/types/view';

export function selectRecipePanel(state: GameState): RecipePanelView {
    const ingredientCount = state.cauldronIngredientIds.length;
    const { maxCauldronSize: capacity } = DIFFICULTY_RULES[state.difficulty];

    return {
        recipe: state.activeRecipe,
        ingredientCount,
        capacity,
        isFull: ingredientCount >= capacity,
        lastBrew: state.lastBrew,
        isGameOver: state.status === 'game-over',
    };
}
