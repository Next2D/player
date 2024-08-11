/**
 * @description Shapeの描画を実行します。
 *              Execute the drawing of Shape.
 *
 * @param  {Float32Array} render_queue
 * @param  {number} index 
 * @return {number}
 * @method
 * @protected
 */
export const execute = (render_queue: Float32Array, index: number): number =>
{
    console.log("render shape");
    return index;
};