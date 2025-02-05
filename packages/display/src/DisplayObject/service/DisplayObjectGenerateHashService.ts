/**
 * @description 描画で利用するFloat32Arrayからハッシュ値を生成します。
 *              Generates a hash value from the Float32Array used for drawing.
 *
 * @param  {Float32Array} buffer
 * @return {number}
 * @method
 * @protected
 */
export const execute = (buffer: Float32Array): number =>
{
    let hash = 2166136261; // FNV-1aオフセット basis
    for (let idx = 0; idx < buffer.length; ++idx) {

        let num = buffer[idx] | 0; // 整数として扱う

        // 32bit整数の各バイトを処理
        for (let i = 0; i < 4; i++) {
            const byte = num & 0xff;
            hash ^= byte;
            hash = Math.imul(hash, 16777619); // FNV-1a の FNV prime
            num >>>= 8;
        }
    }

    // 32bitの符号なし整数にキャストし、24bitの範囲に収める
    return (hash >>> 0) % 16777216;
};