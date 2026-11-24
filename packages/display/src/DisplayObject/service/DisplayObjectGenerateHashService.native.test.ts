import { describe, expect, it, vi } from "vitest";

// 実行環境が __next2dShape.hash を置いている状態を作る (モジュールの読み込みより前に置く必要がある)
const fake = vi.hoisted(() =>
{
    const fake = {
        "calls": [] as Float32Array[],
        "hash": (buffer: Float32Array): number =>
        {
            fake.calls.push(buffer);
            return 123456;
        }
    };
    (globalThis as unknown as { __next2dShape: unknown }).__next2dShape = fake;
    return fake;
});

import { execute } from "./DisplayObjectGenerateHashService";

describe("DisplayObjectGenerateHashService.js test (the runtime provides __next2dShape.hash)", () =>
{
    it("should use the implementation provided by the runtime", () =>
    {
        const buffer = new Float32Array([1, 2, 3]);
        expect(execute(buffer)).toBe(123456);
        expect(fake.calls.length).toBe(1);
        expect(fake.calls[0]).toBe(buffer);
    });
});
