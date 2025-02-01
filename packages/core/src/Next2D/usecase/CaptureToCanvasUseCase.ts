import type { DisplayObject } from "@next2d/display";
import { stage } from "@next2d/display";
import { $cacheStore } from "@next2d/cache";
import { $player } from "../../Player";
import { $devicePixelRatio } from "../../CoreUtil";
import { execute as playerResizePostMessageService } from "../../Player/service/PlayerResizePostMessageService";
import { execute as playerTransferCanvasPostMessageService } from "../../Player/service/PlayerTransferCanvasPostMessageService";
import {
    Matrix,
    ColorTransform
} from "@next2d/geom";

/**
 * @type {Float32Array}
 * @private
 */
const $MATRIX_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {Float32Array}
 * @private
 */
const $COLOR_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description 指定した DisplayObject を Canvas に描画する
 *              Draw the specified DisplayObject in Canvas
 *
 * @param  {D} display_object
 * @param  {Matrix} [matrix=null]
 * @param  {ColorTransform} [color_transform=null]
 * @param  {HTMLCanvasElement} [transferred_canvas=null]
 * @return {Promise<HTMLCanvasElement>}
 * @method
 * @protected
 */
export const execute = async <D extends DisplayObject> (
    display_object: D,
    matrix: Matrix | null = null,
    color_transform: ColorTransform | null = null,
    transferred_canvas: HTMLCanvasElement | null = null
): Promise<HTMLCanvasElement> => {

    const tColorTransform = color_transform
        ? color_transform.rawData
        : $COLOR_ARRAY_IDENTITY;

    const rectangle = display_object.getBounds();
    const translateMatrix = new Float32Array([
        1, 0, 0, 1, -rectangle.x, -rectangle.y
    ]);

    const tMatrix = matrix
        ? Matrix.multiply(matrix.rawData, translateMatrix)
        : Matrix.multiply($MATRIX_ARRAY_IDENTITY, translateMatrix);

    if (!transferred_canvas) {
        transferred_canvas = $cacheStore.getCanvas();
    }

    const xScale = Math.sqrt(tMatrix[0] * tMatrix[0] + tMatrix[1] * tMatrix[1]);
    const yScale = Math.sqrt(tMatrix[2] * tMatrix[2] + tMatrix[3] * tMatrix[3]);

    const width  = display_object.width * xScale;
    const height = display_object.height * yScale;
    if (width <= 0 || height <= 0) {
        return transferred_canvas;
    }

    // resize canvas
    transferred_canvas.width  = width;
    transferred_canvas.height = height;

    const stopFlag = $player.stopFlag;
    if (!stopFlag) {
        $player.stop();
    }

    // resize
    let isResize = false;
    const cacheWidth  = $player.rendererWidth;
    const cacheHeight = $player.rendererHeight;
    const cacheScale  = $player.rendererScale;
    if (width > cacheWidth || height > cacheHeight) {

        isResize = true;

        const scale = Math.min(
            width  / stage.stageWidth,
            height / stage.stageHeight
        ) * $devicePixelRatio;

        // update
        stage.rendererScale  = $player.rendererScale  = scale;
        stage.rendererWidth  = $player.rendererWidth  = width;
        stage.rendererHeight = $player.rendererHeight = height;

        // workerにリサイズを通知
        playerResizePostMessageService();
    }

    // draw
    await playerTransferCanvasPostMessageService(
        display_object, tMatrix, tColorTransform, transferred_canvas
    );

    // restore
    if (isResize) {
        stage.rendererScale  = $player.rendererScale  = cacheScale;
        stage.rendererWidth  = $player.rendererWidth  = cacheWidth;
        stage.rendererHeight = $player.rendererHeight = cacheHeight;

        // workerにリサイズを通知
        playerResizePostMessageService();
    }

    if (!stopFlag) {
        $player.play();
    }

    if (matrix) {
        Matrix.release(tMatrix);
    }

    if (color_transform) {
        ColorTransform.release(tColorTransform);
    }

    return transferred_canvas;
};