import { BaseComponent } from '@/core/base-component';
import { html, type SafeHtml } from '@/utils/html';
import './icon-button.scss';

interface IconButtonOptions {
    readonly label: string;
    readonly icon: SafeHtml;
    readonly controls: string;
    readonly onClick: () => void;
}

export class IconButton extends BaseComponent<'button'> {
    constructor({ label, icon, controls, onClick }: IconButtonOptions) {
        super('button', 'icon-button');
        this.element.type = 'button';
        this.element.setAttribute('aria-label', label);
        this.element.setAttribute('aria-haspopup', 'dialog');
        this.element.setAttribute('aria-controls', controls);
        this.setHtml(html`
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg>
            <span class="icon-button__tooltip" aria-hidden="true">${label}</span>
        `);
        this.element.addEventListener('click', onClick, { signal: this.eventSignal });
    }
}
