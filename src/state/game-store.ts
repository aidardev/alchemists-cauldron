import { brewPotion } from '@/logic/brew-potion';
import { createInitialState } from '@/logic/create-initial-state';
import { startGame } from '@/logic/start-game';
import { addIngredient } from '../logic/add-ingredient';
import type { GameState } from '../types/game';

type GameListener = (state: GameState) => void;

export class GameStore {
    private state: GameState = createInitialState();

    private readonly listeners = new Set<GameListener>();

    private readonly random: () => number;

    constructor(random: () => number = Math.random) {
        this.random = random;
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
        this.setState(startGame(undefined, this.random));
    }

    public addIngredient(id: string): void {
        this.setState(addIngredient(this.state, id));
    }

    public brew(): void {
        this.setState(brewPotion(this.state, undefined, this.random));
    }
}
