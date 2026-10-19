import { BaseComponent } from '@/core/base-component';
import { html } from '@/utils/html';
import './header.scss';

export class Header extends BaseComponent<'header'> {
    constructor() {
        super('header', 'header');

        this.setHtml(html`
            <h1 class="header__title">Alchemist's Cauldron</h1>
            <span class="header__divider" aria-hidden="true"></span>
        `);
    }
}
