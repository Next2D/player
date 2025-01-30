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

    let tMatrix = $MATRIX_ARRAY_IDENTITY;
    if (matrix) {

        const displayObjectMatrix = display_object.matrix;
        displayObjectMatrix.invert();

        tMatrix = Matrix.multiply(
            matrix.rawData, displayObjectMatrix.rawData
        );
    }

    if (!transferred_canvas) {
        transferred_canvas = $cacheStore.getCanvas();
    }

    const rectangle = display_object.getBounds();
    const m0 = tMatrix[0];
    const m1 = tMatrix[1];
    const m2 = tMatrix[2];
    const m3 = tMatrix[3];
    const m4 = tMatrix[4];
    const m5 = tMatrix[5];

    const xMin = rectangle.x;
    const yMin = rectangle.y;
    const xMax = rectangle.right;
    const yMax = rectangle.bottom;

    const x0 = xMax * m0 + yMax * m2 + m4;
    const x1 = xMax * m0 + yMin * m2 + m4;
    const x2 = xMin * m0 + yMax * m2 + m4;
    const x3 = xMin * m0 + yMin * m2 + m4;
    const y0 = xMax * m1 + yMax * m3 + m5;
    const y1 = xMax * m1 + yMin * m3 + m5;
    const y2 = xMin * m1 + yMax * m3 + m5;
    const y3 = xMin * m1 + yMin * m3 + m5;

    const width  = Math.max(x0, x1, x2, x3) - Math.min(x0, x1, x2, x3);
    const height = Math.max(y0, y1, y2, y3) - Math.min(y0, y1, y2, y3);
    if (width <= 0 || height <= 0) {
        return transferred_canvas;
    }

    // resize canvas
    transferred_canvas.width  = width;
    transferred_canvas.height = height;

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

    if (matrix) {
        Matrix.release(tMatrix);
    }

    if (color_transform) {
        ColorTransform.release(tColorTransform);
    }

    return transferred_canvas;
};