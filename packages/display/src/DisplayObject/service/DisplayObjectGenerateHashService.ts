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
    // Float32ArrayのバッファをUint32Arrayとして直接参照（DataView不要）
    const bits = new Uint32Array(buffer.buffer, buffer.byteOffset, buffer.length);
    const len = bits.length;

    let hash = 2166136261; // FNV-1aオフセット basis
    let idx = 0;

    // 8要素ずつ処理（ループアンローリング）
    const unrolledEnd = len & ~7; // len - (len % 8)
    while (idx < unrolledEnd) {
        let b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);

        b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);
    }

    // 残り (0〜7要素)
    while (idx < len) {
        const b = bits[idx++];
        hash = Math.imul(hash ^ (b & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 8 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >> 16 & 0xff), 16777619);
        hash = Math.imul(hash ^ (b >>> 24), 16777619);
    }

    // 32bitハッシュ値を24bitに圧縮
    return hash >>> 8 ^ hash & 0xff & 0xffffff;
};