import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { GameState } from '@/types/game';

export function canAddIngredient(state: GameState, id: string): boolean {
    const stock = state.shelfStock[id] ?? 0;

    return (
        state.status === 'playing' &&
        state.timeLeft > 0 &&
        state.lives > 0 &&
        stock > 0 &&
        state.cauldronIngredientIds.length < DIFFICULTY_RULES[state.difficulty].maxCauldronSize
    );
}
