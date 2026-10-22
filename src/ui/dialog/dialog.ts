import { BaseComponent } from '@/core/base-component';
import { SafeHtml } from '@/utils/html';
import './dialog.scss';

interface DialogOptions {
    readonly modifier?: string;
    readonly labelledBy: string;
    readonly describedBy?: string;
    readonly onClose?: (returnValue: string) => void;
}

export abstract class Dialog extends BaseComponent<'dialog'> {
    private readonly content: HTMLElement;
    private readonly onClose: DialogOptions['onClose'];
    private pointerDownOnBackdrop = false;
    private locked = false;

    private handlePointerDown = (event: PointerEvent): void => {
        this.pointerDownOnBackdrop = event.target === this.element;
    };

    private handleClick = (event: MouseEvent): void => {
        const isBackdropClick = this.pointerDownOnBackdrop && event.target === this.element;
        this.pointerDownOnBackdrop = false;
        if (isBackdropClick && !this.locked) this.close();
    };

    private handleCancel = (event: Event): void => {
        if (this.locked) event.preventDefault();
    };

    private handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape' && this.locked) event.preventDefault();
    };

    private handleClose = (): void => {
        this.pointerDownOnBackdrop = false;
        if (!this.element.open) this.onClose?.(this.element.returnValue);
    };

    constructor({ modifier, labelledBy, describedBy, onClose }: DialogOptions) {
        super('dialog', modifier ? `dialog ${modifier}` : 'dialog');
        this.onClose = onClose;
        this.element.setAttribute('aria-labelledby', labelledBy);
        if (describedBy) this.element.setAttribute('aria-describedby', describedBy);

        this.content = document.createElement('div');
        this.content.className = 'dialog__content';
        this.element.append(this.content);

        this.bindEvents();
    }

    private bindEvents(): void {
        const options = { signal: this.eventSignal };

        this.element.addEventListener('pointerdown', this.handlePointerDown, options);
        this.element.addEventListener('click', this.handleClick, options);
        this.element.addEventListener('cancel', this.handleCancel, options);
        this.element.addEventListener('keydown', this.handleKeyDown, options);
        this.element.addEventListener('close', this.handleClose, options);
    }

    protected setContent(content: SafeHtml | Node): void {
        if (content instanceof SafeHtml) {
            this.content.innerHTML = content.value;
        } else {
            this.content.replaceChildren(content);
        }
    }

    // Blocks user dismissal; the owner can still call close().
    protected setLocked(isLocked: boolean): void {
        this.locked = isLocked;
    }

    public open(): void {
        if (this.element.open) return;
        if (!this.element.isConnected) document.body.append(this.element);
        this.pointerDownOnBackdrop = false;
        this.element.returnValue = '';
        this.element.showModal();
    }

    public close(returnValue?: string): void {
        if (this.element.open) this.element.close(returnValue);
    }

    public override destroy(): void {
        this.close();
        super.destroy();
    }
}
