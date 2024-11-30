import type { Sprite } from "../../Sprite";
import { $setDraggingDisplayObject } from "../../DisplayObjectUtil";

/**
 * @description startDrag() メソッドを終了して、ドラッグ変数をリセットします。
 *              Ends the startDrag() method and resets the drag variables.
 *
 * @param  {Sprite} sprite
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends Sprite>(sprite: D): void =>
{
    sprite.$lockCenter  = false;
    sprite.$offsetX     = 0;
    sprite.$offsetY     = 0;
    sprite.$boundedRect = null;

    $setDraggingDisplayObject(null);
};