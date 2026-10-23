import { selectPauseDialog } from '@/logic/select-pause-dialog';
import { selectSettings } from '@/logic/select-settings';
import type { GameStore } from '@/state/game-store';
import { MenuSession } from '@/state/menu-session';
import type { GameState } from '@/types/game';
import { HelpDialog } from '@/ui/help-dialog/help-dialog';
import { PauseDialog } from '@/ui/pause-dialog/pause-dialog';
import { SettingsDialog } from '@/ui/settings-dialog/settings-dialog';

export class GameMenuController {
    private readonly store: GameStore;
    private readonly session: MenuSession;
    private readonly help: HelpDialog;
    private readonly settings: SettingsDialog;
    private readonly pause: PauseDialog;
    private readonly showLeaderboard: () => HTMLDialogElement;
    private readonly unsubscribe: () => void;
    private readonly abortController = new AbortController();
    private currentDialog: HTMLDialogElement | undefined;

    private handleMenuClose = (): void => {
        this.currentDialog = undefined;
        this.session.end();
        this.render(this.store.getState());
    };

    constructor(store: GameStore, showLeaderboard: () => HTMLDialogElement) {
        this.store = store;
        this.showLeaderboard = showLeaderboard;
        this.session = new MenuSession(store);
        this.help = new HelpDialog();
        this.settings = new SettingsDialog((difficulty) => store.setDifficulty(difficulty));
        this.pause = new PauseDialog({
            onResume: () => store.resume(),
            onExitToMenu: () => store.exitToMenu(),
        });
        this.unsubscribe = store.subscribe((state) => this.render(state));
        this.render(store.getState());
    }

    private render(state: GameState): void {
        this.help.render(state.difficulty);
        this.settings.render(selectSettings(state));
        this.pause.render(selectPauseDialog(state, this.session.isActive));
    }

    private open(show: () => HTMLDialogElement): void {
        if (!this.session.begin()) return;
        this.render(this.store.getState());
        this.currentDialog = show();
        this.currentDialog.addEventListener('close', this.handleMenuClose, {
            once: true,
            signal: this.abortController.signal,
        });
    }

    public get elements(): readonly HTMLDialogElement[] {
        return [this.help.element, this.settings.element, this.pause.element];
    }

    public openHelp(): void {
        this.open(() => {
            this.help.open();
            return this.help.element;
        });
    }

    public openSettings(): void {
        this.open(() => {
            this.settings.open();
            return this.settings.element;
        });
    }

    public openLeaderboard(): void {
        this.open(this.showLeaderboard);
    }

    public destroy(): void {
        this.abortController.abort();
        this.unsubscribe();
        this.session.destroy();
        this.currentDialog?.close();
        this.help.destroy();
        this.settings.destroy();
        this.pause.destroy();
    }
}
