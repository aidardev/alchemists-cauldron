import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { GameState } from '@/types/game';
import type { HeaderView } from '@/types/view';

export function selectHeader(state: GameState): HeaderView {
    return {
        difficulty: state.difficulty,
        score: state.score,
        timeLeft: state.timeLeft,
        lives: state.lives,
        timeProgress: Math.min(
            100,
            Math.max(
                0,
                (state.timeLeft / DIFFICULTY_RULES[state.difficulty].startTimeSeconds) * 100,
            ),
        ),
        isTimeCritical: state.status === 'playing' && state.timeLeft > 0 && state.timeLeft < 15,
    };
}
