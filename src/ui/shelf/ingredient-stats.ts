import type { Ingredient } from '@/types/ingredient';
import { formatSigned } from '@/utils/format-signed';
import { html, type SafeHtml } from '@/utils/html';

function stat(
    kind: string,
    shortLabel: string,
    label: string,
    value: number,
    hasFullLabel: boolean,
): SafeHtml {
    return html`
        <span class="shelf-slot__stat shelf-slot__stat--${kind}">
            <span class="shelf-slot__stat-label">
                ${
                    hasFullLabel
                        ? label
                        : html`<span aria-hidden="true">${shortLabel}</span>
                              <span class="sr-only">${label}</span>`
                }
            </span>
            ${formatSigned(value)}
        </span>
    `;
}

export function ingredientStats(ingredient: Ingredient, hasFullLabels = false): SafeHtml {
    return html`
        <span class="shelf-slot__stats">
            ${stat('temperature', 'T', 'Temperature', ingredient.temperature, hasFullLabels)}
            ${stat('density', 'D', 'Density', ingredient.density, hasFullLabels)}
            ${stat('magic', 'MP', 'Magic Power', ingredient.magicPower, hasFullLabels)}
        </span>
    `;
}
