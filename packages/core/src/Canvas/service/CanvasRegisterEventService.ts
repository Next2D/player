import {
    $POINTER_DOWN,
    $POINTER_UP,
    $POINTER_MOVE
} from "../../Canvas";

/**
 * 
 * @param {HTMLCanvasElement} canvas
 * @return {void}
 * @method
 * @public
 */
export const execute = (canvas: HTMLCanvasElement): void =>
{
    canvas.addEventListener($POINTER_DOWN, (event: PointerEvent): void =>
    {
        // イベントの伝播を止める
        event.preventDefault();
        event.stopPropagation();

        // $setEvent(event);
        // $setEventType($POINTER_DOWN);

        // // start position
        // this._$hitTest();
    });

    canvas.addEventListener($POINTER_UP, (event: PointerEvent): void =>
    {
        // イベントの伝播を止める
        event.preventDefault();
        event.stopPropagation();

        const element: HTMLElement = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        element.releasePointerCapture(event.pointerId);
        // $setEvent(event);
        // $setEventType($POINTER_UP);
        // this._$hitTest();
    });

    canvas.addEventListener($POINTER_MOVE, (event: PointerEvent) =>
    {
        // イベントの伝播を止める
        event.preventDefault();
        event.stopPropagation();

        const element: HTMLElement = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        element.setPointerCapture(event.pointerId);
        // $setEvent(event);
        // $setEventType($POINTER_MOVE);

        // this._$hitTest();
    }, { "passive": false });
};