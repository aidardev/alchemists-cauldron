import type { SafeHtml } from '../utils/html';

export abstract class BaseComponent<
    K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> {
    private readonly childComponents = new Set<BaseComponent>();
    private readonly abortController = new AbortController();

    public readonly element: HTMLElementTagNameMap[K];

    constructor(tagName: K, className?: string) {
        this.element = document.createElement(tagName);

        if (className) {
            this.element.className = className;
        }
    }

    protected setHtml(template: SafeHtml): void {
        this.element.innerHTML = template.value;
    }

    protected adopt<C extends BaseComponent>(child: C): C {
        this.childComponents.add(child);
        return child;
    }

    protected release(child: BaseComponent): void {
        if (this.childComponents.delete(child)) child.destroy();
    }

    protected get eventSignal(): AbortSignal {
        return this.abortController.signal;
    }

    protected query<E extends HTMLElement>(selector: string): E | undefined {
        return this.element.querySelector<E>(selector) ?? undefined;
    }

    protected getElement<E extends HTMLElement>(selector: string): E {
        const element = this.query<E>(selector);

        if (!element) throw new Error(`Element not found: ${selector}`);

        return element;
    }

    public destroy(): void {
        this.abortController.abort();

        for (const child of this.childComponents) {
            child.destroy();
        }

        this.childComponents.clear();
        this.element.remove();
    }
}
