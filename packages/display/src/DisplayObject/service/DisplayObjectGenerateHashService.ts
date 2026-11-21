/**
 * @description 描画で利用するFloat32Arrayからハッシュ値を生成します。
 *              Generates a hash value from the Float32Array used for drawing.
 *
 *              図形を初めて描くときに、その描画データ全体に対して呼ばれる。1 バイトごとに乗算する
 *              FNV-1a では 1 要素につき 4 回の乗算になり、画面を切り替えた直後のフレームで目立つ
 *              時間を取っていた。1 要素 (32bit) につき乗算 1 回にし、乗算では上位ビットの違いが
 *              下位へ伝わらないので、毎回上位ビットを下位へ折り返して混ぜる。
 *              (折り返しが無いと、符号ビットだけが 2 か所で異なるデータ = 反転した図形 が同じ値になる)
 *
 *              Called over the whole drawing data the first time a shape is drawn. Byte-wise FNV-1a
 *              costs four multiplications per element, which took a noticeable share of the frame
 *              right after a screen change. This uses one multiplication per 32-bit element and
 *              folds the high bits down after each one, because a multiplication never carries
 *              differences in high bits downwards (without the fold, data differing only in the sign
 *              bit at two places, i.e. mirrored shapes, would produce the same value).
 *
 * @param  {Float32Array} buffer
 * @return {number}
 * @method
 * @protected
 */
export const execute = (buffer: Float32Array): number =>
{
    // Float32ArrayのバッファをUint32Arrayとして直接参照（DataView不要）
    const bits = new Uint32Array(buffer.buffer, buffer.byteOffset, buffer.length);
    const len = bits.length;

    // 長さも混ぜる (末尾に 0 が続くデータを区別する)
    let hash = 2166136261 ^ len;
    let idx = 0;

    // 4要素ずつ処理（ループアンローリング）
    const unrolledEnd = len & ~3;
    while (idx < unrolledEnd) {
        hash = Math.imul(hash ^ bits[idx], 0x9E3779B1);
        hash ^= hash >>> 15;
        hash = Math.imul(hash ^ bits[idx + 1], 0x9E3779B1);
        hash ^= hash >>> 15;
        hash = Math.imul(hash ^ bits[idx + 2], 0x9E3779B1);
        hash ^= hash >>> 15;
        hash = Math.imul(hash ^ bits[idx + 3], 0x9E3779B1);
        hash ^= hash >>> 15;
        idx += 4;
    }

    // 残り (0〜3要素)
    while (idx < len) {
        hash = Math.imul(hash ^ bits[idx++], 0x9E3779B1);
        hash ^= hash >>> 15;
    }

    // 仕上げの攪拌
    hash = Math.imul(hash ^ hash >>> 16, 0x85EBCA6B);
    hash ^= hash >>> 13;

    // 32bitハッシュ値を24bitに圧縮
    return (hash >>> 8 ^ hash & 0xff) & 0xffffff;
};
