import type { GameState } from '@/types/game';
import type { GameSave, GameSaveError } from '@/types/game-save';
import type { ActionBarView } from '@/types/view';
import { canBrew } from './can-brew';
import { canPourOut } from './can-pour-out';
import { POUR_OUT_COST_SECONDS } from './pour-out';

export function selectActionBar(
    state: GameState,
    save?: GameSave,
    saveError?: GameSaveError,
): ActionBarView {
    return {
        showStart: state.status === 'menu' || state.status === 'game-over',
        isRestart: state.status === 'game-over',
        isPaused: state.status === 'paused',
        canBrew: canBrew(state),
        showPourOut: state.status === 'playing',
        canPourOut: canPourOut(state),
        pourOutCost: POUR_OUT_COST_SECONDS,
        canPause: state.status === 'playing',
        saveError,
        continueGame:
            save && state.status === 'menu'
                ? {
                      difficulty: save.difficulty,
                      score: save.score,
                      timeLeft: Math.ceil(save.timeLeft),
                  }
                : undefined,
    };
}
