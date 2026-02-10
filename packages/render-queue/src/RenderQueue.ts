import { $upperPowerOfTwo } from "./RenderQueueUtil";

class RenderQueue
{
    public buffer: Float32Array;
    public offset: number;

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
        this.buffer[this.offset++] = e1;
        this.buffer[this.offset++] = f1;
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
            this.resize(array.length);
        }

        this.buffer.set(array, this.offset);
        this.offset += array.length;
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
