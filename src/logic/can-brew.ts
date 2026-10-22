import type { GameState } from '@/types/game';

export function canBrew(state: GameState): boolean {
    return (
        state.status === 'playing' &&
        state.timeLeft > 0 &&
        state.endTime !== undefined &&
        state.lives > 0 &&
        state.activeRecipe !== undefined &&
        state.cauldronIngredientIds.length > 0
    );
}
