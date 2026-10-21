import { LEVEL_ONE_RULES } from '@/data/game-rules';
import type { GameState } from '@/types/game';
import type { RecipePanelView } from '@/types/view';

export function selectRecipePanel(state: GameState): RecipePanelView {
    const ingredientCount = state.cauldronIngredientIds.length;
    const capacity = LEVEL_ONE_RULES.cauldronCapacity;

    return {
        recipe: state.activeRecipe,
        ingredientCount,
        capacity,
        isFull: ingredientCount >= capacity,
        tolerance: LEVEL_ONE_RULES.recipeTolerance,
        lastBrew: state.lastBrew,
        isGameOver: state.status === 'game-over',
    };
}
