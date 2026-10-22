import { BaseComponent } from '@/core/base-component';
import { INGREDIENTS } from '@/data/ingredients';
import { selectActionBar } from '@/logic/select-action-bar';
import { selectCauldron } from '@/logic/select-cauldron';
import { selectGameOver } from '@/logic/select-game-over';
import { selectHeader } from '@/logic/select-header';
import { selectParameterBars } from '@/logic/select-parameter-bars';
import { selectPauseDialog } from '@/logic/select-pause-dialog';
import { selectPlayField } from '@/logic/select-play-field';
import { selectRecipePanel } from '@/logic/select-recipe-panel';
import { selectShelfSlots } from '@/logic/select-shelf-slots';
import { GameStore } from '@/state/game-store';
import { GameTimer } from '@/state/game-timer';
import { GameVisibility } from '@/state/game-visibility';
import type { GameState } from '@/types/game';
import { ActionBar } from '@/ui/action-bar/action-bar';
import { Cauldron } from '@/ui/cauldron/cauldron';
import { GameOver } from '@/ui/game-over/game-over';
import { Header } from '@/ui/header/header';
import { ParameterBars } from '@/ui/parameter-bars/parameter-bars';
import { PauseDialog } from '@/ui/pause-dialog/pause-dialog';
import { PlayField } from '@/ui/play-field/play-field';
import { RecipePanel } from '@/ui/recipe-panel/recipe-panel';
import { Shelf } from '@/ui/shelf/shelf';
import './app.scss';

export class App extends BaseComponent<'main'> {
    private readonly unsubscribe: () => void;
    private readonly timer: GameTimer;
    private readonly visibility: GameVisibility;

    constructor(store: GameStore = new GameStore()) {
        super('main', 'app');

        const field = this.adopt(new PlayField());

        const header = this.adopt(new Header());
        const shelf = this.adopt(new Shelf({ onAdd: (id) => store.addIngredient(id) }));
        const cauldron = this.adopt(new Cauldron());
        const parameterBars = this.adopt(new ParameterBars());
        const recipePanel = this.adopt(new RecipePanel());
        const gameOver = this.adopt(new GameOver(() => store.startGame()));
        const pauseDialog = this.adopt(
            new PauseDialog({
                onResume: () => store.resume(),
                onExitToMenu: () => store.exitToMenu(),
            }),
        );
        const actionBar = this.adopt(
            new ActionBar({
                onStart: () => store.startGame(),
                onBrew: () => store.brew(),
                onPause: () => store.pause(),
            }),
        );

        field.element.append(
            header.element,
            shelf.element,
            cauldron.element,
            recipePanel.element,
            parameterBars.element,
            actionBar.element,
        );

        this.element.append(field.element, gameOver.element, pauseDialog.element);

        const render = (state: GameState): void => {
            field.render(selectPlayField(state));
            header.render(selectHeader(state));
            shelf.render(selectShelfSlots(state, INGREDIENTS));
            cauldron.render(selectCauldron(state, INGREDIENTS));
            parameterBars.render(selectParameterBars(state, INGREDIENTS));
            recipePanel.render(selectRecipePanel(state));
            actionBar.render(selectActionBar(state));
            gameOver.render(selectGameOver(state));
            pauseDialog.render(selectPauseDialog(state));
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
        super.destroy();
    }
}
