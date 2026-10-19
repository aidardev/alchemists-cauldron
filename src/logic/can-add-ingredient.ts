import type { GameState } from '@/types/game';

export function canAddIngredient(state: GameState, id: string): boolean {
    const stock = state.shelfStock[id] ?? 0;

    return state.status === 'playing' && stock > 0 && state.cauldronIngredientIds.length < 4;
}
