import type { GameState } from '@/types/game';
import { canPourOut } from './can-pour-out';
import { finishGame } from './finish-game';
import { getTimeLeft, updateGameTime } from './game-time';

export const POUR_OUT_COST_SECONDS = 10;

export function pourOut(state: GameState, now: number = Date.now()): GameState {
    const current = updateGameTime(state, now);
    if (!canPourOut(current) || current.endTime === undefined) return current;

    const endTime = current.endTime - POUR_OUT_COST_SECONDS * 1000;

    return finishGame({
        ...current,
        cauldronIngredientIds: [],
        endTime,
        timeLeft: getTimeLeft(endTime, now),
    });
}
