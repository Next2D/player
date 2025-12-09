/**
 * @description 2のべき乗に切り上げ
 *              Round up to the next power of two
 *
 * @param  {number} v
 * @return {number}
 * @method
 * @protected
 */
export const execute = (v: number): number =>
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    return v + 1;
};
