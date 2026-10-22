import { BaseComponent } from '@/core/base-component';
import type { CauldronView } from '@/types/view';
import { html } from '@/utils/html';
import { CauldronContents } from './cauldron-contents';
import './cauldron.scss';

export class Cauldron extends BaseComponent<'section'> {
    private readonly contents: CauldronContents;

    constructor() {
        super('section', 'cauldron');

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
            </div>
        `);

        this.contents = this.adopt(new CauldronContents());
        this.element.append(this.contents.element);
    }

    public render(view: CauldronView): void {
        this.contents.render(view);
    }
}
