type AnchorRect = Pick<DOMRectReadOnly, 'left' | 'right' | 'top' | 'bottom'>;
type Size = Pick<DOMRectReadOnly, 'width' | 'height'>;

export function positionTooltip(
    anchor: AnchorRect,
    tooltip: Size,
    viewport: Size,
): { left: number; top: number } {
    const margin = 8;
    const canFitRight = anchor.right + tooltip.width <= viewport.width - margin;
    const canFitLeft = anchor.left - tooltip.width >= margin;
    let left: number;
    let top: number;

    if (canFitRight || canFitLeft) {
        left = canFitRight ? anchor.right : anchor.left - tooltip.width;
        top =
            anchor.top + tooltip.height <= viewport.height - margin
                ? anchor.top
                : anchor.bottom - tooltip.height;
    } else {
        left = anchor.left;
        top =
            anchor.bottom + tooltip.height <= viewport.height - margin
                ? anchor.bottom
                : anchor.top - tooltip.height;
    }

    return {
        left: Math.max(margin, Math.min(left, viewport.width - tooltip.width - margin)),
        top: Math.max(margin, Math.min(top, viewport.height - tooltip.height - margin)),
    };
}
