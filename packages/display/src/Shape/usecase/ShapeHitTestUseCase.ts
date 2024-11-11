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
    if (!graphics.$recodes) {
        return false;
    }

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

    const hit = graphicsHitTestService(
        hit_context, graphics.$recodes, hit_object
    );

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }

    return hit;
};