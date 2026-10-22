import { LEVEL_ONE_RULES } from '@/data/game-rules';
import type { GameState } from '@/types/game';
import type { HeaderView } from '@/types/view';

export function selectHeader(state: GameState): HeaderView {
    return {
        score: state.score,
        timeLeft: state.timeLeft,
        lives: state.lives,
        timeProgress: Math.min(
            100,
            Math.max(0, (state.timeLeft / LEVEL_ONE_RULES.startingTime) * 100),
        ),
        isTimeCritical: state.status === 'playing' && state.timeLeft > 0 && state.timeLeft < 15,
    };
}
