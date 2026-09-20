import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { renderQueue as queueType } from "./RenderQueue";

describe("bulk append growth", () => {
    let queue: typeof queueType;
    beforeEach(async () => {
        vi.resetModules();
        queue = (await import("./RenderQueue")).renderQueue;
    });
    afterEach(() => vi.unstubAllGlobals());
    const bytes = (view: Float32Array): Uint8Array => new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    const reference = (old: Float32Array, offset: number, words: number): Float32Array => {
        const result = new Float32Array(2 ** Math.ceil(Math.log2(offset + words)));
        result.set(old);
        return result;
    };
    it("keeps public resize's complete data preservation, including the unused suffix", () => {
        const storage = new Uint32Array(70).fill(0x7fa12345);
        queue.buffer = new Float32Array(storage.buffer, 12, 64);
        queue.offset = 3;
        const old = queue.buffer;
        queue.resize(100);
        expect(bytes(queue.buffer).subarray(0, old.byteLength)).toEqual(bytes(old));
        expect(queue.offset).toBe(3);
    });
    it("matches full-copy growth for Float32 and byte-to-float appends, including aliasing", () => {
        let seed = 12345;
        const random = (): number => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0);
        for (let trial = 0; trial < 600; trial++) {
            const length = [16, 64, 256][trial % 3];
            const storage = new Uint32Array(length + 5);
            for (let i = 0; i < storage.length; i++) storage[i] = random();
            storage.set([0x80000000, 0x7fa12345, 0xffc54321, 0x7f800000], 3);
            queue.buffer = new Float32Array(storage.buffer, 12, length);
            queue.offset = 1 + random() % (length - 1);
            const offset = queue.offset;
            const old = queue.buffer;
            const oldBytes = bytes(old).slice();
            const source = trial % 2 ? new Uint8Array(storage.buffer, 12, length) : old;
            const expected = reference(old, offset, source.length);
            expected.set(source, offset);
            queue.set(source);
            expect(bytes(queue.buffer)).toEqual(bytes(expected));
            expect(queue.offset).toBe(offset + source.length);
            expect(bytes(old)).toEqual(oldBytes);
        }
    });
    it("matches every output byte for packed appends across all padding lengths and offsets", () => {
        for (let trial = 0; trial < 1000; trial++) {
            const length = [16, 64, 256][trial % 3];
            const storage = new Uint32Array(length + 3).fill(0x7fa12345);
            queue.buffer = new Float32Array(storage.buffer, 12, length);
            queue.offset = trial % length;
            const old = queue.buffer;
            const offset = queue.offset;
            const source = new Uint8Array(length * 4 + 1 + trial % 4);
            for (let i = 0; i < source.length; i++) source[i] = (i * 13 + trial) & 255;
            const words = Math.ceil(source.length / 4);
            const expected = reference(old, offset, words);
            new Uint8Array(expected.buffer, offset * 4, source.length).set(source);
            queue.setUint8(source);
            expect(bytes(queue.buffer)).toEqual(bytes(expected));
            expect(queue.offset).toBe(offset + words);
            queue.push1(-0);
            expect(new Uint32Array(queue.buffer.buffer)[offset + words]).toBe(0x80000000);
        }
    });
    it("preserves a packed source that aliases the old buffer's unused suffix", () => {
        const storage = new Uint8Array(256);
        for (let i = 0; i < storage.length; i++) storage[i] = i;
        queue.buffer = new Float32Array(storage.buffer);
        queue.offset = 16;
        const source = storage.subarray(8);
        const expected = reference(queue.buffer, 16, Math.ceil(source.length / 4));
        new Uint8Array(expected.buffer, 64, source.length).set(source);
        queue.setUint8(source);
        expect(bytes(queue.buffer)).toEqual(bytes(expected));
        expect(storage).toEqual(Uint8Array.from({ length: 256 }, (_, i) => i));
    });
    it("leaves the owned buffer and offset untouched when allocation fails", () => {
        for (const packed of [false, true]) {
            const source = new Uint8Array(2048);
            const original = new Float32Array(64).fill(12.25);
            queue.buffer = original; queue.offset = 12;
            vi.stubGlobal("Float32Array", vi.fn(function () { throw new Error("allocation refused"); }));
            expect(() => packed ? queue.setUint8(source) : queue.set(source)).toThrow("allocation refused");
            vi.unstubAllGlobals();
            expect(queue.buffer).toBe(original);
            expect(queue.offset).toBe(12);
            expect(Array.from(original)).toEqual(Array(64).fill(12.25));
        }
    });
    it("can grow a detached queue with the same zero-filled prefix semantics", () => {
        queue.buffer = new Float32Array(64);
        structuredClone(queue.buffer, { transfer: [queue.buffer.buffer] });
        queue.offset = 3;
        queue.set(new Float32Array([1, 2, 3, 4]));
        expect(Array.from(queue.buffer)).toEqual([0, 0, 0, 1, 2, 3, 4, 0]);
        expect(queue.offset).toBe(7);
    });
});
