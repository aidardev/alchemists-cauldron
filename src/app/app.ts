import { BaseComponent } from '@/core/base-component';
import { INGREDIENTS } from '@/data/ingredients';
import { selectCauldron } from '@/logic/select-cauldron';
import { selectShelfSlots } from '@/logic/select-shelf-slots';
import { GameStore } from '@/state/game-store';
import type { GameState } from '@/types/game';
import { ActionBar } from '@/ui/action-bar/action-bar';
import { Cauldron } from '@/ui/cauldron/cauldron';
import { Header } from '@/ui/header/header';
import { Shelf } from '@/ui/shelf/shelf';
import './app.scss';

export class App extends BaseComponent<'main'> {
    private readonly unsubscribe: () => void;

    constructor(store: GameStore = new GameStore()) {
        super('main', 'app');

        const header = this.adopt(new Header());
        const shelf = this.adopt(new Shelf({ onAdd: (id) => store.addIngredient(id) }));
        const cauldron = this.adopt(new Cauldron());
        const actionBar = this.adopt(new ActionBar({ onStart: () => store.startGame() }));

        this.element.append(header.element, shelf.element, cauldron.element, actionBar.element);

        const render = (state: GameState): void => {
            shelf.render(selectShelfSlots(state, INGREDIENTS));
            cauldron.render(selectCauldron(state, INGREDIENTS));
            actionBar.render(state.status);
        };

        this.unsubscribe = store.subscribe(render);
        render(store.getState());
    }

    public override destroy(): void {
        this.unsubscribe();
        super.destroy();
    }
}
