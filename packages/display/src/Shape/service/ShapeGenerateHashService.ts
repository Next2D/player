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
    let hash = 0;
    for (let idx: number = 0; idx < buffer.length; idx++) {

        const chr: number = buffer[idx];

        hash  = (hash << 5) - hash + chr;
        hash |= 0;
    }

    return hash;
};