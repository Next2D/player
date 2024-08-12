import { execute as bezierConverterCubicToQuadUseCase } from "./BezierConverter/usecase/BezierConverterCubicToQuadUseCase"

/**
 * @description ベジェ曲線の変換後の値を格納するバッファ
 *              Buffer to store the converted values of the Bezier curve
 * 
 * @type {Float32Array}
 * @private
 */
const $bezierBuffer: Float32Array = new Float32Array(32);

/**
 * @description 3次ベジェを、2次ベジェに変換する
 *              Convert cubic Bezier to quadratic Bezier
 *
 * @param  {number} from_x
 * @param  {number} from_y 
 * @param  {number} cx1 
 * @param  {number} cy1 
 * @param  {number} cx2 
 * @param  {number} cy2 
 * @param  {number} x 
 * @param  {number} y 
 * @return {Float32Array}
 * @method
 * @public
 */
export const cubicToQuad = (
    from_x: number, from_y: number,
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): Float32Array => {
    return bezierConverterCubicToQuadUseCase(
        $bezierBuffer,
        from_x, from_y, cx1, cy1, cx2, cy2, x, y
    );
}