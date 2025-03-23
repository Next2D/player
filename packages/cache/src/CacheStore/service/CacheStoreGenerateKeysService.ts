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
    const values = [x_scale * 10000, y_scale * 10000];
    if (alpha) {
        values.push(alpha * 100);
    }

    let hash = 2166136261; // FNV-1aオフセット basis
    for (let idx = 0; idx < values.length; ++idx) {

        let num = values[idx] | 0; // 整数として扱う

        // 32bit整数の各バイトを処理
        for (let i = 0; i < 4; i++) {
            const byte = num & 0xff;
            hash ^= byte;
            hash = Math.imul(hash, 16777619); // FNV-1a の FNV prime
            num >>>= 8;
        }
    }

    return (hash >>> 0) % 16777216;
};