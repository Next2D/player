import type { IFillType } from "./interface/IFillType";

/**
 * @description 指定された値を2の累乗に切り上げます。
 *              Rounds the specified value up to a power of two.
 *
 * @param  {number} v
 * @return {number}
 * @method
 * @protected
 */
export const $upperPowerOfTwo = (v: number): number =>
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};

/**
 * @type {Float32Array}
 * @private
 */
let $fillBuffer: Float32Array = new Float32Array(128);

/**
 * @type {number}
 * @private
 */
let $fillBufferOffset: number = 0;

/**
 * @description バッファを埋めるデータを返却
 *              Returns the data to fill the buffer
 *
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getFillBuffer = (): Float32Array =>
{
    return $fillBuffer;
};

/**
 * @description バッファを埋めるデータのオフセットを返却
 *              Returns the offset of the data to fill the buffer
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getFillBufferOffset = (): number =>
{
    return $fillBufferOffset;
};

/**
 * @description バッファを埋めるデータを設定
 *              Set the data to fill the buffer
 *
 * @param  {Float32Array} buffer
 * @return {void}
 * @method
 * @protected
 */
export const $addFillBuffer = (buffer: Float32Array): void =>
{
    const length = buffer.length + $fillBufferOffset;
    if (length > $fillBuffer.length) {
        const newBuffer = new Float32Array($upperPowerOfTwo(length));
        if ($fillBufferOffset > 0) {
            newBuffer.set($fillBuffer.subarray(0, $fillBufferOffset));
        }
        newBuffer.set(buffer, $fillBufferOffset);

        $fillBuffer = newBuffer;
    } else {
        $fillBuffer.set(buffer, $fillBufferOffset);
    }

    $fillBufferOffset += buffer.length;
};

/**
 * @description 塗りのバッファに、あと size 要素を書けるだけの領域を確保する (内容は保つ)。
 *              確保した後、$getFillBuffer() の $getFillBufferOffset() の位置から直接書き、
 *              $advanceFillBuffer(size) で位置を進める。
 *              Reserves room for `size` more elements in the fill buffer, keeping its content.
 *              Then write directly from $getFillBufferOffset() of $getFillBuffer() and advance
 *              the position with $advanceFillBuffer(size).
 *
 * @param  {number} size
 * @return {void}
 * @method
 * @protected
 */
export const $reserveFillBuffer = (size: number): void =>
{
    const length = size + $fillBufferOffset;
    if (length > $fillBuffer.length) {
        const newBuffer = new Float32Array($upperPowerOfTwo(length));
        if ($fillBufferOffset > 0) {
            newBuffer.set($fillBuffer.subarray(0, $fillBufferOffset));
        }
        $fillBuffer = newBuffer;
    }
};

/**
 * @description 塗りのバッファの書き込み位置を size 要素だけ進める
 *              Advances the write position of the fill buffer by `size` elements
 *
 * @param  {number} size
 * @return {void}
 * @method
 * @protected
 */
export const $advanceFillBuffer = (size: number): void =>
{
    $fillBufferOffset += size;
};

/**
 * @description バッファを頂点数の配列
 *              Array of the number of vertices in the buffer
 *
 * @type {number[]}
 * @protected
 */
export const $fillBufferIndexes: number[] = [];

/**
 * @description 塗りの種類の配列
 *              Array of fill types
 *
 * @type {IFillType[]}
 * @protected
 */
export const $fillTypes: IFillType[] = [];

/**
 * @description 頂点情報の設定値を初期化
 *              Initializes the setting value of the vertex information
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearFillBufferSetting = (): void =>
{
    $fillTypes.length = 0;

    // fill
    $fillBufferOffset = 0;
    $fillBufferIndexes.length = 0;
};

/**
 * @description メッシュ生成用の再利用可能な一時バッファ（GC回避）
 *              Reusable temporary buffer for mesh generation (avoid GC)
 *
 * @type {Float32Array}
 * @private
 */
let $meshTempBuffer: Float32Array = new Float32Array(32);

/**
 * @description 必要なサイズの一時バッファを取得（必要に応じて拡張）
 *              Get temporary buffer of required size (expand if necessary)
 *
 * @param  {number} size
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getMeshTempBuffer = (size: number): Float32Array =>
{
    if ($meshTempBuffer.length < size) {
        $meshTempBuffer = new Float32Array($upperPowerOfTwo(size));
    }
    return $meshTempBuffer;
};