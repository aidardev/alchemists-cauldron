import { RECIPES } from '@/data/recipes';
import type { Difficulty, Recipe } from '@/types/recipe';

export function getRecipesByDifficulty(difficulty: Difficulty): readonly Recipe[] {
    return RECIPES.filter((recipe) => recipe.difficulty === difficulty);
}

export function pickRecipe(difficulty: Difficulty, random: () => number = Math.random): Recipe {
    const recipes = getRecipesByDifficulty(difficulty);
    const recipe = recipes[Math.floor(random() * recipes.length)];

    if (!recipe) throw new Error(`No recipe available for difficulty: ${difficulty}`);

    return recipe;
}
