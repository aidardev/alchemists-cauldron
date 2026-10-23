import { brewPotion } from '@/logic/brew-potion';
import { createGameSave } from '@/logic/create-game-save';
import { createInitialState } from '@/logic/create-initial-state';
import { exitToMenu } from '@/logic/exit-to-menu';
import { updateGameTime } from '@/logic/game-time';
import { pauseGame } from '@/logic/pause-game';
import { restoreGame } from '@/logic/restore-game';
import { resumeGame } from '@/logic/resume-game';
import { setDifficulty } from '@/logic/set-difficulty';
import { startGame } from '@/logic/start-game';
import { GameSaveStorage } from '@/storage/game-save';
import type { Difficulty } from '@/types/difficulty';
import type { GameSave, GameSaveError } from '@/types/game-save';
import { addIngredient } from '../logic/add-ingredient';
import type { GameState } from '../types/game';

type GameListener = (state: GameState) => void;

export class GameStore {
    private state: GameState = createInitialState();

    private readonly listeners = new Set<GameListener>();

    private readonly random: () => number;
    private readonly now: () => number;
    private readonly saveStorage: GameSaveStorage;
    private savedGame: GameSave | undefined;
    private saveError: GameSaveError | undefined;

    constructor(
        random: () => number = Math.random,
        now: () => number = Date.now,
        saveStorage: GameSaveStorage = new GameSaveStorage(),
    ) {
        this.random = random;
        this.now = now;
        this.saveStorage = saveStorage;
        this.savedGame = saveStorage.load();
    }

    private setState(nextState: GameState): void {
        if (nextState === this.state) {
            return;
        }

        const previous = this.state;
        this.state = nextState;
        if (nextState.status === 'menu' && previous.status !== 'menu') this.clearSavedGame();
        else this.persistGame();

        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

    private clearSavedGame(): void {
        this.savedGame = undefined;
        this.saveError = this.saveStorage.clear() ? undefined : 'clear';
    }

    private persistGame(): void {
        if (this.state.status === 'menu') return;
        const save = createGameSave(this.state, this.now());
        if (save) {
            this.savedGame = save;
            this.saveError = this.saveStorage.save(save) ? undefined : 'save';
        } else {
            this.clearSavedGame();
        }
    }

    public getState(): GameState {
        return this.state;
    }

    public getSavedGame(): GameSave | undefined {
        return this.savedGame;
    }

    public getSaveError(): GameSaveError | undefined {
        return this.saveError;
    }

    public continueGame(): void {
        if (this.state.status !== 'menu' || !this.savedGame) return;
        this.setState(restoreGame(this.savedGame, this.now()));
    }

    public saveGame(): void {
        const current = updateGameTime(this.state, this.now());
        if (current === this.state) this.persistGame();
        else this.setState(current);
    }

    public subscribe(listener: GameListener): () => void {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    public startGame(): void {
        this.setState(startGame(this.state.difficulty, undefined, this.random, this.now()));
    }

    public setDifficulty(difficulty: Difficulty): void {
        this.setState(setDifficulty(this.state, difficulty));
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

    public pause(): void {
        this.setState(pauseGame(this.state, this.now()));
    }

    public resume(): void {
        this.setState(resumeGame(this.state, this.now()));
    }

    public exitToMenu(): void {
        this.setState(exitToMenu(this.state));
    }
}
