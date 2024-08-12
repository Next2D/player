import { $cacheStore } from "@next2d/cache";
import {
    $canvas,
    $setRendererSize,
    $gl,
    $context
} from "../../RendererUtil";

/**
 * @description 画面リサイズ時にcanvasのリサイズ、内部情報の更新を行う
 *              Resize the canvas when resizing the screen and update internal information
 *
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    renderer_width: number,
    renderer_height: number
): void => {

    if ($canvas.width === renderer_width
        && $canvas.height === renderer_height
    ) {
        return ;
    }

    // resize
    $setRendererSize(renderer_width, renderer_height);

    // update canvas size
    $canvas.width  = renderer_width;
    $canvas.height = renderer_height;
    $gl.viewport(0, 0, renderer_width, renderer_height);

    // cache clear
    $cacheStore.reset();

    // context reset and update
    $context.resize(renderer_width, renderer_height);
};