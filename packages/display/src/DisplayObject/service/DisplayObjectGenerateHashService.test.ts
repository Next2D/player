import { execute } from "./DisplayObjectGenerateHashService";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGenerateHashService.js test", () =>
{
    it("should generate consistent hash for the same buffer", () =>
    {
        const buffer = new Float32Array([1.0, 2.0, 3.0]);
        const hash1 = execute(buffer);
        const hash2 = execute(buffer);
        expect(hash1).toBe(hash2);
    });

    it("should generate different hashes for different buffers", () =>
    {
        const buffer1 = new Float32Array([1.0, 2.0, 3.0]);
        const buffer2 = new Float32Array([3.0, 2.0, 1.0]);
        const hash1 = execute(buffer1);
        const hash2 = execute(buffer2);
        expect(hash1).not.toBe(hash2);
    });

    it("should generate hash for empty buffer", () =>
    {
        const buffer = new Float32Array([]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should generate hash for single element buffer", () =>
    {
        const buffer = new Float32Array([1.0]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should generate 24-bit hash value", () =>
    {
        const buffer = new Float32Array([1.0, 2.0, 3.0, 4.0, 5.0]);
        const hash = execute(buffer);
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should be sensitive to floating point precision", () =>
    {
        const buffer1 = new Float32Array([1.0000000]);
        const buffer2 = new Float32Array([1.0000001]);
        const hash1 = execute(buffer1);
        const hash2 = execute(buffer2);
        // Float32の精度の範囲内で異なる値は異なるハッシュを生成する可能性がある
        expect(typeof hash1).toBe("number");
        expect(typeof hash2).toBe("number");
    });

    it("should handle negative values", () =>
    {
        const buffer = new Float32Array([-1.0, -2.0, -3.0]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle zero values", () =>
    {
        const buffer = new Float32Array([0.0, 0.0, 0.0]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle special float values", () =>
    {
        const buffer = new Float32Array([Infinity, -Infinity, NaN]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle large buffers", () =>
    {
        const buffer = new Float32Array(1000);
        for (let i = 0; i < 1000; i++) {
            buffer[i] = Math.random();
        }
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should be deterministic for matrix-like data", () =>
    {
        // 変換行列のような典型的なデータをテスト
        const matrixBuffer = new Float32Array([
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0 // identity matrix
        ]);
        const hash1 = execute(matrixBuffer);
        const hash2 = execute(matrixBuffer);
        expect(hash1).toBe(hash2);
    });

    it("should differentiate similar buffers", () =>
    {
        const buffer1 = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        const buffer2 = new Float32Array([1.0, 2.0, 3.0, 4.1]);
        const hash1 = execute(buffer1);
        const hash2 = execute(buffer2);
        expect(hash1).not.toBe(hash2);
    });

    it("should handle very small values", () =>
    {
        const buffer = new Float32Array([0.000001, 0.000002, 0.000003]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should handle very large values", () =>
    {
        const buffer = new Float32Array([1e30, 2e30, 3e30]);
        const hash = execute(buffer);
        expect(typeof hash).toBe("number");
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(0xffffff);
    });

    it("should differentiate data that differs only in sign at two places", () =>
    {
        // 符号ビットだけが 2 か所で異なる (反転した図形) データは、別の値になる
        const buffer1 = new Float32Array([0, 10, 20, 2, 30, 40, 2, 50, 60]);
        const buffer2 = new Float32Array([0, -10, 20, 2, -30, 40, 2, 50, 60]);
        const buffer3 = new Float32Array([0, -10, -20, 2, -30, -40, 2, -50, -60]);
        expect(execute(buffer1)).not.toBe(execute(buffer2));
        expect(execute(buffer1)).not.toBe(execute(buffer3));
        expect(execute(buffer2)).not.toBe(execute(buffer3));
    });

    it("should differentiate buffers of zeros with different lengths", () =>
    {
        expect(execute(new Float32Array(3))).not.toBe(execute(new Float32Array(4)));
        expect(execute(new Float32Array(4))).not.toBe(execute(new Float32Array(8)));
    });

    it("should read only the range of a view on a larger buffer", () =>
    {
        const whole = new Float32Array([9, 1, 2, 3, 9]);
        const view  = whole.subarray(1, 4);
        expect(execute(view)).toBe(execute(new Float32Array([1, 2, 3])));
    });

    it("should rarely collide on similar path data", () =>
    {
        // 似たパス (1 点の符号反転 / 隣同士の入れ替え / わずかな移動) 約 3,000 通りで、
        // 24bit の値が偶然一致する件数の目安は 1 件未満
        let seed = 12345;
        const random = (): number =>
        {
            seed = Math.imul(seed, 1103515245) + 12345 >>> 0;
            return seed / 4294967296;
        };

        const seen: Map<number, string> = new Map();
        let collisions = 0;
        const add = (buffer: Float32Array): void =>
        {
            const hash = execute(buffer);
            const key  = Array.from(buffer).join(",");
            const previous = seen.get(hash);
            if (previous !== undefined && previous !== key) {
                ++collisions;
            } else {
                seen.set(hash, key);
            }
        };

        for (let shape = 0; shape < 30; ++shape) {
            const base = new Float32Array(30 + shape);
            for (let idx = 0; idx < base.length; ++idx) {
                base[idx] = Math.round((random() * 400 - 200) * 20) / 20 || 1;
            }
            add(base);
            for (let idx = 0; idx < base.length; ++idx) {
                const flipped = base.slice();
                flipped[idx] = -flipped[idx];
                add(flipped);

                const moved = base.slice();
                moved[idx] += 0.05;
                add(moved);

                if (idx + 1 < base.length && base[idx] !== base[idx + 1]) {
                    const swapped = base.slice();
                    swapped[idx] = base[idx + 1];
                    swapped[idx + 1] = base[idx];
                    add(swapped);
                }
            }
        }

        expect(collisions).toBeLessThanOrEqual(3);
    });

    it("should match the reference values shared with the runtime implementation", () =>
    {
        // 実行環境 (ホスト) の同じ計算のテストも、この値で確かめている
        const ramp = (length: number): Float32Array =>
        {
            const buffer = new Float32Array(length);
            for (let idx = 0; idx < length; ++idx) {
                buffer[idx] = idx * 0.375 - 100;
            }
            return buffer;
        };

        expect(execute(new Float32Array(0))).toBe(6141092);
        expect(execute(new Float32Array(1))).toBe(15990438);
        expect(execute(new Float32Array(2))).toBe(9344940);
        expect(execute(new Float32Array([1.5, -2.25, 3]))).toBe(7875761);
        expect(execute(new Float32Array([-1.5, 2.25, 3]))).toBe(10177548);
        expect(execute(ramp(4))).toBe(16577691);
        expect(execute(ramp(5))).toBe(5381896);
        expect(execute(ramp(7))).toBe(11206304);
        expect(execute(ramp(1000))).toBe(3711294);
        expect(execute(ramp(4097))).toBe(15450031);
    });
});
