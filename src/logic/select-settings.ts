import type { GameState } from '@/types/game';
import type { SettingsView } from '@/types/view';

export function selectSettings(state: GameState): SettingsView {
    return { difficulty: state.difficulty, canChange: state.status === 'menu' };
}
