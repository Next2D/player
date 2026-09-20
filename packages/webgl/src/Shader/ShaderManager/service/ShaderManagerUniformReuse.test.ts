import { describe, expect, it, vi } from "vitest";
import type { IUniformData } from "../../../../../../e2e/fixtures/ExperimentalWebGLUniformData";
import { execute } from "../../../../../../e2e/fixtures/ExperimentalWebGLUniformInline";

const setup = (array: Float32Array | Int32Array = new Float32Array(4)) => {
    const data: IUniformData = { array, "assign": -1, "method": vi.fn() };
    const map = new Map([["u_test", data]]);
    return { data, "bind": () => execute(map) };
};

describe("experimental inline uniform upload reuse (not adopted)", () => {
    it.each([Float32Array, Int32Array])("uploads initial zeros and every changed element for %s", ArrayType => {
        const array = new ArrayType(16);
        const { data, bind } = setup(array);
        bind(); bind();
        expect(data.method).toHaveBeenCalledTimes(1);
        for (let i = 0; i < array.length; i++) {
            array[i] = i + 1;
            bind(); bind();
            expect(data.method).toHaveBeenCalledTimes(i + 2);
        }
        array.fill(0); bind(); bind();
        expect(data.method).toHaveBeenCalledTimes(18);
    });

    it("compares exact signed-zero, infinity and NaN bit patterns", () => {
        const array = new Float32Array(4);
        const bits = new Uint32Array(array.buffer);
        const { data, bind } = setup(array);
        for (const value of [0, 0x80000000, 0x7f800000, 0xff800000, 0x7fc00001, 0x7fc00002, 0]) {
            bits[0] = value;
            bind(); bind();
        }
        expect(data.method).toHaveBeenCalledTimes(7);
    });

    it("uses only the subarray byte range", () => {
        const array = new Float32Array(12);
        const { data, bind } = setup(array.subarray(4, 8));
        bind(); array[0] = 1; array[8] = 1; bind();
        expect(data.method).toHaveBeenCalledTimes(1);
        array[4] = 1; bind();
        expect(data.method).toHaveBeenCalledTimes(2);
    });

    it("invalidates on array identity, type, length and method replacement", () => {
        const { data, bind } = setup();
        bind(); bind();
        data.array = new Float32Array(4); bind(); bind();
        data.array = new Int32Array(4); bind(); bind();
        data.array = new Int32Array(8); bind(); bind();
        expect(data.method).toHaveBeenCalledTimes(4);
        data.method = vi.fn(); bind(); bind();
        expect(data.method).toHaveBeenCalledTimes(1);
    });

    it("keeps separate uniform and program state", () => {
        const method = vi.fn();
        const array = new Float32Array(4);
        const first = setup(array); const second = setup(array);
        first.data.method = method; second.data.method = method;
        first.bind(); second.bind(); first.bind(); second.bind();
        expect(method).toHaveBeenCalledTimes(2);
    });

    it("preserves positive assign count and invalidates before returning to negative", () => {
        const { data, bind } = setup();
        bind(); data.assign = 2; bind(); bind(); bind();
        expect(data.assign).toBe(0);
        expect(data.method).toHaveBeenCalledTimes(3);
        data.assign = -1; bind(); bind();
        expect(data.method).toHaveBeenCalledTimes(4);
    });

    it("never caches a failed upload", () => {
        const method = vi.fn().mockImplementationOnce(() => { throw new Error("upload"); });
        const { data, bind } = setup(); data.method = method;
        expect(bind).toThrow("upload"); bind(); bind();
        expect(method).toHaveBeenCalledTimes(2);
        data.array![3] = 2;
        method.mockImplementationOnce(() => { throw new Error("upload"); });
        expect(bind).toThrow("upload"); bind(); bind();
        expect(method).toHaveBeenCalledTimes(4);
    });

    it("keeps undefined-array fallback uncached", () => {
        const { data, bind } = setup(); bind();
        data.array = undefined; bind(); bind();
        data.array = new Float32Array(4); bind(); bind();
        expect(data.method).toHaveBeenCalledTimes(4);
    });
});
