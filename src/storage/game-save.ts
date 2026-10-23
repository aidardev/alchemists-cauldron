import { isValidSave } from '@/logic/validate-game-save';
import type { GameSave } from '@/types/game-save';

export const GAME_SAVE_KEY = 'alchemists-cauldron:game-save';

export class GameSaveStorage {
    private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

    constructor(getStorage: GameSaveStorage['getStorage'] = () => localStorage) {
        this.getStorage = getStorage;
    }

    public load(): GameSave | undefined {
        try {
            const stored = this.getStorage().getItem(GAME_SAVE_KEY);
            if (stored === null) return undefined;
            let value: unknown;
            try {
                value = JSON.parse(stored);
            } catch {
                this.clear();
                return undefined;
            }
            if (isValidSave(value)) return value;
            this.clear();
        } catch {
            // Storage access itself may be denied; keep the game usable.
        }
        return undefined;
    }

    public save(save: GameSave): boolean {
        if (!isValidSave(save)) return false;
        try {
            this.getStorage().setItem(GAME_SAVE_KEY, JSON.stringify(save));
            return true;
        } catch {
            return false;
        }
    }

    public clear(): boolean {
        try {
            this.getStorage().removeItem(GAME_SAVE_KEY);
            return true;
        } catch {
            return false;
        }
    }
}
