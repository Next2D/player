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

    const view = new DataView(new ArrayBuffer(4));
    for (let idx = 0; idx < buffer.length; ++idx) {

        // Float32の値をそのままビット表現として使用
        view.setFloat32(0, buffer[idx], true);
        const bits = view.getUint32(0, true);

        // 32bitを4バイトに分解してFNV-1aハッシュ
        hash ^= bits & 0xff;
        hash = Math.imul(hash, 16777619);
        hash ^= (bits >>> 8) & 0xff;
        hash = Math.imul(hash, 16777619);
        hash ^= (bits >>> 16) & 0xff;
        hash = Math.imul(hash, 16777619);
        hash ^= (bits >>> 24) & 0xff;
        hash = Math.imul(hash, 16777619);
    }

    // 32bitハッシュ値を24bitに圧縮
    return ((hash >>> 8) ^ (hash & 0xff)) & 0xffffff;
};