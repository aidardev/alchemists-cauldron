import type { GameState } from '@/types/game';
import type { PauseDialogView } from '@/types/view';

export function selectPauseDialog(state: GameState): PauseDialogView {
    return {
        isVisible: state.status === 'paused',
        score: state.score,
        timeLeft: state.timeLeft,
    };
}
