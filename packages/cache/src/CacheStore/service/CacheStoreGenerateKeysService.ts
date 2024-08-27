/**
 * @description キャッシュストアのキーを生成
 *              Generate cache store keys
 *
 * @param  {number} x_scale
 * @param  {number} y_scale
 * @param  {number} alpha
 * @return {number}
 * @method
 * @public
 */
export const execute = (x_scale: number, y_scale: number, alpha: number): number => 
{
    const values = [x_scale, y_scale];
    if (alpha) {
        values.push(alpha);
    }

    let hash = 0;
    for (let idx: number = 0; idx < values.length; idx++) {
        hash  = (hash << 5) - hash + values[idx];
        hash |= 0;
    }

    return hash;
};