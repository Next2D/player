import { $upperPowerOfTwo } from "../../core/src/CoreUtil";

/**
 * @description レンダーキューの管理クラス
 *              Management class of the render queue
 *
 * @class
 * @public
 */
class RenderQueue
{
    /**
     * @description バッファ
     *              Buffer
     *
     * @type {Float32Array}
     * @public
     */
    public buffer: Float32Array;

    /**
     * @description オフセット
     *              Offset
     *
     * @type {number}
     * @public
     */
    public offset: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.buffer = new Float32Array(256);
        this.offset = 0;
    }

    /**
     * @description バッファにデータを追加
     *              Add data to the buffer
     *
     * @param  {...number} args
     * @return {void}
     * @method
     * @public
     */
    push (...args: number[]): void
    {
        if (this.buffer.length < this.offset + args.length) {
            this.resize(args.length);
        }

        for (let idx = 0; idx < args.length; idx++) {
            this.buffer[this.offset++] = args[idx];
        }
    }

    /**
     * @description バッファをセット
     *              Set the buffer
     *
     * @param  {Float32Array | Uint8Array} args
     * @return {void}
     * @method
     * @public
     */
    set (array: Float32Array | Uint8Array): void
    {
        if (this.buffer.length < this.offset + array.length) {
            this.resize(array.length);
        }

        this.buffer.set(array, this.offset);
        this.offset += array.length;
    }

    /**
     * @description バッファをリサイズ
     *              Resize the buffer
     *
     * @param  {number} length
     * @return {void}
     * @method
     * @public
     */
    resize (length: number): void
    {
        const newBuffer = new Float32Array(
            $upperPowerOfTwo(this.offset + length)
        );

        if (this.buffer.length) {
            newBuffer.set(this.buffer);
        }
        this.buffer = newBuffer;
    }
}

export const renderQueue = new RenderQueue();