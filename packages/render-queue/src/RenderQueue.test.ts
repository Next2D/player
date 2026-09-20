import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderQueue } from "./RenderQueue";

describe("render record packing", () =>
{
    let savedBuffer: Float32Array;
    let savedOffset: number;

    beforeEach(() =>
    {
        savedBuffer = renderQueue.buffer;
        savedOffset = renderQueue.offset;
        renderQueue.buffer = new Float32Array(256);
        renderQueue.offset = 0;
    });

    afterEach(() =>
    {
        vi.restoreAllMocks();
        renderQueue.buffer = savedBuffer;
        renderQueue.offset = savedOffset;
    });

    const bits = (array: Float32Array): Uint32Array => new Uint32Array(
        array.buffer, array.byteOffset, array.length
    );

    describe.each([
        ["pushDisplayObjectBuffer", 22],
        ["pushInstanceBuffer", 24],
        ["pushShapeBuffer", 32]
    ] as const)("%s (%i floats)", (method, length) =>
    {
        const append = (values: number[]): void =>
        {
            Reflect.apply(renderQueue[method], renderQueue, values);
        };
        const values = Array.from({ "length": length }, (_, index) => index / 7 - 0.25);

        it("preserves every float bit, prefix and suffix at a nonzero byte offset", () =>
        {
            const storage = new Float32Array(64).fill(-123.5);
            renderQueue.buffer = storage.subarray(5, 55);
            renderQueue.offset = 3;
            const buffer = renderQueue.buffer;
            const expected = storage.slice();
            const inputs = [...values];
            inputs.splice(0, 8, -0, 0, NaN, Infinity, -Infinity, 1e-45, 1e-50, 1e40);
            expected.set(inputs, 8);

            append(inputs);

            expect(renderQueue.buffer).toBe(buffer);
            expect(renderQueue.offset).toBe(3 + length);
            expect(bits(storage)).toEqual(bits(expected));
        });

        it("does not resize when the record exactly fills the buffer", () =>
        {
            renderQueue.buffer = new Float32Array(length);
            const buffer = renderQueue.buffer;
            const resize = vi.spyOn(renderQueue, "resize");

            append(values);

            expect(resize).not.toHaveBeenCalled();
            expect(renderQueue.buffer).toBe(buffer);
            expect(renderQueue.offset).toBe(length);
            expect(bits(buffer)).toEqual(bits(new Float32Array(values)));
        });

        it("writes into the replacement buffer after crossing the capacity by one float", () =>
        {
            renderQueue.buffer.fill(12.5);
            renderQueue.offset = 257 - length;
            const oldBuffer = renderQueue.buffer;
            const expected = new Float32Array(512);
            expected.set(oldBuffer);
            expected.set(values, renderQueue.offset);

            append(values);

            expect(renderQueue.buffer).not.toBe(oldBuffer);
            expect(renderQueue.buffer.length).toBe(512);
            expect(renderQueue.offset).toBe(257);
            expect(bits(renderQueue.buffer)).toEqual(bits(expected));
            expect(oldBuffer).toEqual(new Float32Array(256).fill(12.5));
        });

        it("grows an empty buffer", () =>
        {
            renderQueue.buffer = new Float32Array(0);
            append(values);
            expect(renderQueue.buffer.length).toBe(32);
            expect(renderQueue.offset).toBe(length);
            expect(bits(renderQueue.buffer.subarray(0, length))).toEqual(bits(new Float32Array(values)));
        });

        it("preserves consecutive records through repeated growth and a batch reset", () =>
        {
            const expected = new Float32Array(length * 1000);
            for (let index = 0; index < 1000; index++) {
                const record = values.map(value => value + index);
                append(record);
                expected.set(record, index * length);
            }
            expect(renderQueue.offset).toBe(expected.length);
            expect(bits(renderQueue.buffer.subarray(0, renderQueue.offset))).toEqual(bits(expected));

            const buffer = renderQueue.buffer;
            renderQueue.offset = 0;
            append(values);
            expect(renderQueue.buffer).toBe(buffer);
            expect(renderQueue.offset).toBe(length);
            expect(bits(buffer.subarray(0, length))).toEqual(bits(new Float32Array(values)));
            expect(bits(buffer.subarray(length, expected.length))).toEqual(bits(expected.subarray(length)));
        });

        it("leaves the queue untouched if allocation fails", () =>
        {
            renderQueue.offset = 255;
            const buffer = renderQueue.buffer;
            vi.spyOn(renderQueue, "resize").mockImplementation(() => { throw new Error("allocation failed"); });
            expect(() => append(values)).toThrow("allocation failed");
            expect(renderQueue.buffer).toBe(buffer);
            expect(renderQueue.offset).toBe(255);
            expect(buffer).toEqual(new Float32Array(256));
        });
    });

    it("keeps mixed WebGL/WebGPU records in order", () =>
    {
        renderQueue.push1(-1);
        Reflect.apply(renderQueue.pushDisplayObjectBuffer, renderQueue, Array.from({ "length": 22 }, (_, i) => i));
        Reflect.apply(renderQueue.pushInstanceBuffer, renderQueue, Array.from({ "length": 24 }, (_, i) => i + 22));
        renderQueue.push2(46, 47);
        expect(renderQueue.offset).toBe(49);
        expect(renderQueue.buffer.subarray(0, 49)).toEqual(
            new Float32Array([-1, ...Array.from({ "length": 48 }, (_, i) => i)])
        );
    });

    it("preserves shape headers and variable-length payloads across buffer growth", () =>
    {
        renderQueue.buffer = new Float32Array(32);
        const expected: number[] = [];
        for (let index = 0; index < 30; index++) {
            const header = Array.from({ "length": 32 }, (_, field) => field + index / 8);
            const payload = new Float32Array([index, -index, index / 3]);
            Reflect.apply(renderQueue.pushShapeBuffer, renderQueue, header);
            renderQueue.push1(payload.length);
            renderQueue.set(payload);
            renderQueue.push2(0, 1);
            expected.push(...header, payload.length, ...payload, 0, 1);
        }
        expect(renderQueue.offset).toBe(expected.length);
        expect(bits(renderQueue.buffer.subarray(0, renderQueue.offset))).toEqual(
            bits(new Float32Array(expected))
        );
    });
});
