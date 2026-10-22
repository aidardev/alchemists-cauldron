import type { GameState } from '@/types/game';
import { createInitialState } from './create-initial-state';

export function exitToMenu(state: GameState): GameState {
    return state.status === 'paused' ? createInitialState() : state;
}
