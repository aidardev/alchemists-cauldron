import { BaseComponent } from '@/core/base-component';
import type { PlayFieldView } from '@/types/view';
import { BrewFeedback } from '@/ui/brew-feedback';
import './play-field.scss';

export class PlayField extends BaseComponent<'div'> {
    private readonly feedback: BrewFeedback;

    constructor() {
        super('div', 'play-field');
        this.feedback = new BrewFeedback(
            this.element,
            { failure: 'play-field--failure' },
            this.eventSignal,
        );
    }

    public render({ isPaused, lastBrew }: PlayFieldView): void {
        this.element.inert = isPaused;
        this.element.classList.toggle('play-field--paused', isPaused);
        this.element.setAttribute('aria-hidden', String(isPaused));
        this.feedback.render(lastBrew);
    }
}
