import type { IFillType } from "./interface/IFillType";

/**
 * @description 指定された値を2の累乗に切り上げます
 * @param {number} v
 * @return {number}
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
 * @return {Float32Array}
 */
export const $getFillBuffer = (): Float32Array =>
{
    return $fillBuffer;
};

/**
 * @description バッファを埋めるデータのオフセットを返却
 * @return {number}
 */
export const $getFillBufferOffset = (): number =>
{
    return $fillBufferOffset;
};

/**
 * @description バッファを埋めるデータを設定
 * @param {Float32Array} buffer
 * @return {void}
 */
export const $addFillBuffer = (buffer: Float32Array): void =>
{
    const length = buffer.length + $fillBufferOffset;
    if (length > $fillBuffer.length) {
        const newBuffer = new Float32Array($upperPowerOfTwo(length));
        newBuffer.set($fillBuffer);
        newBuffer.set(buffer, $fillBufferOffset);

        $fillBuffer = newBuffer;
    } else {
        $fillBuffer.set(buffer, $fillBufferOffset);
    }

    $fillBufferOffset += buffer.length;
};

/**
 * @description バッファを頂点数の配列
 * @type {number[]}
 */
export const $fillBufferIndexes: number[] = [];

/**
 * @description 塗りの種類の配列
 * @type {IFillType[]}
 */
export const $fillTypes: IFillType[] = [];

/**
 * @description 頂点情報の設定値を初期化
 * @return {void}
 */
export const $clearFillBufferSetting = (): void =>
{
    $fillTypes.length = 0;
    $fillBufferOffset = 0;
    $fillBufferIndexes.length = 0;
};
