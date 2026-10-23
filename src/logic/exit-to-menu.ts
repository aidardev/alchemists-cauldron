import type { GameState } from '@/types/game';
import { createInitialState } from './create-initial-state';

export function exitToMenu(state: GameState): GameState {
    return state.status === 'paused' || state.status === 'game-over'
        ? createInitialState(state.difficulty)
        : state;
}
