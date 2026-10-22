import type { GameState } from '@/types/game';
import { updateGameTime } from './game-time';

export function pauseGame(state: GameState, now: number): GameState {
    const current = updateGameTime(state, now);
    return current.status === 'playing' && current.endTime !== undefined
        ? { ...current, status: 'paused', pausedAt: now }
        : current;
}
