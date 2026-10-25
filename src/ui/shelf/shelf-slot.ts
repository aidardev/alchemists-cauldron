import { BaseComponent } from '@/core/base-component';
import type { Ingredient } from '@/types/ingredient';
import type { ShelfSlotView } from '@/types/view';
import { INGREDIENT_DRAG_TYPE } from '@/ui/ingredient-drag';
import { html } from '@/utils/html';
import { ingredientIcon } from '../ingredient-icon/ingredient-icon';
import { ingredientStats } from './ingredient-stats';
import './shelf-slot.scss';

interface ShelfSlotInspection {
    readonly onChange: (
        slot: ShelfSlot,
        source: 'pointer' | 'focus',
        isActive: boolean,
        nextTarget: EventTarget | undefined,
    ) => void;
    readonly onDragStart: () => void;
}

export class ShelfSlot extends BaseComponent<'li'> {
    private readonly icon: HTMLElement;
    private readonly stockBadge: HTMLElement;
    private readonly inspection: ShelfSlotInspection | undefined;
    private inspectable = false;

    private handleDragStart = (event: DragEvent): void => {
        if (this.button.disabled || !this.button.draggable || !event.dataTransfer) {
            event.preventDefault();
            return;
        }

        event.dataTransfer.setData(INGREDIENT_DRAG_TYPE, this.ingredient.id);
        event.dataTransfer.effectAllowed = 'copy';
        this.button.classList.add('shelf-slot--dragging');
        this.inspection?.onDragStart();
    };

    private handleDragEnd = (): void => {
        this.button.classList.remove('shelf-slot--dragging');
    };

    public readonly button: HTMLButtonElement;
    public readonly ingredient: Ingredient;

    constructor(
        ingredient: Ingredient,
        onSelect: (ingredientId: string) => void,
        inspection?: ShelfSlotInspection,
    ) {
        super('li', 'shelf__item');

        this.ingredient = ingredient;
        this.inspection = inspection;

        this.setHtml(html`
            <button class="shelf-slot" type="button">
                <span class="shelf-slot__icon">${ingredientIcon(ingredient.id)}</span>
                <span class="shelf-slot__name">${ingredient.name}</span>
                ${ingredientStats(ingredient)}
                <span class="shelf-slot__stock"></span>
            </button>
        `);

        this.button = this.getElement<HTMLButtonElement>('.shelf-slot');
        this.icon = this.getElement('.ingredient-icon');
        this.stockBadge = this.getElement('.shelf-slot__stock');
        const stats = this.getElement('.shelf-slot__stats');
        stats.id = `ingredient-stats-${ingredient.id}`;
        this.button.setAttribute('aria-describedby', stats.id);

        this.button.addEventListener('click', () => onSelect(ingredient.id), {
            signal: this.eventSignal,
        });
        this.button.addEventListener('dragstart', this.handleDragStart, {
            signal: this.eventSignal,
        });
        this.button.addEventListener('dragend', this.handleDragEnd, {
            signal: this.eventSignal,
        });
        for (const [type, source, isActive] of [
            ['pointerenter', 'pointer', true],
            ['pointerleave', 'pointer', false],
            ['focusin', 'focus', true],
            ['focusout', 'focus', false],
        ] as const) {
            this.element.addEventListener(
                type,
                (event) => {
                    const nextTarget = event.relatedTarget ?? undefined;
                    if (nextTarget instanceof Node && this.element.contains(nextTarget)) return;
                    this.inspection?.onChange(this, source, isActive, nextTarget);
                },
                { signal: this.eventSignal },
            );
        }
    }

    public get canInspect(): boolean {
        return this.inspectable;
    }

    public update({ stock, disabled, canInspect }: ShelfSlotView): void {
        const isEmpty = stock === 0;
        const wasInspectable = this.inspectable;
        this.inspectable = canInspect;

        this.stockBadge.textContent = String(stock);
        this.button.disabled = disabled;
        this.button.draggable = !disabled;
        if (disabled) this.handleDragEnd();
        this.button.classList.toggle('shelf-slot--empty', isEmpty);
        this.icon.hidden = isEmpty;
        this.button.setAttribute('aria-label', `${this.ingredient.name}. ${stock} left`);
        if (!wasInspectable || canInspect) return;
        this.inspection?.onChange(this, 'pointer', false, undefined);
        this.inspection?.onChange(this, 'focus', false, undefined);
    }
}
