import type { GameState } from '@/types/game';

export function canBrew(state: GameState): boolean {
    return (
        state.status === 'playing' &&
        state.lives > 0 &&
        state.activeRecipe !== undefined &&
        state.cauldronIngredientIds.length > 0
    );
}
