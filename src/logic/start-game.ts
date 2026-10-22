import { LEVEL_ONE_RULES } from '@/data/game-rules';
import { INGREDIENTS } from '@/data/ingredients';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { createStock } from './create-stock';
import { pickRecipe } from './pick-recipe';

export function startGame(
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
    now: number = Date.now(),
): GameState {
    return {
        status: 'playing',
        shelfStock: createStock(catalog.slice(0, LEVEL_ONE_RULES.shelfSize), random),
        cauldronIngredientIds: [],
        activeRecipe: pickRecipe(LEVEL_ONE_RULES.difficulty, random),
        score: 0,
        timeLeft: LEVEL_ONE_RULES.startingTime,
        endTime: now + LEVEL_ONE_RULES.startingTime * 1000,
        gameOverReason: undefined,
        lives: LEVEL_ONE_RULES.startingLives,
        lastBrew: undefined,
    };
}
