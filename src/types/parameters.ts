export interface CauldronParameters {
    readonly temperature: number;
    readonly density: number;
    readonly magicPower: number;
}

export type ParameterKey = keyof CauldronParameters;

export interface ParameterRange {
    readonly min: number;
    readonly max: number;
}

export type ParameterTargets = Readonly<Record<ParameterKey, ParameterRange>>;
