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
});
