/**
 * @description 矩形の頂点データを作成
 *              Create rect vertices data
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    width: number,
    height: number
): Float32Array => {
    return new Float32Array([
        // Position (x, y), TexCoord (u, v)
        x, y, 0.0, 0.0,
        x + width, y, 1.0, 0.0,
        x, y + height, 0.0, 1.0,

        x + width, y, 1.0, 0.0,
        x + width, y + height, 1.0, 1.0,
        x, y + height, 0.0, 1.0
    ]);
};
