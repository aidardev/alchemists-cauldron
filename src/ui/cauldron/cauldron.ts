import { BaseComponent } from '@/core/base-component';
import type { CauldronView } from '@/types/view';
import { BrewFeedback } from '@/ui/brew-feedback';
import { INGREDIENT_DRAG_TYPE } from '@/ui/ingredient-drag';
import { html } from '@/utils/html';
import { CauldronContents } from './cauldron-contents';
import './cauldron-feedback.scss';
import { CauldronIngredients } from './cauldron-ingredients';
import './cauldron.scss';

interface CauldronOptions {
    readonly onAdd: (ingredientId: string) => void;
}

export class Cauldron extends BaseComponent<'section'> {
    private readonly contents: CauldronContents;
    private readonly ingredients: CauldronIngredients;
    private readonly feedback: BrewFeedback;
    private readonly onAdd: CauldronOptions['onAdd'];
    private availableIngredientIds = new Set<string>();

    private handleDragOver = (event: DragEvent): void => {
        const transfer = event.dataTransfer;
        if (
            !transfer?.types.includes(INGREDIENT_DRAG_TYPE) ||
            this.availableIngredientIds.size === 0
        ) {
            if (transfer) transfer.dropEffect = 'none';
            this.clearDragHighlight();
            return;
        }

        event.preventDefault();
        transfer.dropEffect = 'copy';
        this.element.classList.add('cauldron--drag-over');
    };

    private handleDragLeave = (event: DragEvent): void => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && this.element.contains(nextTarget)) return;
        this.clearDragHighlight();
    };

    private handleDrop = (event: DragEvent): void => {
        event.preventDefault();
        this.clearDragHighlight();

        const transfer = event.dataTransfer;
        if (!transfer?.types.includes(INGREDIENT_DRAG_TYPE)) return;
        const ingredientId = transfer.getData(INGREDIENT_DRAG_TYPE);
        if (this.availableIngredientIds.has(ingredientId)) this.onAdd(ingredientId);
    };

    private clearDragHighlight = (): void => {
        this.element.classList.remove('cauldron--drag-over');
    };

    constructor({ onAdd }: CauldronOptions) {
        super('section', 'cauldron');

        this.onAdd = onAdd;
        this.element.setAttribute('aria-label', 'Cauldron');

        this.setHtml(html`
            <div class="cauldron__vessel" aria-hidden="true">
                <div class="cauldron__glow"></div>
                <div class="cauldron__steam"><span></span><span></span><span></span></div>
                <div class="cauldron__pot">
                    <svg class="cauldron__rune" viewBox="0 0 48 48" focusable="false">
                        <circle cx="24" cy="24" r="21" />
                        <path d="M24 9 40 36H8z" />
                        <circle cx="24" cy="28" r="3.5" />
                    </svg>
                </div>
                <div class="cauldron__liquid"><span></span><span></span><span></span></div>
                <div class="cauldron__burst">
                    <span class="cauldron__burst-ring"></span>
                    <span class="cauldron__spark"></span><span class="cauldron__spark"></span>
                    <span class="cauldron__spark"></span><span class="cauldron__spark"></span>
                    <span class="cauldron__spark"></span><span class="cauldron__spark"></span>
                </div>
            </div>
        `);

        const vessel = this.getElement('.cauldron__vessel');
        this.ingredients = this.adopt(new CauldronIngredients());
        vessel.append(this.ingredients.element);
        this.feedback = new BrewFeedback(
            vessel,
            { success: 'cauldron__vessel--success', failure: 'cauldron__vessel--failure' },
            this.eventSignal,
        );
        this.contents = this.adopt(new CauldronContents());
        this.element.append(this.contents.element);

        this.element.addEventListener('dragenter', this.handleDragOver, {
            signal: this.eventSignal,
        });
        this.element.addEventListener('dragover', this.handleDragOver, {
            signal: this.eventSignal,
        });
        this.element.addEventListener('dragleave', this.handleDragLeave, {
            signal: this.eventSignal,
        });
        this.element.addEventListener('drop', this.handleDrop, { signal: this.eventSignal });
        this.element.ownerDocument.addEventListener('dragend', this.clearDragHighlight, {
            signal: this.eventSignal,
        });
    }

    public render(view: CauldronView): void {
        this.availableIngredientIds = new Set(view.availableIngredientIds);
        if (this.availableIngredientIds.size === 0) this.clearDragHighlight();
        this.contents.render(view);
        this.ingredients.render(view.ingredients);
        this.feedback.render(view.lastBrew);
    }
}
