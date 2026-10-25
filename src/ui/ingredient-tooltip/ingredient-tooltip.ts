import { BaseComponent } from '@/core/base-component';
import type { Ingredient } from '@/types/ingredient';
import { ingredientStats } from '@/ui/shelf/ingredient-stats';
import { html } from '@/utils/html';
import './ingredient-tooltip.scss';
import { positionTooltip } from './position-tooltip';

interface IngredientTooltipOptions {
    readonly onPointerLeave: (nextTarget: EventTarget | undefined) => void;
}

export class IngredientTooltip extends BaseComponent<'div'> {
    private readonly media: MediaQueryList;
    private readonly view: Window;
    private anchor: HTMLElement | undefined;
    private boundary: HTMLElement | undefined;
    private previousDescription: string | undefined;

    private reposition = (): void => {
        if (!this.anchor || !this.boundary) return;
        if (!this.media.matches || !this.anchor.isConnected) {
            this.hide();
            return;
        }

        const anchor = this.anchor.getBoundingClientRect();
        const boundary = this.boundary.getBoundingClientRect();
        const width = this.element.ownerDocument.documentElement.clientWidth;
        const height = this.view.innerHeight;
        const visibleWidth =
            Math.min(anchor.right, boundary.right, width) - Math.max(anchor.left, boundary.left, 0);
        const visibleHeight =
            Math.min(anchor.bottom, boundary.bottom, height) -
            Math.max(anchor.top, boundary.top, 0);
        if (visibleWidth <= 0 || visibleHeight <= 0) {
            this.hide();
            return;
        }

        const position = positionTooltip(anchor, this.element.getBoundingClientRect(), {
            width,
            height,
        });
        this.element.style.left = `${position.left}px`;
        this.element.style.top = `${position.top}px`;
    };

    constructor({ onPointerLeave }: IngredientTooltipOptions) {
        super('div', 'ingredient-tooltip');
        this.element.id = 'ingredient-tooltip';
        this.element.setAttribute('role', 'tooltip');
        this.element.setAttribute('popover', 'manual');
        const view = this.element.ownerDocument.defaultView;
        if (!view) throw new Error('Ingredient tooltip requires a browser window.');
        this.view = view;
        this.media = view.matchMedia('(hover: hover) and (pointer: fine)');
        this.media.addEventListener('change', () => this.hide(), { signal: this.eventSignal });
        this.element.addEventListener(
            'pointerleave',
            (event) => onPointerLeave(event.relatedTarget ?? undefined),
            {
                signal: this.eventSignal,
            },
        );
        this.element.ownerDocument.addEventListener('scroll', this.reposition, {
            capture: true,
            signal: this.eventSignal,
        });
        view.addEventListener('resize', this.reposition, { signal: this.eventSignal });
    }

    public show(anchor: HTMLElement, ingredient: Ingredient, boundary: HTMLElement): void {
        if (!this.media.matches || !anchor.isConnected) {
            this.hide();
            return;
        }
        if (this.anchor === anchor) return;

        this.hide();
        this.anchor = anchor;
        this.boundary = boundary;
        this.previousDescription = anchor.getAttribute('aria-describedby') ?? undefined;
        this.setHtml(html`
            <div class="ingredient-tooltip__surface">${ingredientStats(ingredient, true)}</div>
        `);
        this.element.showPopover();
        anchor.setAttribute('aria-describedby', this.element.id);
        this.reposition();
    }

    public hide(): void {
        if (this.anchor) {
            this.anchor.toggleAttribute('aria-describedby', this.previousDescription !== undefined);
            if (this.previousDescription !== undefined) {
                this.anchor.setAttribute('aria-describedby', this.previousDescription);
            }
        }
        this.anchor = undefined;
        this.boundary = undefined;
        this.previousDescription = undefined;
        if (this.element.matches(':popover-open')) this.element.hidePopover();
    }

    public override destroy(): void {
        this.hide();
        super.destroy();
    }
}
