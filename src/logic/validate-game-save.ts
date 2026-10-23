import { DIFFICULTY_RULES } from '@/data/difficulty';
import { INGREDIENTS } from '@/data/ingredients';
import { RECIPES } from '@/data/recipes';
import type { Difficulty } from '@/types/difficulty';
import type { GameSave } from '@/types/game-save';
import type { Ingredient } from '@/types/ingredient';
import { MAX_STOCK } from './create-stock';
import { isDifficulty } from './is-difficulty';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidRecipe(value: unknown, difficulty: Difficulty): boolean {
    if (!isRecord(value) || !isRecord(value.targets)) return false;
    const recipe = RECIPES.find(
        (candidate) => candidate.id === value.id && candidate.difficulty === difficulty,
    );
    if (!recipe || value.name !== recipe.name || value.difficulty !== difficulty) return false;
    const targets = value.targets;
    return Object.entries(recipe.targets).every(([key, range]) => {
        const candidate = targets[key];
        return isRecord(candidate) && candidate.min === range.min && candidate.max === range.max;
    });
}

function isValidStock(
    value: unknown,
    ingredients: readonly Ingredient[],
    cauldronIds: readonly string[],
): boolean {
    if (!isRecord(value) || Object.keys(value).length !== ingredients.length) return false;
    return ingredients.every(({ id }) => {
        const stock = value[id];
        const inCauldron = cauldronIds.filter((ingredientId) => ingredientId === id).length;
        return (
            Object.hasOwn(value, id) &&
            typeof stock === 'number' &&
            Number.isSafeInteger(stock) &&
            stock >= 0 &&
            stock + inCauldron <= MAX_STOCK
        );
    });
}

export function isValidSave(value: unknown): value is GameSave {
    if (!isRecord(value) || !isDifficulty(value.difficulty)) return false;
    const {
        difficulty,
        status,
        score,
        timeLeft,
        lives,
        activeRecipe,
        cauldronIngredientIds,
        shelfStock,
    } = value;
    const rules = DIFFICULTY_RULES[difficulty];
    const ingredients = INGREDIENTS.slice(0, rules.shelfSize);
    const ids = new Set(ingredients.map(({ id }) => id));

    return (
        (status === 'playing' || status === 'paused') &&
        typeof score === 'number' &&
        Number.isSafeInteger(score) &&
        score >= 0 &&
        score % rules.scorePerBrew === 0 &&
        typeof timeLeft === 'number' &&
        Number.isFinite(timeLeft) &&
        timeLeft >= 0.001 &&
        timeLeft <= rules.startTimeSeconds &&
        typeof lives === 'number' &&
        Number.isSafeInteger(lives) &&
        lives > 0 &&
        lives <= rules.lives &&
        isValidRecipe(activeRecipe, difficulty) &&
        Array.isArray(cauldronIngredientIds) &&
        cauldronIngredientIds.length <= rules.maxCauldronSize &&
        cauldronIngredientIds.every((id) => typeof id === 'string' && ids.has(id)) &&
        isValidStock(shelfStock, ingredients, cauldronIngredientIds) &&
        (cauldronIngredientIds.length > 0 ||
            (isRecord(shelfStock) &&
                Object.values(shelfStock).some((stock) => typeof stock === 'number' && stock > 0)))
    );
}
