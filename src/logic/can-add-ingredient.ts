import { LEVEL_ONE_RULES } from '@/data/game-rules';
import type { GameState } from '@/types/game';

export function canAddIngredient(state: GameState, id: string): boolean {
    const stock = state.shelfStock[id] ?? 0;

    return (
        state.status === 'playing' &&
        state.timeLeft > 0 &&
        state.lives > 0 &&
        stock > 0 &&
        state.cauldronIngredientIds.length < LEVEL_ONE_RULES.cauldronCapacity
    );
}
