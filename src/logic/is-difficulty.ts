import { DIFFICULTY_RULES } from '@/data/difficulty';
import type { Difficulty } from '@/types/difficulty';

export function isDifficulty(value: unknown): value is Difficulty {
    return typeof value === 'string' && Object.hasOwn(DIFFICULTY_RULES, value);
}
