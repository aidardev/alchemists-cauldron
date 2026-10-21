import { BaseComponent } from '@/core/base-component';
import { INGREDIENTS } from '@/data/ingredients';
import { selectActionBar } from '@/logic/select-action-bar';
import { selectCauldron } from '@/logic/select-cauldron';
import { selectHeader } from '@/logic/select-header';
import { selectParameterBars } from '@/logic/select-parameter-bars';
import { selectRecipePanel } from '@/logic/select-recipe-panel';
import { selectShelfSlots } from '@/logic/select-shelf-slots';
import { GameStore } from '@/state/game-store';
import type { GameState } from '@/types/game';
import { ActionBar } from '@/ui/action-bar/action-bar';
import { Cauldron } from '@/ui/cauldron/cauldron';
import { Header } from '@/ui/header/header';
import { ParameterBars } from '@/ui/parameter-bars/parameter-bars';
import { RecipePanel } from '@/ui/recipe-panel/recipe-panel';
import { Shelf } from '@/ui/shelf/shelf';
import './app.scss';

export class App extends BaseComponent<'main'> {
    private readonly unsubscribe: () => void;

    constructor(store: GameStore = new GameStore()) {
        super('main', 'app');

        const header = this.adopt(new Header());
        const shelf = this.adopt(new Shelf({ onAdd: (id) => store.addIngredient(id) }));
        const cauldron = this.adopt(new Cauldron());
        const parameterBars = this.adopt(new ParameterBars());
        const recipePanel = this.adopt(new RecipePanel());
        const actionBar = this.adopt(
            new ActionBar({
                onStart: () => store.startGame(),
                onBrew: () => store.brew(),
            }),
        );

        this.element.append(
            header.element,
            shelf.element,
            cauldron.element,
            recipePanel.element,
            parameterBars.element,
            actionBar.element,
        );

        const render = (state: GameState): void => {
            header.render(selectHeader(state));
            shelf.render(selectShelfSlots(state, INGREDIENTS));
            cauldron.render(selectCauldron(state, INGREDIENTS));
            parameterBars.render(selectParameterBars(state, INGREDIENTS));
            recipePanel.render(selectRecipePanel(state));
            actionBar.render(selectActionBar(state));
        };

        this.unsubscribe = store.subscribe(render);
        render(store.getState());
    }

    public override destroy(): void {
        this.unsubscribe();
        super.destroy();
    }
}
