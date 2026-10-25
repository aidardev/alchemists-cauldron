import type { Difficulty } from './difficulty';
import type { Recipe } from './recipe';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export type ShelfStock = Readonly<Record<string, number>>;

export type BrewOutcome = 'success' | 'failure';

export interface BrewResult {
    readonly outcome: BrewOutcome;
}

export type GameOverReason = 'time-up' | 'no-lives' | 'out-of-ingredients';

export interface GameState {
    readonly difficulty: Difficulty;
    readonly status: GameStatus;
    readonly shelfStock: ShelfStock;
    readonly cauldronIngredientIds: readonly string[];
    readonly activeRecipe: Recipe | undefined;
    readonly score: number;
    readonly timeLeft: number;
    readonly endTime: number | undefined;
    readonly pausedAt: number | undefined;
    readonly gameOverReason: GameOverReason | undefined;
    readonly lives: number;
    readonly lastBrew: BrewResult | undefined;
}
