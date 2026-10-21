import { LEVEL_ONE_RULES } from '@/data/game-rules';
import { INGREDIENTS } from '@/data/ingredients';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { calculateCauldron } from './calculate-cauldron';
import { canBrew } from './can-brew';
import { isBrewSuccessful } from './check-brew';
import { pickRecipe } from './pick-recipe';
import { selectCauldron } from './select-cauldron';

export function brewPotion(
    state: GameState,
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
): GameState {
    if (!canBrew(state) || !state.activeRecipe) return state;

    const { ingredients } = selectCauldron(state, catalog);
    const success = isBrewSuccessful(
        calculateCauldron(ingredients),
        state.activeRecipe.targets,
        LEVEL_ONE_RULES.recipeTolerance,
    );

    if (success) {
        return {
            ...state,
            cauldronIngredientIds: [],
            activeRecipe: pickRecipe(LEVEL_ONE_RULES.difficulty, random),
            score: state.score + LEVEL_ONE_RULES.scorePerBrew,
            timeLeft: Math.min(
                LEVEL_ONE_RULES.startingTime,
                state.timeLeft + LEVEL_ONE_RULES.timeBonus,
            ),
            lastBrew: 'success',
        };
    }

    const lives = state.lives - 1;

    return {
        ...state,
        status: lives === 0 ? 'game-over' : state.status,
        cauldronIngredientIds: [],
        lives,
        lastBrew: 'failure',
    };
}
