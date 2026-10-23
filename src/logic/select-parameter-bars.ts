import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import type {
    CauldronParameters,
    ParameterKey,
    ParameterRange,
    ParameterTargets,
} from '@/types/parameters';
import type { ParameterBarsView, ParameterBarView, ParameterStatus } from '@/types/view';

import { calculateCauldron } from './calculate-cauldron';
import { selectCauldron } from './select-cauldron';

const PARAMETER_KEYS: readonly ParameterKey[] = ['temperature', 'density', 'magicPower'];

function getDomain(
    key: ParameterKey,
    catalog: readonly Ingredient[],
    capacity: number,
    target: ParameterRange | undefined,
): ParameterRange {
    const values = catalog.map((ingredient) => ingredient[key]);
    // Worst possible sums: the cauldron full of the lowest / highest ingredient.
    const lowest = Math.min(0, ...values) * capacity;
    const highest = Math.max(0, ...values) * capacity;
    const targetMin = target?.min ?? 0;
    const targetMax = target?.max ?? 0;

    const extent = Math.max(1, -lowest, highest, Math.abs(targetMin), targetMax);
    const canBeNegative = lowest < 0 || targetMin < 0;

    // A symmetric scale keeps 0 in the center whenever the bar can go negative.
    return { min: canBeNegative ? -extent : 0, max: extent };
}

function toPosition(value: number, domain: ParameterRange): number {
    const position = ((value - domain.min) / (domain.max - domain.min)) * 100;
    return Math.min(100, Math.max(0, position));
}

function getStatus(value: number, target: ParameterRange | undefined): ParameterStatus {
    if (!target) return 'inactive';
    if (value < target.min) return 'below';
    return value > target.max ? 'above' : 'in-range';
}

function buildBars(
    values: CauldronParameters,
    targets: ParameterTargets | undefined,
    catalog: readonly Ingredient[],
    capacity: number,
): readonly ParameterBarView[] {
    return PARAMETER_KEYS.map((key) => {
        const value = values[key];
        const target = targets?.[key];
        const domain = getDomain(key, catalog, capacity, target);

        return {
            key,
            value,
            domain,
            target,
            status: getStatus(value, target),
            zeroPosition: toPosition(0, domain),
            valuePosition: toPosition(value, domain),
            targetStart: toPosition(target?.min ?? 0, domain),
            targetEnd: toPosition(target?.max ?? 0, domain),
        };
    });
}

export function selectParameterBars(
    state: GameState,
    catalog: readonly Ingredient[],
): ParameterBarsView {
    const { ingredients, capacity } = selectCauldron(state, catalog);
    const shelfCatalog = catalog.slice(0, DIFFICULTY_RULES[state.difficulty].shelfSize);

    return {
        recipeName: state.activeRecipe?.name,
        bars: buildBars(
            calculateCauldron(ingredients),
            state.activeRecipe?.targets,
            shelfCatalog,
            capacity,
        ),
    };
}
