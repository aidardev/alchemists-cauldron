import type { GameState } from '@/types/game';
import { finishGame } from './finish-game';

export function getTimeLeft(endTime: number, now: number): number {
    // Show the last partial second as 00:01; 00:00 means the deadline has passed.
    return Math.max(0, Math.ceil((endTime - now) / 1000));
}

export function updateGameTime(state: GameState, now: number): GameState {
    if (state.status !== 'playing' || state.endTime === undefined) return state;

    const timeLeft = getTimeLeft(state.endTime, now);
    const nextState = timeLeft === state.timeLeft ? state : { ...state, timeLeft };

    return finishGame(nextState);
}
