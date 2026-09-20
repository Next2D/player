import { $upperPowerOfTwo } from "./RenderQueueUtil";

class RenderQueue
{
    public buffer: Float32Array;
    public offset: number;

    private _lowUsageFrames: number = 0;
    private _trimDelay: number = 120;
    private _trimmedLength: number = 0;
    private _framesSinceTrim: number = 0;

    constructor ()
    {
        this.buffer = new Float32Array(256);
        this.offset = 0;
    }

    push (...args: number[]): void
    {
        if (this.buffer.length < this.offset + args.length) {
            this.resize(args.length);
        }

        for (let idx = 0; idx < args.length; idx++) {
            this.buffer[this.offset++] = args[idx];
        }
    }

    push1 (a: number): void
    {
        if (this.buffer.length < this.offset + 1) {
            this.resize(1);
        }

        this.buffer[this.offset++] = a;
    }

    push2 (a: number, b: number): void
    {
        if (this.buffer.length < this.offset + 2) {
            this.resize(2);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
    }

    push4 (a: number, b: number, c: number, d: number): void
    {
        if (this.buffer.length < this.offset + 4) {
            this.resize(4);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
        this.buffer[this.offset++] = d;
    }

    push5 (a: number, b: number, c: number, d: number, e: number): void
    {
        if (this.buffer.length < this.offset + 5) {
            this.resize(5);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
        this.buffer[this.offset++] = d;
        this.buffer[this.offset++] = e;
    }

    push7 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number
    ): void {
        if (this.buffer.length < this.offset + 7) {
            this.resize(7);
        }

        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
        this.buffer[this.offset++] = d;
        this.buffer[this.offset++] = e;
        this.buffer[this.offset++] = f;
        this.buffer[this.offset++] = g;
    }

    push9 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number
    ): void {
        if (this.buffer.length < this.offset + 9) {
            this.resize(9);
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
    }

    push18 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number
    ): void {
        if (this.buffer.length < this.offset + 18) {
            this.resize(18);
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
    }

    push19 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number, s: number
    ): void {
        if (this.buffer.length < this.offset + 19) {
            this.resize(19);
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
    }

    push24 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number, s: number, t: number,
        u: number, v: number, w: number, x: number
    ): void {
        if (this.buffer.length < this.offset + 24) {
            this.resize(24);
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
    }

    push27 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number, s: number, t: number,
        u: number, v: number, w: number, x: number,
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

    push28 (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number, s: number, t: number,
        u: number, v: number, w: number, x: number,
        y: number, z: number, a1: number, b1: number
    ): void {
        if (this.buffer.length < this.offset + 28) {
            this.resize(28);
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
    }

    pushDisplayObjectBuffer (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number, s: number, t: number,
        u: number, v: number
    ): void {
        if (this.buffer.length < this.offset + 22) {
            this.resize(22);
        }

        const buffer = this.buffer;
        const offset = this.offset;
        buffer[offset] = a;
        buffer[offset + 1] = b;
        buffer[offset + 2] = c;
        buffer[offset + 3] = d;
        buffer[offset + 4] = e;
        buffer[offset + 5] = f;
        buffer[offset + 6] = g;
        buffer[offset + 7] = h;
        buffer[offset + 8] = i;
        buffer[offset + 9] = j;
        buffer[offset + 10] = k;
        buffer[offset + 11] = l;
        buffer[offset + 12] = m;
        buffer[offset + 13] = n;
        buffer[offset + 14] = o;
        buffer[offset + 15] = p;
        buffer[offset + 16] = q;
        buffer[offset + 17] = r;
        buffer[offset + 18] = s;
        buffer[offset + 19] = t;
        buffer[offset + 20] = u;
        buffer[offset + 21] = v;
        this.offset = offset + 22;
    }

    pushInstanceBuffer (
        a: number, b: number, c: number, d: number,
        e: number, f: number, g: number, h: number,
        i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number,
        q: number, r: number, s: number, t: number,
        u: number, v: number, w: number, x: number
    ): void {
        if (this.buffer.length < this.offset + 24) {
            this.resize(24);
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
    }

    pushShapeBuffer (
        a: number, b: number, c: number, d: number, e: number, f: number,
        g: number, h: number, i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number, q: number, r: number,
        s: number, t: number, u: number, v: number, w: number, x: number,
        y: number, z: number, a1: number, b1: number, c1: number,
        d1: number, e1: number, f1: number
    ): void {
        if (this.buffer.length < this.offset + 32) {
            this.resize(32);
        }

        const buffer = this.buffer;
        const offset = this.offset;
        buffer[offset] = a;
        buffer[offset + 1] = b;
        buffer[offset + 2] = c;
        buffer[offset + 3] = d;
        buffer[offset + 4] = e;
        buffer[offset + 5] = f;
        buffer[offset + 6] = g;
        buffer[offset + 7] = h;
        buffer[offset + 8] = i;
        buffer[offset + 9] = j;
        buffer[offset + 10] = k;
        buffer[offset + 11] = l;
        buffer[offset + 12] = m;
        buffer[offset + 13] = n;
        buffer[offset + 14] = o;
        buffer[offset + 15] = p;
        buffer[offset + 16] = q;
        buffer[offset + 17] = r;
        buffer[offset + 18] = s;
        buffer[offset + 19] = t;
        buffer[offset + 20] = u;
        buffer[offset + 21] = v;
        buffer[offset + 22] = w;
        buffer[offset + 23] = x;
        buffer[offset + 24] = y;
        buffer[offset + 25] = z;
        buffer[offset + 26] = a1;
        buffer[offset + 27] = b1;
        buffer[offset + 28] = c1;
        buffer[offset + 29] = d1;
        buffer[offset + 30] = e1;
        buffer[offset + 31] = f1;
        this.offset = offset + 32;
    }

    pushTextFieldBuffer (
        a: number, b: number, c: number, d: number, e: number, f: number,
        g: number, h: number, i: number, j: number, k: number, l: number,
        m: number, n: number, o: number, p: number, q: number, r: number,
        s: number, t: number, u: number, v: number, w: number, x: number,
        y: number, z: number, a1: number, b1: number, c1: number, d1: number
    ): void {
        if (this.buffer.length < this.offset + 30) {
            this.resize(30);
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
        this.buffer[this.offset++] = d1;
    }

    pushVideoBuffer (
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

    set (array: Float32Array | Uint8Array): void
    {
        if (this.buffer.length < this.offset + array.length) {
            this._resizeForAppend(array.length);
        }

        this.buffer.set(array, this.offset);
        this.offset += array.length;
    }

    setUint8 (array: Uint8Array): void
    {
        // バイト列を1要素=1floatに展開せず、1float(4バイト)に4バイト詰めて書き込む。
        // 読み出し側は同じ位置にUint8Arrayビューを作って復元する。
        // Pack 4 bytes into each float slot instead of expanding each byte to a
        // float. The reader reconstructs the bytes with a Uint8Array view.
        const words = Math.ceil(array.length / 4);
        if (this.buffer.length < this.offset + words) {
            this._resizeForAppend(words);
        }

        new Uint8Array(
            this.buffer.buffer,
            this.buffer.byteOffset + this.offset * 4,
            array.length
        ).set(array);

        this.offset += words;
    }

    trim (): void
    {
        const length = this.buffer.length;
        if (!this.offset || this.offset > length) {
            return;
        }

        // A quick regrowth (including a larger returned capture buffer) backs
        // off the next trim. A stable interval restores the normal delay.
        if (this._trimmedLength) {
            if (length > this._trimmedLength) {
                this._trimDelay = Math.min(this._trimDelay * 2, 1920);
                this._trimmedLength = 0;
                this._lowUsageFrames = 0;
            } else if (++this._framesSinceTrim >= this._trimDelay) {
                this._trimDelay = 120;
                this._trimmedLength = 0;
            }
        }

        if (this.offset >= length / 4) {
            this._lowUsageFrames = 0;
            return;
        }
        if (++this._lowUsageFrames < this._trimDelay) {
            return;
        }
        this._lowUsageFrames = 0;

        const target = Math.max(256, $upperPowerOfTwo(this.offset * 2));
        if (target >= length) {
            return;
        }
        const buffer = new Float32Array(target);
        new Uint8Array(buffer.buffer, 0, this.offset * 4).set(new Uint8Array(
            this.buffer.buffer, this.buffer.byteOffset, this.offset * 4
        ));
        this.buffer = buffer;
        this._trimmedLength = target;
        this._framesSinceTrim = 0;
    }

    private _resizeForAppend (length: number): void
    {
        const buffer = new Float32Array(
            $upperPowerOfTwo(this.offset + length)
        );
        // The following bulk append overwrites the unused suffix. Keep the
        // public resize method's full-buffer preservation contract unchanged.
        if (this.buffer.length && this.offset) {
            buffer.set(this.buffer.subarray(0, this.offset));
        }
        this.buffer = buffer;
    }

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
