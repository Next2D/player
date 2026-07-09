import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as graphicsHitTestService } from "../../Graphics/service/GraphicsHitTestService";
import {
    $getFloat32Array6,
    $poolFloat32Array6
} from "../../DisplayObjectUtil";

/**
 * @description Shape のヒット判定
 *              Hit judgment of Shape
 *
 * @param  {Shape} shape
 * @param  {CanvasRenderingContext2D} hit_context
 * @param  {Float32Array} matrix
 * @param  {IPlayerHitObject} hit_object
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = (
    shape: Shape,
    hit_context: CanvasRenderingContext2D,
    matrix: Float32Array,
    hit_object: IPlayerHitObject
): boolean => {

    const graphics = shape.graphics;

    const width  = graphics.xMax - graphics.xMin;
    const height = graphics.yMax - graphics.yMin;
    if (width <= 0 || height <= 0 ) {
        return false;
    }

    let rawMatrix = displayObjectGetRawMatrixUseCase(shape);

    // cacheAsBitmap倍率をrawMatrixに適用
    const cacheMatrix = shape.cacheAsBitmap;
    let scaledMatrix: Float32Array | null = null;
    if (cacheMatrix) {
        const m = cacheMatrix.rawData;
        const csx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        const csy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
        if (rawMatrix) {
            scaledMatrix = $getFloat32Array6(
                rawMatrix[0] * csx, rawMatrix[1] * csx,
                rawMatrix[2] * csy, rawMatrix[3] * csy,
                rawMatrix[4], rawMatrix[5]
            );
        } else {
            scaledMatrix = $getFloat32Array6(csx, 0, 0, csy, 0, 0);
        }
        rawMatrix = scaledMatrix;
    }

    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    if (scaledMatrix) {
        $poolFloat32Array6(scaledMatrix);
    }

    // AABB早期リターン: ポインタをローカル座標へ逆変換し、
    // バウンディングボックスの外ならパス再生とisPointInPathをスキップする。
    // 描画コマンドがある場合はgraphicsのbounds(ストローク幅込み)、
    // 無い場合はフォールバック矩形(0,0)-(width,height)と同じ範囲で判定するため結果は不変。
    const det = tMatrix[0] * tMatrix[3] - tMatrix[1] * tMatrix[2];
    if (det) {
        const dx = hit_object.x - tMatrix[4];
        const dy = hit_object.y - tMatrix[5];
        const localX = (tMatrix[3] * dx - tMatrix[2] * dy) / det;
        const localY = (tMatrix[0] * dy - tMatrix[1] * dx) / det;

        const hasCommands = graphics.buffer.length > 0;
        const boundsXMin = hasCommands ? graphics.xMin : 0;
        const boundsYMin = hasCommands ? graphics.yMin : 0;
        const boundsXMax = hasCommands ? graphics.xMax : width;
        const boundsYMax = hasCommands ? graphics.yMax : height;

        if (localX < boundsXMin || localX > boundsXMax
            || localY < boundsYMin || localY > boundsYMax
        ) {
            if (tMatrix !== matrix) {
                Matrix.release(tMatrix);
            }
            return false;
        }
    }

    hit_context.beginPath();
    hit_context.setTransform(
        tMatrix[0], tMatrix[1], tMatrix[2],
        tMatrix[3], tMatrix[4], tMatrix[5]
    );

    let hit = false;
    if (graphics.buffer.length) {
        hit = graphicsHitTestService(
            hit_context, graphics.buffer, hit_object
        );
    } else {
        hit_context.moveTo(0, 0);
        hit_context.lineTo(width, 0);
        hit_context.lineTo(width, height);
        hit_context.lineTo(0, height);
        hit_context.lineTo(0, 0);

        hit = hit_context.isPointInPath(hit_object.x, hit_object.y);
    }

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }

    return hit;
};