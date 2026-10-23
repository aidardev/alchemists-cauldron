import { DEFAULT_DIFFICULTY } from '@/data/difficulty';
import type { Difficulty } from '@/types/difficulty';
import type { GameState } from '@/types/game';

export function createInitialState(difficulty: Difficulty = DEFAULT_DIFFICULTY): GameState {
    return {
        difficulty,
        status: 'menu',
        shelfStock: {},
        cauldronIngredientIds: [],
        activeRecipe: undefined,
        score: 0,
        timeLeft: 0,
        endTime: undefined,
        pausedAt: undefined,
        gameOverReason: undefined,
        lives: 0,
        lastBrew: undefined,
    };
}
