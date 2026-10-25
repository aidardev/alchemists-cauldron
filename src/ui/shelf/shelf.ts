import { BaseComponent } from '@/core/base-component';
import type { ShelfSlotView } from '@/types/view';
import { IngredientTooltip } from '@/ui/ingredient-tooltip/ingredient-tooltip';
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
    private readonly tooltip: IngredientTooltip;
    private hoveredSlot: ShelfSlot | undefined;
    private focusedSlot: ShelfSlot | undefined;

    private refreshTooltip = (): void => {
        const slot = [this.hoveredSlot, this.focusedSlot].find((item) => item?.canInspect);
        if (slot) this.tooltip.show(slot.button, slot.ingredient, this.list);
        else this.tooltip.hide();
    };

    private clearInspection = (): void => {
        this.hoveredSlot = undefined;
        this.focusedSlot = undefined;
        this.tooltip.hide();
    };

    private handleInspectionChange = (
        slot: ShelfSlot,
        source: 'pointer' | 'focus',
        isActive: boolean,
        nextTarget: EventTarget | undefined,
    ): void => {
        if (
            !isActive &&
            source === 'pointer' &&
            nextTarget instanceof Node &&
            this.tooltip.element.contains(nextTarget)
        )
            return;

        if (source === 'pointer') {
            if (isActive) this.hoveredSlot = slot;
            else if (this.hoveredSlot === slot) this.hoveredSlot = undefined;
        } else if (isActive) this.focusedSlot = slot;
        else if (this.focusedSlot === slot) this.focusedSlot = undefined;
        this.refreshTooltip();
    };

    private handleTooltipLeave = (nextTarget: EventTarget | undefined): void => {
        if (nextTarget instanceof Node && this.hoveredSlot?.element.contains(nextTarget)) return;
        this.hoveredSlot = undefined;
        this.refreshTooltip();
    };

    constructor({ onAdd }: ShelfOptions) {
        super('section', 'shelf');

        this.onAdd = onAdd;
        this.element.setAttribute('aria-labelledby', 'shelf-title');

        this.setHtml(html`
            <h2 class="shelf__title" id="shelf-title">Ingredients</h2>
            <p class="shelf__empty">Start a game to stock the shelf.</p>
            <ul class="shelf__list custom-scrollbar"></ul>
        `);

        this.list = this.getElement('.shelf__list');
        this.emptyMessage = this.getElement('.shelf__empty');
        this.tooltip = this.adopt(
            new IngredientTooltip({ onPointerLeave: this.handleTooltipLeave }),
        );
        this.element.append(this.tooltip.element);
    }

    // Slots are rebuilt only when the set of ingredients changes, never on a stock change.
    private syncSlots(views: readonly ShelfSlotView[]): void {
        const isSameShelf =
            views.length === this.slots.size &&
            views.every(({ ingredient }) => this.slots.has(ingredient.id));

        if (isSameShelf) return;

        this.clearInspection();
        for (const slot of this.slots.values()) {
            this.release(slot);
        }

        this.slots.clear();
        this.list.replaceChildren();

        for (const { ingredient } of views) {
            const slot = this.adopt(
                new ShelfSlot(ingredient, this.onAdd, {
                    onChange: this.handleInspectionChange,
                    onDragStart: this.clearInspection,
                }),
            );
            this.list.append(slot.element);
            this.slots.set(ingredient.id, slot);
        }
    }

    public render(views: readonly ShelfSlotView[]): void {
        this.syncSlots(views);

        for (const view of views) {
            this.slots.get(view.ingredient.id)?.update(view);
        }

        this.emptyMessage.hidden = views.length > 0;
        this.refreshTooltip();
    }

    public override destroy(): void {
        this.clearInspection();
        super.destroy();
    }
}
