import { BaseComponent } from '@/core/base-component';
import { html } from '@/utils/html';

export class App extends BaseComponent<'main'> {
    constructor() {
        super('main', 'app');

        this.setHtml(html`<h1 class="app__title">Alchemist's Cauldron</h1>`);
    }
}
