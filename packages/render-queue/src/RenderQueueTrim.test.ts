import { beforeEach, describe, expect, it, vi } from "vitest";
import type { renderQueue as queueType } from "./RenderQueue";

describe("adaptive render queue capacity", () => {
    let queue: typeof queueType;
    beforeEach(async () => {
        vi.resetModules();
        queue = (await import("./RenderQueue")).renderQueue;
        queue.buffer = new Float32Array(524288);
    });
    const frame = (words = 70023): boolean => {
        queue.offset = 0;
        if (words > queue.buffer.length) queue.resize(words);
        queue.offset = words;
        const before = queue.buffer.length;
        queue.trim();
        return queue.buffer.length < before;
    };
    it("halves retained capacity only after sustained low usage and resets on high usage", () => {
        for (let i = 0; i < 119; i++) expect(frame()).toBe(false);
        frame(131072); // exactly one quarter interrupts the low-usage run
        for (let i = 0; i < 119; i++) expect(frame()).toBe(false);
        expect(frame()).toBe(true);
        expect(queue.buffer.byteLength).toBe(1048576);
        for (let i = 0; i < 1000; i++) expect(frame()).toBe(false);
    });
    it("backs off after rapid regrowth and recovers after a stable interval", () => {
        for (let i = 0; i < 120; i++) frame();
        frame(375000);
        for (let i = 0; i < 239; i++) expect(frame()).toBe(false);
        expect(frame()).toBe(true);
        for (let i = 0; i < 240; i++) frame();
        frame(375000);
        for (let i = 0; i < 119; i++) expect(frame()).toBe(false);
        expect(frame()).toBe(true);
    });
    it("avoids repeated shrink/regrow for a 121-message burst period", () => {
        let trims = 0;
        let grows = 0;
        for (let i = 0; i < 1210; i++) {
            const high = i % 121 === 0;
            if (high && queue.buffer.length < 375000) grows++;
            if (frame(high ? 375000 : 70023)) trims++;
        }
        expect(trims).toBe(1);
        expect(grows).toBe(1);
    });
    it("caps repeated backoff, including reuse of a larger returned buffer", () => {
        for (const delay of [120, 240, 480, 960, 1920, 1920]) {
            for (let i = 0; i < delay - 1; i++) expect(frame()).toBe(false);
            expect(frame()).toBe(true);
            queue.buffer = new Float32Array(524288);
            frame(375000);
        }
    });
    it("preserves raw NaN payloads, UTF-8 padding and subsequent records at a nonzero byteOffset", () => {
        const storage = new Uint32Array(4099).fill(0x7fa12345);
        queue.buffer = new Float32Array(storage.buffer, 12, 4096);
        queue.offset = 0;
        queue.set(new Float32Array(new Uint32Array([0x80000000, 0x7fc54321, 0xff800000]).buffer));
        const encoded = new TextEncoder().encode("漢🙂abcxyz");
        queue.push1(encoded.length);
        queue.setUint8(encoded);
        queue.push2(-0, 123.25);
        const words = queue.offset;
        const expected = new Uint8Array(storage.buffer, 12, words * 4).slice();
        const original = storage.slice();
        for (let i = 0; i < 120; i++) queue.trim();
        expect(queue.buffer.length).toBe(256);
        expect(new Uint8Array(queue.buffer.buffer, 0, words * 4)).toEqual(expected);
        expect(storage).toEqual(original);
        queue.set(new Float32Array(1000).fill(0.25));
        expect(new Uint8Array(queue.buffer.buffer, 0, words * 4)).toEqual(expected);
        expect(queue.offset).toBe(words + 1000);
    });
    it("does not advance on empty or detached queues, then accepts the returned buffer", () => {
        for (let i = 0; i < 119; i++) frame();
        queue.offset = 0;
        for (let i = 0; i < 200; i++) queue.trim();
        queue.offset = 70023;
        const transferred = structuredClone(queue.buffer, { transfer: [queue.buffer.buffer] });
        for (let i = 0; i < 200; i++) queue.trim();
        expect(queue.buffer.byteLength).toBe(0);
        queue.buffer = structuredClone(transferred, { transfer: [transferred.buffer] });
        queue.trim();
        expect(queue.buffer.byteLength).toBe(1048576);
    });
});
