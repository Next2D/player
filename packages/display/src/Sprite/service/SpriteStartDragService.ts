import type { Sprite } from "../../Sprite";
import type { Rectangle } from "@next2d/geom";
import {
    $pointer,
    $setDraggingDisplayObject
} from "../../DisplayObjectUtil";

/**
 * @description ドラッグを開始します。
 *              Starts dragging.
 *
 * @param  {Sprite} sprite
 * @param  {boolean} [lock_center=false]
 * @param  {Rectangle|null} [bounds=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends Sprite>(
    sprite: D,
    lock_center: boolean = false,
    bounds: Rectangle | null = null
): void => {

    const point = sprite.parent
        ? sprite.parent.globalToLocal($pointer)
        : sprite.globalToLocal($pointer);

    sprite.$lockCenter  = lock_center;
    sprite.$offsetX     = sprite.x - point.x;
    sprite.$offsetY     = sprite.y - point.y;
    sprite.$boundedRect = bounds;

    $setDraggingDisplayObject(sprite);
};