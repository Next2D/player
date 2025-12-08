import { execute } from "./BezierConverterAdaptiveCubicToQuadUseCase";
import { describe, expect, it } from "vitest";

describe("BezierConverterAdaptiveCubicToQuadUseCase.ts method test", () =>
{
    it("test case - flat curve uses minimum 2 segments", () =>
    {
        // 直線的なベジエ曲線（フラット）
        const result = execute(0, 0, 10, 10, 20, 20, 30, 30);

        // 最小2セグメント
        expect(result.count).toBe(2);
        expect(result.buffer).toBeDefined();

        // 最終点が正しいことを確認
        // count * 4 = 8要素、最後の座標は[6], [7]
        expect(result.buffer[result.count * 4 - 2]).toBe(30);
        expect(result.buffer[result.count * 4 - 1]).toBe(30);
    });

    it("test case - curved path uses more segments", () =>
    {
        // 曲率のあるベジエ曲線
        const result = execute(0, 0, 0, 100, 100, 100, 100, 0);

        // 曲率が高いので2セグメント以上
        expect(result.count).toBeGreaterThanOrEqual(2);
        expect(result.buffer).toBeDefined();

        // 最終点が正しいことを確認
        expect(result.buffer[result.count * 4 - 2]).toBe(100);
        expect(result.buffer[result.count * 4 - 1]).toBe(0);
    });

    it("test case - high curvature uses 4+ segments", () =>
    {
        // 非常に曲率の高いベジエ曲線
        const result = execute(0, 0, 200, 0, -100, 200, 100, 200);

        // 高曲率なので4セグメント以上
        expect(result.count).toBeGreaterThanOrEqual(4);

        // 最終点が正しいことを確認
        expect(result.buffer[result.count * 4 - 2]).toBe(100);
        expect(result.buffer[result.count * 4 - 1]).toBe(200);
    });

    it("test case - returns buffer and count", () =>
    {
        const result = execute(0, 0, 50, 0, 50, 50, 0, 50);

        expect(result).toHaveProperty("buffer");
        expect(result).toHaveProperty("count");
        expect(result.buffer).toBeInstanceOf(Float32Array);
        expect(typeof result.count).toBe("number");
        expect(result.count).toBeGreaterThan(0);
    });
});
