import type { GameState } from '@/types/game';

export function resumeGame(state: GameState, now: number): GameState {
    if (state.status !== 'paused' || state.pausedAt === undefined || state.endTime === undefined) {
        return state;
    }

    // Shift the exact deadline by the pause duration; rounded seconds are only for display.
    const endTime = state.endTime + (now - state.pausedAt);

    return { ...state, status: 'playing', endTime, pausedAt: undefined };
}
