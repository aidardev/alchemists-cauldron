import type { Ingredient } from './ingredient';

export interface ShelfSlotView {
    readonly ingredient: Ingredient;
    readonly stock: number;
    readonly disabled: boolean;
}

export interface CauldronView {
    readonly ingredients: readonly Ingredient[];
    readonly capacity: number;
}
