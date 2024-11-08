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
    let value = "";
    value += `${x_scale}`;
    value += `${y_scale}`;
    if (alpha) {
        value += `${alpha}`;
    }

    let hash = 0;
    for (let idx = 0; idx < value.length; idx++) {

        const chr = value.charCodeAt(idx);

        hash  = (hash << 5) - hash + chr;
        hash |= 0;
    }

    return hash;
};