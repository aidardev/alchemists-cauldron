import { BaseComponent } from '@/core/base-component';
import type { ParameterKey } from '@/types/parameters';
import type { RecipePanelView } from '@/types/view';
import { html } from '@/utils/html';
import './recipe-panel.scss';

export class RecipePanel extends BaseComponent<'section'> {
    private readonly nameLabel: HTMLElement;
    private readonly countLabel: HTMLElement;
    private readonly ranges: Readonly<Record<ParameterKey, HTMLElement>>;

    constructor() {
        super('section', 'recipe-panel');
        this.element.setAttribute('aria-labelledby', 'recipe-title');

        this.setHtml(html`
            <h2 class="recipe-panel__eyebrow" id="recipe-title">Current recipe</h2>
            <h3 class="recipe-panel__name">Awaiting a recipe</h3>
            <svg
                class="recipe-panel__emblem"
                viewBox="0 0 120 100"
                aria-hidden="true"
                focusable="false"
            >
                <circle cx="60" cy="50" r="42"></circle>
                <path
                    d="M45 15h30m-26 0v30L32 69a12 12 0 0 0 10 19h36a12 12 0 0 0 10-19L71 45V15M40 64h40"
                ></path>
                <path d="m59 49 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"></path>
                <circle cx="52" cy="76" r="2"></circle>
                <circle cx="69" cy="73" r="3"></circle>
            </svg>
            <div class="recipe-panel__counter">
                <span>Ingredients</span>
                <strong class="recipe-panel__count">0 / 4</strong>
            </div>
            <dl class="recipe-panel__ranges">
                <div class="recipe-panel__range recipe-panel__range--temperature">
                    <dt>Temperature</dt>
                    <dd data-range="temperature">—</dd>
                </div>
                <div class="recipe-panel__range recipe-panel__range--density">
                    <dt>Density</dt>
                    <dd data-range="density">—</dd>
                </div>
                <div class="recipe-panel__range recipe-panel__range--magic">
                    <dt>Magic Power</dt>
                    <dd data-range="magicPower">—</dd>
                </div>
            </dl>
        `);

        this.nameLabel = this.getElement('.recipe-panel__name');
        this.countLabel = this.getElement('.recipe-panel__count');
        this.ranges = {
            temperature: this.getElement('[data-range="temperature"]'),
            density: this.getElement('[data-range="density"]'),
            magicPower: this.getElement('[data-range="magicPower"]'),
        };
    }

    public render(view: RecipePanelView): void {
        const { recipe, ingredientCount, capacity, isFull } = view;
        this.nameLabel.textContent = recipe?.name ?? 'Your next discovery';
        this.countLabel.textContent = `${ingredientCount} / ${capacity}`;
        this.element.classList.toggle('recipe-panel--full', isFull);

        for (const key of Object.keys(this.ranges) as ParameterKey[]) {
            const range = recipe?.targets[key];
            this.ranges[key].textContent = range ? `${range.min}…${range.max}` : '—';
        }
    }
}
