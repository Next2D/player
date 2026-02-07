/**
 * @description キャッシュストアのフィルターキーを生成
 *              Generate cache store filter keys
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
    let hash = 2166136261; // FNV-1aオフセット basis

    // a処理
    let num = a * 100 | 0;
    hash ^= num & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 8 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 16 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 24;
    hash = Math.imul(hash, 16777619);

    // b処理
    num = b * 100 | 0;
    hash ^= num & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 8 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 16 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 24;
    hash = Math.imul(hash, 16777619);

    // c処理
    num = c * 100 | 0;
    hash ^= num & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 8 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 16 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 24;
    hash = Math.imul(hash, 16777619);

    // d処理
    num = d * 100 | 0;
    hash ^= num & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 8 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 16 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 24;
    hash = Math.imul(hash, 16777619);

    return (hash >>> 0) % 16777216;
};