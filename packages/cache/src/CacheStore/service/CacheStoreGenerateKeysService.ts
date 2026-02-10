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
    let hash = 2166136261; // FNV-1aオフセット basis

    // x_scale処理
    let num = x_scale * 100 | 0;
    hash ^= num & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 8 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 16 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 24;
    hash = Math.imul(hash, 16777619);

    // y_scale処理
    num = y_scale * 100 | 0;
    hash ^= num & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 8 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 16 & 0xff;
    hash = Math.imul(hash, 16777619);
    hash ^= num >>> 24;
    hash = Math.imul(hash, 16777619);

    // alpha処理（alphaが0以外の場合のみ）
    if (alpha) {
        num = alpha * 100 | 0;
        hash ^= num & 0xff;
        hash = Math.imul(hash, 16777619);
        hash ^= num >>> 8 & 0xff;
        hash = Math.imul(hash, 16777619);
        hash ^= num >>> 16 & 0xff;
        hash = Math.imul(hash, 16777619);
        hash ^= num >>> 24;
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0) % 16777216;
};