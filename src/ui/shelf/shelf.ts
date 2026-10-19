import { BaseComponent } from '@/core/base-component';
import type { ShelfSlotView } from '@/types/view';
import { html } from '@/utils/html';
import { ShelfSlot } from './shelf-slot';
import './shelf.scss';

interface ShelfOptions {
    readonly onAdd: (ingredientId: string) => void;
}

export class Shelf extends BaseComponent<'section'> {
    private readonly slots = new Map<string, ShelfSlot>();
    private readonly list: HTMLElement;
    private readonly emptyMessage: HTMLElement;
    private readonly onAdd: ShelfOptions['onAdd'];

    constructor({ onAdd }: ShelfOptions) {
        super('section', 'shelf');

        this.onAdd = onAdd;
        this.element.setAttribute('aria-labelledby', 'shelf-title');

        this.setHtml(html`
            <h2 class="shelf__title" id="shelf-title">Ingredients</h2>
            <p class="shelf__empty">Start a game to stock the shelf.</p>
            <ul class="shelf__list"></ul>
        `);

        this.list = this.getElement('.shelf__list');
        this.emptyMessage = this.getElement('.shelf__empty');
    }

    // Slots are rebuilt only when the set of ingredients changes, never on a stock change.
    private syncSlots(views: readonly ShelfSlotView[]): void {
        const isSameShelf =
            views.length === this.slots.size &&
            views.every(({ ingredient }) => this.slots.has(ingredient.id));

        if (isSameShelf) return;

        for (const slot of this.slots.values()) {
            this.release(slot);
        }

        this.slots.clear();
        this.list.replaceChildren();

        for (const { ingredient } of views) {
            const slot = this.adopt(new ShelfSlot(ingredient, this.onAdd));
            const item = document.createElement('li');

            item.className = 'shelf__item';
            item.append(slot.element);
            this.list.append(item);
            this.slots.set(ingredient.id, slot);
        }
    }

    public render(views: readonly ShelfSlotView[]): void {
        this.syncSlots(views);

        for (const view of views) {
            this.slots.get(view.ingredient.id)?.update(view);
        }

        this.emptyMessage.hidden = views.length > 0;
    }
}
