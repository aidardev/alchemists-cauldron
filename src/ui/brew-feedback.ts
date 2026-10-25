import type { BrewOutcome, BrewResult } from '@/types/game';

export class BrewFeedback {
    private readonly element: HTMLElement;
    private readonly classes: Readonly<Partial<Record<BrewOutcome, string>>>;
    private lastBrew: BrewResult | undefined;

    constructor(
        element: HTMLElement,
        classes: Readonly<Partial<Record<BrewOutcome, string>>>,
        signal: AbortSignal,
    ) {
        this.element = element;
        this.classes = classes;
        element.addEventListener(
            'animationend',
            (event) => {
                if (event.target === element) this.clear();
            },
            { signal },
        );
    }

    private clear(): void {
        for (const className of Object.values(this.classes)) {
            this.element.classList.remove(className);
        }
    }

    public render(result: BrewResult | undefined): void {
        if (result === this.lastBrew) return;
        this.lastBrew = result;

        const wasAnimating = Object.values(this.classes).some((className) =>
            this.element.classList.contains(className),
        );
        this.clear();
        const className = result && this.classes[result.outcome];
        if (!className) return;

        if (wasAnimating) void this.element.offsetWidth;
        this.element.classList.add(className);
    }
}
