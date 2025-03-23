/**
 * @description キャッシュストアのキーを生成
 *              Generate cache store keys
 *
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @return {string}
 * @method
 * @public
 */
export const execute = (a: number, b: number, c: number, d: number): string =>
{
    return `${a}${b}${c}${d}`;
};