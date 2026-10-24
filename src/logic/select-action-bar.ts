import type { GameState } from '@/types/game';
import type { GameSave, GameSaveError } from '@/types/game-save';
import type { ActionBarView } from '@/types/view';
import { canBrew } from './can-brew';

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
