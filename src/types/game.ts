export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export type ShelfStock = Record<string, number>;

export interface GameState {
    readonly status: GameStatus;
    readonly shelfStock: ShelfStock;
    readonly cauldronIngredientIds: readonly string[];
}
