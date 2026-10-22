import type { CauldronParameters, ParameterRange, ParameterTargets } from '@/types/parameters';

function isInRange(value: number, range: ParameterRange, tolerance: number): boolean {
    return value >= range.min - tolerance && value <= range.max + tolerance;
}

export function isBrewSuccessful(
    values: CauldronParameters,
    targets: ParameterTargets,
    tolerance: number,
): boolean {
    return (
        isInRange(values.temperature, targets.temperature, tolerance) &&
        isInRange(values.density, targets.density, tolerance) &&
        isInRange(values.magicPower, targets.magicPower, tolerance)
    );
}
