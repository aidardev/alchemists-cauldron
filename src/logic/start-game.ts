import { DIFFICULTY_RULES } from '@/data/difficulty';
import { INGREDIENTS } from '@/data/ingredients';
import type { Difficulty } from '@/types/difficulty';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import { createInitialState } from './create-initial-state';
import { createStock } from './create-stock';
import { pickRecipe } from './pick-recipe';

export function startGame(
    difficulty: Difficulty,
    catalog: readonly Ingredient[] = INGREDIENTS,
    random: () => number = Math.random,
    now: number = Date.now(),
): GameState {
    const rules = DIFFICULTY_RULES[difficulty];
    return {
        ...createInitialState(difficulty),
        status: 'playing',
        shelfStock: createStock(catalog.slice(0, rules.shelfSize), random),
        activeRecipe: pickRecipe(difficulty, random),
        timeLeft: rules.startTimeSeconds,
        endTime: now + rules.startTimeSeconds * 1000,
        lives: rules.lives,
    };
}
