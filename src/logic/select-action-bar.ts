import type { GameState } from '@/types/game';
import type { ActionBarView } from '@/types/view';
import { canBrew } from './can-brew';

export function selectActionBar(state: GameState): ActionBarView {
    return {
        showStart: state.status === 'menu' || state.status === 'game-over',
        isRestart: state.status === 'game-over',
        canBrew: canBrew(state),
    };
}
