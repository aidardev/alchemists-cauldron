import { brewPotion } from '@/logic/brew-potion';
import { createInitialState } from '@/logic/create-initial-state';
import { updateGameTime } from '@/logic/game-time';
import { startGame } from '@/logic/start-game';
import { addIngredient } from '../logic/add-ingredient';
import type { GameState } from '../types/game';

type GameListener = (state: GameState) => void;

export class GameStore {
    private state: GameState = createInitialState();

    private readonly listeners = new Set<GameListener>();

    private readonly random: () => number;
    private readonly now: () => number;

    constructor(random: () => number = Math.random, now: () => number = Date.now) {
        this.random = random;
        this.now = now;
    }

    private setState(nextState: GameState): void {
        if (nextState === this.state) {
            return;
        }

        this.state = nextState;

        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

    public getState(): GameState {
        return this.state;
    }

    public subscribe(listener: GameListener): () => void {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    public startGame(): void {
        this.setState(startGame(undefined, this.random, this.now()));
    }

    public addIngredient(id: string): void {
        const current = updateGameTime(this.state, this.now());
        this.setState(addIngredient(current, id));
    }

    public brew(): void {
        this.setState(brewPotion(this.state, undefined, this.random, this.now()));
    }

    public tick(): void {
        this.setState(updateGameTime(this.state, this.now()));
    }
}
