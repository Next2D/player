import { $upperPowerOfTwo } from "./RenderQueueUtil";

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
     * @description Shape用のバッファを追加
     *              Add buffer for Shape
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @param  {number} g
     * @param  {number} h
     * @param  {number} i
     * @param  {number} j
     * @param  {number} k
     * @param  {number} l
     * @param  {number} m
     * @param  {number} n
     * @param  {number} o
     * @param  {number} p
     * @param  {number} q
     * @param  {number} r
     * @param  {number} s
     * @param  {number} t
     * @param  {number} u
     * @param  {number} v
     * @param  {number} w
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @param  {number} a1
     * @param  {number} b1
     * @param  {number} c1
     * @return {void}
     * @method
     * @public
     */
    pushShapeBuffer (
        a: number, b: number, c: number, d: number, e: number, f: number,
        g: number, h: number, i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number, q: number, r: number,
        s: number, t: number, u: number, v: number, w: number, x: number,
        y: number, z: number, a1: number, b1: number, c1: number
    ): void {
        if (this.buffer.length < this.offset + 29) {
            this.resize(29);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
        this.buffer[this.offset++] = d;
        this.buffer[this.offset++] = e;
        this.buffer[this.offset++] = f;
        this.buffer[this.offset++] = g;
        this.buffer[this.offset++] = h;
        this.buffer[this.offset++] = i;
        this.buffer[this.offset++] = j;
        this.buffer[this.offset++] = k;
        this.buffer[this.offset++] = l;
        this.buffer[this.offset++] = m;
        this.buffer[this.offset++] = n;
        this.buffer[this.offset++] = o;
        this.buffer[this.offset++] = p;
        this.buffer[this.offset++] = q;
        this.buffer[this.offset++] = r;
        this.buffer[this.offset++] = s;
        this.buffer[this.offset++] = t;
        this.buffer[this.offset++] = u;
        this.buffer[this.offset++] = v;
        this.buffer[this.offset++] = w;
        this.buffer[this.offset++] = x;
        this.buffer[this.offset++] = y;
        this.buffer[this.offset++] = z;
        this.buffer[this.offset++] = a1;
        this.buffer[this.offset++] = b1;
        this.buffer[this.offset++] = c1;
    }

    /**
     * @description TextField用のバッファを追加
     *              Add buffer for TextField
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @param  {number} g
     * @param  {number} h
     * @param  {number} i
     * @param  {number} j
     * @param  {number} k
     * @param  {number} l
     * @param  {number} m
     * @param  {number} n
     * @param  {number} o
     * @param  {number} p
     * @param  {number} q
     * @param  {number} r
     * @param  {number} s
     * @param  {number} t
     * @param  {number} u
     * @param  {number} v
     * @param  {number} w
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @param  {number} a1
     * @return {void}
     * @method
     * @public
     */
    pushTextFieldBuffer (
        a: number, b: number, c: number, d: number, e: number, f: number,
        g: number, h: number, i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number, q: number, r: number,
        s: number, t: number, u: number, v: number, w: number, x: number,
        y: number, z: number, a1: number
    ): void {
        if (this.buffer.length < this.offset + 27) {
            this.resize(27);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
        this.buffer[this.offset++] = d;
        this.buffer[this.offset++] = e;
        this.buffer[this.offset++] = f;
        this.buffer[this.offset++] = g;
        this.buffer[this.offset++] = h;
        this.buffer[this.offset++] = i;
        this.buffer[this.offset++] = j;
        this.buffer[this.offset++] = k;
        this.buffer[this.offset++] = l;
        this.buffer[this.offset++] = m;
        this.buffer[this.offset++] = n;
        this.buffer[this.offset++] = o;
        this.buffer[this.offset++] = p;
        this.buffer[this.offset++] = q;
        this.buffer[this.offset++] = r;
        this.buffer[this.offset++] = s;
        this.buffer[this.offset++] = t;
        this.buffer[this.offset++] = u;
        this.buffer[this.offset++] = v;
        this.buffer[this.offset++] = w;
        this.buffer[this.offset++] = x;
        this.buffer[this.offset++] = y;
        this.buffer[this.offset++] = z;
        this.buffer[this.offset++] = a1;
    }

    /**
     * @description Video用のバッファを追加
     *              Add buffer for Video
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @param  {number} g
     * @param  {number} h
     * @param  {number} i
     * @param  {number} j
     * @param  {number} k
     * @param  {number} l
     * @param  {number} m
     * @param  {number} n
     * @param  {number} o
     * @param  {number} p
     * @param  {number} q
     * @param  {number} r
     * @param  {number} s
     * @param  {number} t
     * @param  {number} u
     * @param  {number} v
     * @param  {number} w
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @return {void}
     * @method
     * @public
     */
    pushVideoBuffer (
        a: number, b: number, c: number, d: number, e: number, f: number,
        g: number, h: number, i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number, q: number, r: number,
        s: number, t: number, u: number, v: number, w: number, x: number,
        y: number, z: number
    ): void {
        if (this.buffer.length < this.offset + 26) {
            this.resize(26);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
        this.buffer[this.offset++] = d;
        this.buffer[this.offset++] = e;
        this.buffer[this.offset++] = f;
        this.buffer[this.offset++] = g;
        this.buffer[this.offset++] = h;
        this.buffer[this.offset++] = i;
        this.buffer[this.offset++] = j;
        this.buffer[this.offset++] = k;
        this.buffer[this.offset++] = l;
        this.buffer[this.offset++] = m;
        this.buffer[this.offset++] = n;
        this.buffer[this.offset++] = o;
        this.buffer[this.offset++] = p;
        this.buffer[this.offset++] = q;
        this.buffer[this.offset++] = r;
        this.buffer[this.offset++] = s;
        this.buffer[this.offset++] = t;
        this.buffer[this.offset++] = u;
        this.buffer[this.offset++] = v;
        this.buffer[this.offset++] = w;
        this.buffer[this.offset++] = x;
        this.buffer[this.offset++] = y;
        this.buffer[this.offset++] = z;
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