import type { GameState } from '@/types/game';
import type { GameSave } from '@/types/game-save';

export function createGameSave(state: GameState, now: number): GameSave | undefined {
    if (
        (state.status !== 'playing' && state.status !== 'paused') ||
        !state.activeRecipe ||
        state.endTime === undefined
    )
        return undefined;

    const referenceTime = state.status === 'paused' ? state.pausedAt : now;
    if (referenceTime === undefined) return undefined;
    const timeLeft = (state.endTime - referenceTime) / 1000;
    if (timeLeft <= 0 || state.lives <= 0) return undefined;

    return {
        difficulty: state.difficulty,
        status: state.status,
        score: state.score,
        timeLeft,
        lives: state.lives,
        activeRecipe: state.activeRecipe,
        cauldronIngredientIds: [...state.cauldronIngredientIds],
        shelfStock: { ...state.shelfStock },
    };
}
