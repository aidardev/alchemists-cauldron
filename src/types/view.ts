import type { BrewOutcome, GameOverReason } from './game';
import type { Ingredient } from './ingredient';
import type { ParameterKey, ParameterRange } from './parameters';
import type { Recipe } from './recipe';

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

export interface RecipePanelView {
    readonly recipe: Recipe | undefined;
    readonly ingredientCount: number;
    readonly capacity: number;
    readonly isFull: boolean;
    readonly tolerance: number;
    readonly lastBrew: BrewOutcome | undefined;
    readonly isGameOver: boolean;
}

export interface ActionBarView {
    readonly showStart: boolean;
    readonly isRestart: boolean;
    readonly canBrew: boolean;
}

export interface HeaderView {
    readonly score: number;
    readonly timeLeft: number;
    readonly lives: number;
    readonly timeProgress: number;
    readonly isTimeCritical: boolean;
}

export interface GameOverView {
    readonly isVisible: boolean;
    readonly score: number;
    readonly reason: GameOverReason | undefined;
}
