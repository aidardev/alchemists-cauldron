import { BaseComponent } from '@/core/base-component';
import { IconButton } from '@/ui/icon-button/icon-button';
import { html } from '@/utils/html';
import './menu-actions.scss';

interface MenuActionsOptions {
    readonly onHelp: () => void;
    readonly onLeaderboard: () => void;
    readonly onSettings: () => void;
}

export class MenuActions extends BaseComponent<'nav'> {
    constructor({ onHelp, onLeaderboard, onSettings }: MenuActionsOptions) {
        super('nav', 'menu-actions');
        this.element.setAttribute('aria-label', 'Game menu');
        const buttons = [
            {
                label: 'Help',
                controls: 'help-dialog',
                onClick: onHelp,
                icon: html`<circle cx="12" cy="12" r="9"></circle
                    ><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16.5h.01"></path>`,
            },
            {
                label: 'Leaderboard',
                controls: 'leaderboard-dialog',
                onClick: onLeaderboard,
                icon: html`<path
                    d="M8 3h8v6a4 4 0 0 1-8 0ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v5m-4 3h8m-7-3h6v3"
                ></path>`,
            },
            {
                label: 'Settings',
                controls: 'settings-dialog',
                onClick: onSettings,
                icon: html`<path
                        d="m10 3-.6 2.4-2 .9L5 5.5 3 9l1.8 1.7v2.6L3 15l2 3.5 2.4-.8 2 .9L10 21h4l.6-2.4 2-.9 2.4.8 2-3.5-1.8-1.7v-2.6L21 9l-2-3.5-2.4.8-2-.9L14 3Z"
                    ></path
                    ><circle cx="12" cy="12" r="3"></circle>`,
            },
        ];
        for (const options of buttons) {
            this.element.append(this.adopt(new IconButton(options)).element);
        }
    }
}
