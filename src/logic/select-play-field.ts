import type { GameState } from '@/types/game';
import type { PlayFieldView } from '@/types/view';

export function selectPlayField(state: GameState): PlayFieldView {
    return { isPaused: state.status === 'paused', lastBrew: state.lastBrew };
}
