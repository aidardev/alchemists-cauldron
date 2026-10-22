import { html, SafeHtml } from '@/utils/html';
import './ingredient-icon.scss';

export function ingredientIcon(id: string): SafeHtml {
    return html`
        <span class="ingredient-icon" data-ingredient="${id}" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
                <path
                    class="ingredient-icon__liquid"
                    d="M10.3 27.5c3.7-2.4 7.2 1.2 11.2 0s6.7-2.6 9.5-1.1 5 1.5 7.1 1.1c.6 1.4.9 2.9.9 4.5 0 7.2-6 13-14 13s-14-5.8-14-13c0-1.2.1-2.2.3-3.2z"
                />
                <path
                    class="ingredient-icon__glass"
                    d="M20 7h8v9.4C34 18.2 38 23.4 38 30c0 7.2-6 13-14 13s-14-5.8-14-13c0-6.6 4-11.8 10-13.6z"
                />
                <rect
                    class="ingredient-icon__cork"
                    x="19"
                    y="3.5"
                    width="10"
                    height="4.5"
                    rx="1.5"
                />
                <path class="ingredient-icon__shine" d="M15 28c.4-3 2-5.2 4.2-6.4" />
            </svg>
        </span>
    `;
}
