import type { GameState } from '@/types/game';

export function createInitialState(): GameState {
    return {
        status: 'menu',
        shelfStock: {},
        cauldronIngredientIds: [],
        activeRecipe: undefined,
        score: 0,
        timeLeft: 0,
        endTime: undefined,
        gameOverReason: undefined,
        lives: 0,
        lastBrew: undefined,
    };
}
