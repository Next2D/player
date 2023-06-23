import { RenderGraphics } from "./RenderGraphics";
import type { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import type { BoundsImpl } from "../interface/BoundsImpl";
import { $shapes } from "./RenderGlobal";
import {
    $boundsMatrix,
    $clamp,
    $Infinity,
    $Math,
    $multiplicationColor,
    $multiplicationMatrix,
    $poolBoundsObject,
    $poolFloat32Array6,
    $poolFloat32Array8
} from "../util/RenderUtil";

/**
 * @class
 */
export class RenderShape extends RenderGraphics
{
    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @private
     */
    _$clip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): void {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        // size
        const baseBounds: BoundsImpl = this._$getBounds();
        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        $poolBoundsObject(baseBounds);

        const width: number  = $Math.ceil($Math.abs(bounds.xMax - bounds.xMin));
        const height: number = $Math.ceil($Math.abs(bounds.yMax - bounds.yMin));
        $poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case height === 0:
            case width === 0 - $Infinity:
            case height === 0 - $Infinity:
            case width === $Infinity:
            case height === $Infinity:
                return;

            default:
                break;

        }

        super._$clip(context, multiMatrix);

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array
    ): void {

        if (!this._$visible || !this._$maxAlpha || !this._$canDraw) {
            return ;
        }

        let multiColor: Float32Array = color_transform;
        const rawColor: Float32Array = this._$colorTransform;
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = $multiplicationColor(color_transform, rawColor);
        }

        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                $poolFloat32Array8(multiColor);
            }
            return ;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        super._$draw(
            context, multiMatrix, multiColor,
            this._$blendMode, this._$filters
        );

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
        }
    }

    /**
     * @description Playerから登録を削除
     *
     * @return {void}
     * @method
     * @private
     */
    _$remove (): void
    {
        this._$xMin    = 0;
        this._$yMin    = 0;
        this._$xMax    = 0;
        this._$yMax    = 0;
        this._$recodes = null;

        super._$remove();

        $shapes.push(this);
    }
}