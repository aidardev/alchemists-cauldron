import type { GameState } from '@/types/game';
import type { GameOverView } from '@/types/view';

export function selectGameOver(state: GameState): GameOverView {
    return {
        isVisible: state.status === 'game-over',
        score: state.score,
        reason: state.gameOverReason,
    };
}
