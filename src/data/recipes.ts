import type { Recipe } from '@/types/recipe';

export const INITIAL_RECIPE: Recipe = {
    id: 'acid-spark',
    name: 'Acid Spark',
    targets: {
        temperature: { min: 17, max: 27 },
        density: { min: 18, max: 28 },
        magicPower: { min: 29, max: 39 },
    },
};
