import type { Difficulty } from './difficulty';
import type { BrewOutcome, GameOverReason } from './game';
import type { GameSaveError } from './game-save';
import type { Ingredient } from './ingredient';
import type { LeaderboardEntry } from './leaderboard';
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
    readonly bars: readonly ParameterBarView[];
}

export interface RecipePanelView {
    readonly recipe: Recipe | undefined;
    readonly ingredientCount: number;
    readonly capacity: number;
    readonly isFull: boolean;
    readonly lastBrew: BrewOutcome | undefined;
    readonly isGameOver: boolean;
}

export interface ActionBarView {
    readonly showStart: boolean;
    readonly isRestart: boolean;
    readonly isPaused: boolean;
    readonly canBrew: boolean;
    readonly canPause: boolean;
    readonly continueGame: ContinueGameView | undefined;
    readonly saveError: GameSaveError | undefined;
}

export interface ContinueGameView {
    readonly difficulty: Difficulty;
    readonly score: number;
    readonly timeLeft: number;
}

export interface HeaderView {
    readonly difficulty: Difficulty;
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

export interface PauseDialogView {
    readonly isVisible: boolean;
    readonly score: number;
    readonly timeLeft: number;
}

export interface PlayFieldView {
    readonly isPaused: boolean;
}

export interface SettingsView {
    readonly difficulty: Difficulty;
    readonly canChange: boolean;
}

export interface LeaderboardView {
    readonly difficulty: Difficulty;
    readonly entries: readonly LeaderboardEntry[];
    readonly message: string;
}
