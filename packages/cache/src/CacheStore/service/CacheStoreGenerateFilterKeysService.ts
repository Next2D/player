/**
 * @description キャッシュストアのキーを生成
 *              Generate cache store keys
 *
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @return {number}
 * @method
 * @public
 */
export const execute = (a: number, b: number, c: number, d: number): number =>
{
    const value = `${a}${b}${c}${d}`;

    let hash = 0;
    for (let idx = 0; idx < value.length; idx++) {

        const chr = value.charCodeAt(idx);

        hash  = (hash << 5) - hash + chr;
        hash |= 0;
    }

    return hash;
};