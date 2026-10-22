import { BaseComponent } from '@/core/base-component';
import type { PlayFieldView } from '@/types/view';
import './play-field.scss';

export class PlayField extends BaseComponent<'div'> {
    constructor() {
        super('div', 'play-field');
    }

    public render({ isPaused }: PlayFieldView): void {
        this.element.inert = isPaused;
        this.element.classList.toggle('play-field--paused', isPaused);
        this.element.setAttribute('aria-hidden', String(isPaused));
    }
}
