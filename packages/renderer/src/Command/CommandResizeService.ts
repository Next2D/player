import {
    $canvas,
    $setRendererHeight,
    $setRendererWidth,
    $rendererMatrix,
    $devicePixelRatio,
    $gl,
    $context,
    $rendererStage
} from "../RendererUtil";
import { $cacheStore } from "@next2d/cache";

/**
 * @description 画面リサイズ時にcanvasのリサイズ、内部情報の更新を行う
 *              Resize the canvas when resizing the screen and update internal information
 *
 * @param  {number} scale
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @param  {number} stage_width
 * @param  {number} stage_height
 * @param  {boolean} full_screen
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    scale: number,
    renderer_width: number,
    renderer_height: number,
    stage_width: number,
    stage_height: number,
    full_screen: boolean
): void => {

    if ($canvas.width === renderer_width
        && $canvas.height === renderer_height
    ) {
        return ;
    }

    // resize
    $setRendererWidth(renderer_width);
    $setRendererHeight(renderer_height);

    // update canvas size
    $canvas.width  = renderer_width;
    $canvas.height = renderer_height;
    $gl.viewport(0, 0, renderer_width, renderer_height);

    // update matrix scale
    $rendererMatrix[0] = scale;
    $rendererMatrix[3] = scale;

    // reset
    $rendererMatrix[4] = 0;
    $rendererMatrix[5] = 0;

    if (full_screen) {
        $rendererMatrix[4] = (renderer_width
            - stage_width
                * scale * $devicePixelRatio) / 2;

        $rendererMatrix[5] = (stage_height
            - stage_height
                * scale * $devicePixelRatio) / 2;
    }

    // cache clear
    $cacheStore.reset();

    // context reset and update
    $context.resize(renderer_width, renderer_height);

    // stage update
    $rendererStage.doChanged();
};