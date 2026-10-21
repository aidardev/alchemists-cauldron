import type { Recipe } from './recipe';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export type ShelfStock = Readonly<Record<string, number>>;

export type BrewOutcome = 'success' | 'failure';

export interface GameState {
    readonly status: GameStatus;
    readonly shelfStock: ShelfStock;
    readonly cauldronIngredientIds: readonly string[];
    readonly activeRecipe: Recipe | undefined;
    readonly score: number;
    readonly timeLeft: number;
    readonly lives: number;
    readonly lastBrew: BrewOutcome | undefined;
}
