import { BaseComponent } from '@/core/base-component';
import type { ParameterKey } from '@/types/parameters';
import type { ParameterBarView, ParameterStatus } from '@/types/view';
import { html, type SafeHtml } from '@/utils/html';

const LABELS: Readonly<Record<ParameterKey, string>> = {
    temperature: 'Temperature',
    density: 'Density',
    magicPower: 'Magic Power',
};

const STATUS_LABELS: Readonly<Record<ParameterStatus, string>> = {
    inactive: 'No active recipe',
    below: 'Below target',
    above: 'Above target',
    'in-range': 'In range',
};

const ICONS: Readonly<Record<ParameterKey, SafeHtml>> = {
    temperature: html`<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z"></path>
        <path d="M12 9v9m5-12h2m-2 4h2"></path><circle cx="12" cy="18" r="1"></circle>`,
    density: html`<path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"></path>
        <path d="M8 15a4 4 0 0 0 4 4"></path>`,
    magicPower: html`<circle cx="12" cy="12" r="9"></circle
        ><path d="m12 5 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"></path>`,
};

export class ParameterBar extends BaseComponent<'article'> {
    private readonly valueLabel: HTMLElement;
    private readonly meter: HTMLElement;
    private readonly targetZone: HTMLElement;
    private readonly minLabel: HTMLElement;
    private readonly maxLabel: HTMLElement;
    private readonly zeroLabel: HTMLElement;

    constructor(key: ParameterKey) {
        super('article', `parameter-bar parameter-bar--${key}`);

        this.setHtml(html`
            <div class="parameter-bar__header">
                <h3 class="parameter-bar__title">
                    <span class="parameter-bar__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">${ICONS[key]}</svg>
                    </span>
                    ${LABELS[key]}
                </h3>
                <span class="parameter-bar__value">0</span>
            </div>
            <div class="parameter-bar__meter" role="meter" aria-label="${LABELS[key]}">
                <div class="parameter-bar__track" aria-hidden="true">
                    <span class="parameter-bar__fill"></span>
                </div>
                <span class="parameter-bar__target" aria-hidden="true"></span>
                <span class="parameter-bar__zero" aria-hidden="true"></span>
                <span class="parameter-bar__marker" aria-hidden="true"></span>
            </div>
            <div class="parameter-bar__scale" aria-hidden="true">
                <span data-scale="min"></span>
                <span class="parameter-bar__scale-zero">0</span>
                <span data-scale="max"></span>
            </div>
        `);

        this.valueLabel = this.getElement('.parameter-bar__value');
        this.meter = this.getElement('.parameter-bar__meter');
        this.targetZone = this.getElement('.parameter-bar__target');
        this.minLabel = this.getElement('[data-scale="min"]');
        this.maxLabel = this.getElement('[data-scale="max"]');
        this.zeroLabel = this.getElement('.parameter-bar__scale-zero');
    }

    public render(view: ParameterBarView): void {
        const { value, domain, target, status, valuePosition, zeroPosition } = view;
        const targetText = target ? `Target ${target.min}…${target.max}` : 'Target —';

        this.valueLabel.textContent = String(value);
        this.element.classList.toggle('parameter-bar--in-range', status === 'in-range');
        this.element.classList.toggle('parameter-bar--inactive', status === 'inactive');
        this.targetZone.hidden = !target;
        this.zeroLabel.hidden = domain.min === 0;
        this.minLabel.textContent = String(domain.min);
        this.maxLabel.textContent = String(domain.max);

        this.meter.setAttribute('aria-valuemin', String(domain.min));
        this.meter.setAttribute('aria-valuemax', String(domain.max));
        this.meter.setAttribute('aria-valuenow', String(value));
        this.meter.setAttribute(
            'aria-valuetext',
            `${value}. ${targetText}. ${STATUS_LABELS[status]}`,
        );

        const properties = {
            '--value-position': valuePosition,
            '--zero-position': zeroPosition,
            '--fill-start': Math.min(zeroPosition, valuePosition),
            '--fill-width': Math.abs(valuePosition - zeroPosition),
            '--target-start': view.targetStart,
            '--target-width': view.targetEnd - view.targetStart,
        };

        for (const [property, position] of Object.entries(properties)) {
            this.element.style.setProperty(property, `${position}%`);
        }
    }
}
