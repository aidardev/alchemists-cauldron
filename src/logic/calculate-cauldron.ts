import type { Ingredient } from '@/types/ingredient';
import type { CauldronParameters } from '@/types/parameters';

export function calculateCauldron(ingredients: readonly Ingredient[]): CauldronParameters {
    let temperature = 0;
    let density = 0;
    let magicPower = 0;

    for (const ingredient of ingredients) {
        temperature += ingredient.temperature;
        density += ingredient.density;
        magicPower += ingredient.magicPower;
    }

    return { temperature, density, magicPower };
}
