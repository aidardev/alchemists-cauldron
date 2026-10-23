import type { Difficulty } from '@/types/difficulty';
import type { GameState } from '@/types/game';

export function setDifficulty(state: GameState, difficulty: Difficulty): GameState {
    return state.status === 'menu' && state.difficulty !== difficulty
        ? { ...state, difficulty }
        : state;
}
