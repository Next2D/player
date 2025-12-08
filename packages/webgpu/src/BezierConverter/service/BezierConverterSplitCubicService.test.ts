import { execute } from "./BezierConverterSplitCubicService";
import { describe, expect, it } from "vitest";

describe("BezierConverterSplitCubicService.ts method test", () =>
{
    it("test case - split cubic at t=0.5", () =>
    {
        const left = new Float32Array(8);
        const right = new Float32Array(8);

        // 直線的な3次ベジエ曲線
        execute(0, 0, 10, 10, 20, 20, 30, 30, 0.5, left, right);

        // 左側の開始点は元の開始点
        expect(left[0]).toBe(0);
        expect(left[1]).toBe(0);

        // 左側の終点と右側の開始点は同じ（分割点）
        expect(left[6]).toBe(right[0]);
        expect(left[7]).toBe(right[1]);

        // 右側の終点は元の終点
        expect(right[6]).toBe(30);
        expect(right[7]).toBe(30);

        // t=0.5での分割点は直線の中点
        expect(left[6]).toBe(15);
        expect(left[7]).toBe(15);
    });

    it("test case - split cubic at t=0.25", () =>
    {
        const left = new Float32Array(8);
        const right = new Float32Array(8);

        execute(0, 0, 40, 0, 40, 40, 0, 40, 0.25, left, right);

        // 左側の開始点は元の開始点
        expect(left[0]).toBe(0);
        expect(left[1]).toBe(0);

        // 左側の終点と右側の開始点は同じ
        expect(left[6]).toBe(right[0]);
        expect(left[7]).toBe(right[1]);

        // 右側の終点は元の終点
        expect(right[6]).toBe(0);
        expect(right[7]).toBe(40);
    });

    it("test case - split cubic at t=0.75", () =>
    {
        const left = new Float32Array(8);
        const right = new Float32Array(8);

        execute(0, 0, 100, 0, 100, 100, 0, 100, 0.75, left, right);

        // 左側の開始点は元の開始点
        expect(left[0]).toBe(0);
        expect(left[1]).toBe(0);

        // 右側の終点は元の終点
        expect(right[6]).toBe(0);
        expect(right[7]).toBe(100);
    });
});
