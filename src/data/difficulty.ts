import type { Difficulty, DifficultyRules } from '@/types/difficulty';

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_LABELS: Readonly<Record<Difficulty, string>> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
};

export const DIFFICULTY_RULES: Readonly<Record<Difficulty, DifficultyRules>> = {
    easy: {
        shelfSize: 4,
        maxCauldronSize: 4,
        startTimeSeconds: 180,
        tolerance: 12,
        lives: 5,
        scorePerBrew: 100,
        timeBonusSeconds: 15,
        reactionCount: 0,
    },
    medium: {
        shelfSize: 6,
        maxCauldronSize: 4,
        startTimeSeconds: 150,
        tolerance: 8,
        lives: 3,
        scorePerBrew: 200,
        timeBonusSeconds: 10,
        reactionCount: 2,
    },
    hard: {
        shelfSize: 8,
        maxCauldronSize: 5,
        startTimeSeconds: 150,
        tolerance: 5,
        lives: 3,
        scorePerBrew: 300,
        timeBonusSeconds: 5,
        reactionCount: 3,
    },
};
