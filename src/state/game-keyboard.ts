import { INGREDIENTS } from '@/data/ingredients';
import { canAddIngredient } from '@/logic/can-add-ingredient';
import { canBrew } from '@/logic/can-brew';
import { canPourOut } from '@/logic/can-pour-out';
import type { GameStore } from './game-store';

const INGREDIENT_KEYS = new Map(
    INGREDIENTS.map((ingredient, index) => [`Digit${index + 1}`, ingredient.id]),
);

const ACTION_KEYS = new Map<string, 'brew' | 'pourOut' | 'pause'>([
    ['KeyB', 'brew'],
    ['KeyX', 'pourOut'],
    ['KeyP', 'pause'],
    ['Escape', 'pause'],
]);

export class GameKeyboard {
    private readonly abortController = new AbortController();
    private readonly store: GameStore;
    private readonly page: Document;

    private handleKeyDown = (event: KeyboardEvent): void => {
        const state = this.store.getState();
        if (
            state.status !== 'playing' ||
            this.page.hidden ||
            event.defaultPrevented ||
            event.repeat ||
            event.isComposing ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey ||
            event.shiftKey
        )
            return;

        const target = event.target;
        if (
            target instanceof HTMLElement &&
            (target.isContentEditable || target.closest('input, textarea, select'))
        )
            return;

        const ingredientId = INGREDIENT_KEYS.get(event.code);
        if (ingredientId) {
            if (!canAddIngredient(state, ingredientId)) return;
            event.preventDefault();
            this.store.addIngredient(ingredientId);
            return;
        }

        const action = ACTION_KEYS.get(event.code);
        if (
            !action ||
            (action === 'brew' && !canBrew(state)) ||
            (action === 'pourOut' && !canPourOut(state))
        )
            return;

        event.preventDefault();
        this.store[action]();
    };

    constructor(store: GameStore, page: Document = document) {
        this.store = store;
        this.page = page;
        this.page.addEventListener('keydown', this.handleKeyDown, {
            signal: this.abortController.signal,
        });
    }

    public destroy(): void {
        this.abortController.abort();
    }
}
