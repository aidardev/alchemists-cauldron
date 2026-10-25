import { BaseComponent } from '@/core/base-component';
import { INGREDIENTS } from '@/data/ingredients';
import { selectActionBar } from '@/logic/select-action-bar';
import { selectCauldron } from '@/logic/select-cauldron';
import { selectHeader } from '@/logic/select-header';
import { selectParameterBars } from '@/logic/select-parameter-bars';
import { selectPlayField } from '@/logic/select-play-field';
import { selectRecipePanel } from '@/logic/select-recipe-panel';
import { selectShelfSlots } from '@/logic/select-shelf-slots';
import { GameStore } from '@/state/game-store';
import { GameTimer } from '@/state/game-timer';
import { GameVisibility } from '@/state/game-visibility';
import type { GameState } from '@/types/game';
import { ActionBar } from '@/ui/action-bar/action-bar';
import { Cauldron } from '@/ui/cauldron/cauldron';
import { GameMenuController } from '@/ui/game-menu/game-menu-controller';
import { GameResultsController } from '@/ui/game-results/game-results-controller';
import { Header } from '@/ui/header/header';
import { MenuActions } from '@/ui/menu-actions/menu-actions';
import { ParameterBars } from '@/ui/parameter-bars/parameter-bars';
import { PlayField } from '@/ui/play-field/play-field';
import { RecipePanel } from '@/ui/recipe-panel/recipe-panel';
import { Shelf } from '@/ui/shelf/shelf';
import './app.scss';

export class App extends BaseComponent<'main'> {
    private readonly unsubscribe: () => void;
    private readonly timer: GameTimer;
    private readonly visibility: GameVisibility;
    private readonly gameResults: GameResultsController;
    private readonly gameMenu: GameMenuController;

    constructor(store: GameStore = new GameStore()) {
        super('main', 'app');

        const field = this.adopt(new PlayField());

        const header = this.adopt(new Header());
        const shelf = this.adopt(new Shelf({ onAdd: (id) => store.addIngredient(id) }));
        const cauldron = this.adopt(new Cauldron());
        const parameterBars = this.adopt(new ParameterBars());
        const recipePanel = this.adopt(new RecipePanel());
        const gameResults = new GameResultsController(store);
        this.gameResults = gameResults;
        const gameMenu = new GameMenuController(store, () => gameResults.openLeaderboard());
        this.gameMenu = gameMenu;
        const menuActions = this.adopt(
            new MenuActions({
                onHelp: () => gameMenu.openHelp(),
                onSettings: () => gameMenu.openSettings(),
                onLeaderboard: () => gameMenu.openLeaderboard(),
            }),
        );
        const actionBar = this.adopt(
            new ActionBar({
                onStart: () => store.startGame(),
                onBrew: () => store.brew(),
                onPourOut: () => store.pourOut(),
                onPause: () => store.pause(),
                onContinue: () => store.continueGame(),
            }),
        );

        field.element.append(
            header.element,
            shelf.element,
            cauldron.element,
            recipePanel.element,
            parameterBars.element,
        );

        const controls = document.createElement('div');
        controls.className = 'app__controls';
        controls.append(actionBar.element, menuActions.element);

        this.element.append(field.element, controls, ...gameResults.elements, ...gameMenu.elements);

        const render = (state: GameState): void => {
            field.render(selectPlayField(state));
            header.render(selectHeader(state));
            shelf.render(selectShelfSlots(state, INGREDIENTS));
            cauldron.render(selectCauldron(state, INGREDIENTS));
            parameterBars.render(selectParameterBars(state, INGREDIENTS));
            recipePanel.render(selectRecipePanel(state));
            actionBar.render(selectActionBar(state, store.getSavedGame(), store.getSaveError()));
        };

        this.unsubscribe = store.subscribe(render);
        render(store.getState());
        this.timer = new GameTimer(store);
        this.visibility = new GameVisibility(store);
    }

    public override destroy(): void {
        this.unsubscribe();
        this.timer.destroy();
        this.visibility.destroy();
        this.gameMenu.destroy();
        this.gameResults.destroy();
        super.destroy();
    }
}
