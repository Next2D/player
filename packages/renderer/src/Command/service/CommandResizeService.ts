import { $cacheStore } from "@next2d/cache";
import {
    $setRendererSize,
    $context,
    $getRendererWidth,
    $getRendererHeight
} from "../../RendererUtil";

/**
 * @description 画面リサイズ時にcanvasのリサイズ、内部情報の更新を行う
 *              Resize the canvas when resizing the screen and update internal information
 *
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @param  {boolean} cache_clear
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    renderer_width: number,
    renderer_height: number,
    cache_clear: boolean = true
): void => {

    if ($getRendererWidth() === renderer_width
        && $getRendererHeight() === renderer_height
    ) {
        return ;
    }

    // resize
    $setRendererSize(renderer_width, renderer_height);

    // context reset and update
    $context.resize(renderer_width, renderer_height, cache_clear);

    // cache clear
    if (cache_clear) {
        $cacheStore.reset();
    }
};