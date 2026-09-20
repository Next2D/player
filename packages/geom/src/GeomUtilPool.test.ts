import { beforeEach, describe, expect, it, vi } from "vitest";

describe("six-float matrix pool", () =>
{
    let pool: typeof import("./GeomUtil");
    beforeEach(async () => {
        vi.resetModules();
        pool = await import("./GeomUtil");
    });
    const bits = (array: Float32Array): Uint32Array => new Uint32Array(
        array.buffer, array.byteOffset, array.length
    );

    it("creates independent identity buffers when none have been returned", () =>
    {
        const a = pool.$getFloat32Array6();
        const b = pool.$getFloat32Array6();
        expect(a).not.toBe(b);
        expect(a).toEqual(new Float32Array([1, 0, 0, 1, 0, 0]));
        expect(b).toEqual(a);
    });

    it("reuses the last returned buffer and overwrites all six Float32 values", () =>
    {
        const array = pool.$getFloat32Array6(1, 2, 3, 4, 5, 6);
        pool.$poolFloat32Array6(array);
        const values = [-0, NaN, Infinity, -Infinity, 1e-45, 1e40] as const;
        const reused = pool.$getFloat32Array6(...values);
        expect(reused).toBe(array);
        expect(bits(reused)).toEqual(bits(new Float32Array(values)));
        pool.$poolFloat32Array6(reused);
        expect(pool.$getFloat32Array6()).toEqual(new Float32Array([1, 0, 0, 1, 0, 0]));
    });

    it("preserves LIFO identity through consecutive returns and loans", () =>
    {
        const arrays = Array.from({ "length": 20 }, () => pool.$getFloat32Array6());
        for (const array of arrays) pool.$poolFloat32Array6(array);
        for (const array of arrays.toReversed()) expect(pool.$getFloat32Array6()).toBe(array);
    });

    it("keeps checked-out outer matrices intact during nested use", () =>
    {
        const cached = pool.$getFloat32Array6();
        pool.$poolFloat32Array6(cached);
        const outer = pool.$getFloat32Array6(2, 3, 4, 5, 6, 7);
        const expected = outer.slice();
        for (let index = 0; index < 100; index++) {
            const nested = pool.$getFloat32Array6(index, 0, 0, index, index, index);
            expect(nested).not.toBe(outer);
            pool.$poolFloat32Array6(nested);
            expect(bits(outer)).toEqual(bits(expected));
        }
        pool.$poolFloat32Array6(outer);
        expect(pool.$getFloat32Array6()).toBe(outer);
    });

    it("matches a reference LIFO stack across 5,000 interleaved operations", () =>
    {
        const available: Float32Array[] = [];
        const inUse: Float32Array[] = [];
        let seed = 9127;
        for (let index = 0; index < 5000; index++) {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            if (inUse.length && (seed & 3) !== 0) {
                const position = seed % inUse.length;
                const [array] = inUse.splice(position, 1);
                pool.$poolFloat32Array6(array);
                available.push(array);
            } else {
                const expected = available.pop();
                const actual = pool.$getFloat32Array6(index, -index, 1 / 3, 1e-50, 1e40, -0);
                if (expected) expect(actual).toBe(expected);
                expect(inUse).not.toContain(actual);
                expect(bits(actual)).toEqual(bits(new Float32Array([index, -index, 1 / 3, 1e-50, 1e40, -0])));
                inUse.push(actual);
            }
        }
    });

    it("does not mix six-float and eight-float pools", () =>
    {
        const six = pool.$getFloat32Array6();
        const eight = pool.$getFloat32Array8();
        pool.$poolFloat32Array6(six);
        pool.$poolFloat32Array8(eight);
        expect(pool.$getFloat32Array6()).toBe(six);
        expect(pool.$getFloat32Array8()).toBe(eight);
    });
});
