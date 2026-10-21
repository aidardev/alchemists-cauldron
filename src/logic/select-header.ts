import type { GameState } from '@/types/game';
import type { HeaderView } from '@/types/view';

export function selectHeader(state: GameState): HeaderView {
    return { score: state.score, timeLeft: state.timeLeft, lives: state.lives };
}
