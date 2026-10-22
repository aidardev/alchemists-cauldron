import type { GameOverReason, GameState } from '@/types/game';

function getGameOverReason(state: GameState): GameOverReason | undefined {
    if (state.timeLeft <= 0) return 'time-up';
    if (state.lives <= 0) return 'no-lives';

    const isShelfEmpty = Object.values(state.shelfStock).every((stock) => stock === 0);
    return isShelfEmpty && state.cauldronIngredientIds.length === 0
        ? 'out-of-ingredients'
        : undefined;
}

export function finishGame(state: GameState): GameState {
    if (state.status !== 'playing') return state;

    const gameOverReason = getGameOverReason(state);

    return gameOverReason
        ? { ...state, status: 'game-over', gameOverReason, endTime: undefined }
        : state;
}
