import { execute } from "./MeshFillGenerateService";
import { describe, expect, it } from "vitest";
import type { IPath } from "../../interface/IPath";

/**
 * 1 頂点 (17 要素) を 1 つずつ書き込む素直な実装。execute はこれと同じ内容を、
 * 色と行列をひな形からまとめて複写して書く。
 */
const reference = (
    vertex: IPath, buffer: Float32Array, index: number,
    a: number, b: number, c: number, d: number, tx: number, ty: number,
    red: number, green: number, blue: number, alpha: number
): number => {

    const put = (position: number, x: number, y: number, u: number, v: number): void =>
    {
        const values = [x, y, u, v, red, green, blue, alpha, a, b, 0, c, d, 0, tx, ty, 0];
        for (let idx = 0; idx < values.length; ++idx) {
            buffer[position + idx] = values[idx];
        }
    };

    const length = vertex.length - 5;
    for (let idx = 3; idx < length; idx += 3) {
        const position = index * 17;
        if (vertex[idx + 2]) {
            put(position, vertex[idx - 3] as number, vertex[idx - 2] as number, 0, 0);
            put(position + 17, vertex[idx] as number, vertex[idx + 1] as number, 0.5, 0);
            put(position + 34, vertex[idx + 3] as number, vertex[idx + 4] as number, 1, 1);
        } else if (vertex[idx + 5]) {
            put(position, vertex[0] as number, vertex[1] as number, 0.5, 0.5);
            put(position + 17, vertex[idx] as number, vertex[idx + 1] as number, 0.5, 0.5);
            put(position + 34, vertex[idx + 6] as number, vertex[idx + 7] as number, 0.5, 0.5);
        } else {
            put(position, vertex[0] as number, vertex[1] as number, 0.5, 0.5);
            put(position + 17, vertex[idx] as number, vertex[idx + 1] as number, 0.5, 0.5);
            put(position + 34, vertex[idx + 3] as number, vertex[idx + 4] as number, 0.5, 0.5);
        }
        index += 3;
    }
    return index;
};

// 再現できる乱数 (mulberry32)
const random = (seed: number): (() => number) =>
{
    return (): number => {
        seed |= 0;
        seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

// 直線と曲線が混ざったパスを作る (制御点は連続しない。先頭と末尾は制御点にしない)
const makePath = (next: () => number, points: number): IPath =>
{
    const path: IPath = [];
    let previousIsControl = true;
    for (let idx = 0; idx < points; ++idx) {
        const control = !previousIsControl && idx < points - 1 && next() < 0.4;
        path.push(next() * 400 - 200, next() * 400 - 200, control);
        previousIsControl = control;
    }
    return path;
};

describe("MeshFillGenerateService.js equivalence test", () =>
{
    it("writes exactly the same vertices as the straightforward implementation", () =>
    {
        const next = random(51);
        for (let count = 0; count < 200; ++count) {
            const path = makePath(next, 3 + Math.floor(next() * 40));
            const size = (path.length / 3 - 2) * 51;
            const args: [number, number, number, number, number, number, number, number, number, number] = [
                next() * 2 - 1, next() * 2 - 1, next() * 2 - 1, next() * 2 - 1, next() * 2 - 1, next() * 2 - 1,
                next(), next(), next(), next()
            ];

            // 前の内容が残っていても上書きされることも確かめるため、別々の値で埋めておく
            const actual = new Float32Array(size + 51).fill(7);
            const expected = new Float32Array(size + 51).fill(7);
            const start = Math.floor(next() * 3);

            expect(execute(path, actual, start, ...args)).toBe(reference(path, expected, start, ...args));
            expect(actual).toStrictEqual(expected);
        }
    });

    it("appends after the given index and leaves earlier vertices untouched", () =>
    {
        const next = random(3);
        const first = makePath(next, 8);
        const second = makePath(next, 12);
        const size = (first.length / 3 - 2 + second.length / 3 - 2) * 51;

        const actual = new Float32Array(size);
        const expected = new Float32Array(size);
        let actualIndex = execute(first, actual, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
        actualIndex = execute(second, actual, actualIndex, 2, 3, 4, 5, 6, 7, 0, 1, 0, 0.5);
        let expectedIndex = reference(first, expected, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
        expectedIndex = reference(second, expected, expectedIndex, 2, 3, 4, 5, 6, 7, 0, 1, 0, 0.5);

        expect(actualIndex).toBe(expectedIndex);
        expect(actual).toStrictEqual(expected);
    });

    it("does not throw when the buffer is too small (writes what fits)", () =>
    {
        const next = random(9);
        const path = makePath(next, 10);
        const size = (path.length / 3 - 2) * 51;
        const actual = new Float32Array(size - 30);
        const expected = new Float32Array(size - 30);

        expect(execute(path, actual, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1))
            .toBe(reference(path, expected, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1));
        expect(actual).toStrictEqual(expected);
    });
});
