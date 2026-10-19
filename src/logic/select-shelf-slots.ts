import type { GameState } from '@/types/game';
import type { Ingredient } from '@/types/ingredient';
import type { ShelfSlotView } from '@/types/view';
import { canAddIngredient } from './can-add-ingredient';

export function selectShelfSlots(
    state: GameState,
    catalog: readonly Ingredient[],
): readonly ShelfSlotView[] {
    const slots: ShelfSlotView[] = [];

    for (const ingredient of catalog) {
        const stock = state.shelfStock[ingredient.id];

        if (stock === undefined) continue;

        slots.push({ ingredient, stock, disabled: !canAddIngredient(state, ingredient.id) });
    }

    return slots;
}
