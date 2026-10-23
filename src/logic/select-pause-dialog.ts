import type { GameState } from '@/types/game';
import type { PauseDialogView } from '@/types/view';

export function selectPauseDialog(state: GameState, isMenuOpen = false): PauseDialogView {
    return {
        isVisible: state.status === 'paused' && !isMenuOpen,
        score: state.score,
        timeLeft: state.timeLeft,
    };
}
