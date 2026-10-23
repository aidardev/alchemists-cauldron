import { DIFFICULTY_RULES } from '@/data/difficulty';
import { INGREDIENTS } from '@/data/ingredients';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { calculateCauldron } from './calculate-cauldron';
import { canBrew } from './can-brew';
import { isBrewSuccessful } from './check-brew';
import { finishGame } from './finish-game';
import { getTimeLeft, updateGameTime } from './game-time';
import { getCauldronIngredients } from './get-cauldron-ingredients';
import { pickRecipe } from './pick-recipe';

export function brewPotion(
    state: GameState,
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
    now: number = Date.now(),
): GameState {
    const current = updateGameTime(state, now);
    if (!canBrew(current) || !current.activeRecipe || current.endTime === undefined) return current;

    const rules = DIFFICULTY_RULES[current.difficulty];
    const ingredients = getCauldronIngredients(current.cauldronIngredientIds, catalog);
    const success = isBrewSuccessful(
        calculateCauldron(ingredients),
        current.activeRecipe.targets,
        rules.tolerance,
    );

    if (success) {
        // Extend the exact deadline, rather than the rounded display value.
        const endTime = Math.min(
            current.endTime + rules.timeBonusSeconds * 1000,
            now + rules.startTimeSeconds * 1000,
        );

        return finishGame({
            ...current,
            cauldronIngredientIds: [],
            activeRecipe: pickRecipe(current.difficulty, random),
            score: current.score + rules.scorePerBrew,
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
