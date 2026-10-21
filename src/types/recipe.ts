import type { ParameterTargets } from './parameters';

export interface Recipe {
    readonly id: string;
    readonly name: string;
    readonly targets: ParameterTargets;
}
