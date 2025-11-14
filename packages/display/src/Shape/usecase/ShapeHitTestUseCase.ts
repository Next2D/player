import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as graphicsHitTestService } from "../../Graphics/service/GraphicsHitTestService";

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

    const rawMatrix = displayObjectGetRawMatrixUseCase(shape);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

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