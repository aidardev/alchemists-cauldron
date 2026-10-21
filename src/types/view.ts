import type { Ingredient } from './ingredient';
import type { ParameterKey, ParameterRange } from './parameters';

export interface ShelfSlotView {
    readonly ingredient: Ingredient;
    readonly stock: number;
    readonly disabled: boolean;
}

export type ParameterStatus = 'inactive' | 'below' | 'above' | 'in-range';

export interface ParameterBarView {
    readonly key: ParameterKey;
    readonly value: number;
    readonly domain: ParameterRange;
    readonly target: ParameterRange | undefined;
    readonly status: ParameterStatus;
    readonly zeroPosition: number;
    readonly valuePosition: number;
    readonly targetStart: number;
    readonly targetEnd: number;
}

export interface CauldronView {
    readonly ingredients: readonly Ingredient[];
    readonly capacity: number;
}

export interface ParameterBarsView {
    readonly recipeName: string | undefined;
    readonly bars: readonly ParameterBarView[];
}
