export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyRules {
    readonly shelfSize: number;
    readonly maxCauldronSize: number;
    readonly startTimeSeconds: number;
    readonly tolerance: number;
    readonly lives: number;
    readonly scorePerBrew: number;
    readonly timeBonusSeconds: number;
    readonly reactionCount: number;
}
