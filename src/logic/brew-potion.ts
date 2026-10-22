import { LEVEL_ONE_RULES } from '@/data/game-rules';
import { INGREDIENTS } from '@/data/ingredients';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { calculateCauldron } from './calculate-cauldron';
import { canBrew } from './can-brew';
import { isBrewSuccessful } from './check-brew';
import { finishGame } from './finish-game';
import { getTimeLeft, updateGameTime } from './game-time';
import { pickRecipe } from './pick-recipe';
import { selectCauldron } from './select-cauldron';

export function brewPotion(
    state: GameState,
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
    now: number = Date.now(),
): GameState {
    const current = updateGameTime(state, now);
    if (!canBrew(current) || !current.activeRecipe || current.endTime === undefined) return current;

    const { ingredients } = selectCauldron(current, catalog);
    const success = isBrewSuccessful(
        calculateCauldron(ingredients),
        current.activeRecipe.targets,
        LEVEL_ONE_RULES.recipeTolerance,
    );

    if (success) {
        // Extend the exact deadline, rather than the rounded display value.
        const endTime = Math.min(
            current.endTime + LEVEL_ONE_RULES.timeBonus * 1000,
            now + LEVEL_ONE_RULES.startingTime * 1000,
        );

        return finishGame({
            ...current,
            cauldronIngredientIds: [],
            activeRecipe: pickRecipe(LEVEL_ONE_RULES.difficulty, random),
            score: current.score + LEVEL_ONE_RULES.scorePerBrew,
            endTime,
            timeLeft: getTimeLeft(endTime, now),
            lastBrew: 'success',
        });
    }

    const lives = current.lives - 1;

    return finishGame({
        ...current,
        cauldronIngredientIds: [],
        lives,
        lastBrew: 'failure',
    });
}
