import { BaseComponent } from '@/core/base-component';
import type { ParameterKey } from '@/types/parameters';
import type { ParameterBarsView } from '@/types/view';
import { html } from '@/utils/html';
import { ParameterBar } from './parameter-bar';
import './parameter-bars.scss';

export class ParameterBars extends BaseComponent<'section'> {
    private readonly bars = new Map<ParameterKey, ParameterBar>();
    private readonly list: HTMLElement;
    private readonly recipeLabel: HTMLElement;

    constructor() {
        super('section', 'parameter-bars');
        this.element.setAttribute('aria-labelledby', 'parameter-bars-title');

        this.setHtml(html`
            <div class="parameter-bars__heading">
                <h2 id="parameter-bars-title" class="parameter-bars__title">Cauldron parameters</h2>
                <p class="parameter-bars__recipe"></p>
            </div>
            <div class="parameter-bars__list"></div>
        `);

        this.list = this.getElement('.parameter-bars__list');
        this.recipeLabel = this.getElement('.parameter-bars__recipe');
    }

    public render({ recipeName, bars }: ParameterBarsView): void {
        this.recipeLabel.textContent = recipeName ? `Recipe · ${recipeName}` : 'Awaiting recipe';

        for (const view of bars) {
            let bar = this.bars.get(view.key);

            if (!bar) {
                bar = this.adopt(new ParameterBar(view.key));
                this.bars.set(view.key, bar);
                this.list.append(bar.element);
            }

            bar.render(view);
        }
    }
}
