import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { $getBoundsArray } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectContainerのレイヤー境界を取得します。
 *              Get the layer bounds of DisplayObjectContainer.
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {Float32Array | null} matrix
 * @return {Float32Array}
 * @method
 * @public
 */
export const execute = <P extends DisplayObjectContainer> (
    display_object_container: P,
    matrix: Float32Array | null = null
): Float32Array => {

    const children = display_object_container.children;
    const length = children.length;

    const bounds = $getBoundsArray(
        Number.MAX_VALUE, Number.MAX_VALUE,
        -Number.MAX_VALUE, -Number.MAX_VALUE
    );

    console.log("todo:", matrix);
    for (let idx = 0; idx < length; idx++) {
        // todo
    }

    return bounds;
};