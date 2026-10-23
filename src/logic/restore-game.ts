import type { GameState } from '@/types/game';
import type { GameSave } from '@/types/game-save';
import { createInitialState } from './create-initial-state';
import { getTimeLeft } from './game-time';

export function restoreGame(save: GameSave, now: number): GameState {
    const endTime = now + Math.round(save.timeLeft * 1000);
    return {
        ...createInitialState(save.difficulty),
        status: 'paused',
        score: save.score,
        lives: save.lives,
        activeRecipe: save.activeRecipe,
        cauldronIngredientIds: [...save.cauldronIngredientIds],
        shelfStock: { ...save.shelfStock },
        timeLeft: getTimeLeft(endTime, now),
        endTime,
        pausedAt: now,
    };
}
