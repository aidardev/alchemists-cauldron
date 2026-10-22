import type { Difficulty } from './difficulty';
import type { ParameterTargets } from './parameters';

export interface Recipe {
    readonly id: string;
    readonly name: string;
    readonly difficulty: Difficulty;
    readonly targets: ParameterTargets;
}
