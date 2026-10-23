import type { Difficulty } from './difficulty';
import type { GameStatus, ShelfStock } from './game';
import type { Recipe } from './recipe';

export type GameSaveError = 'save' | 'clear';

export interface GameSave {
    readonly difficulty: Difficulty;
    readonly status: Extract<GameStatus, 'playing' | 'paused'>;
    readonly score: number;
    readonly timeLeft: number;
    readonly lives: number;
    readonly activeRecipe: Recipe;
    readonly cauldronIngredientIds: readonly string[];
    readonly shelfStock: ShelfStock;
}
