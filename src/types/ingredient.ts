import type { CauldronParameters } from './parameters';

export interface Ingredient extends CauldronParameters {
    readonly id: string;
    readonly name: string;
}
