import { execute } from "./VideoCalcLayerBoundsUseCase";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";
import { BlurFilter, GlowFilter } from "@next2d/filters";

describe("VideoCalcLayerBoundsUseCase.ts test", () =>
{
    it("フィルターなしの場合はCalcBoundsMatrixと同じ結果を返す", () =>
    {
        const video = new Video(3, 4);
        const bounds = execute(video);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("BlurFilter適用後のboundsが拡張される", () =>
    {
        const video = new Video(3, 4);

        // BlurFilter(blurX=4, blurY=4, quality=1)
        // dx=2, dy=2 → filterBounds: [-2, -2, 2, 2]
        video.$filters = [new BlurFilter(4, 4, 1)];

        const bounds = execute(video);
        expect(bounds[0]).toBe(-2); // 0 + (-2)
        expect(bounds[1]).toBe(-2); // 0 + (-2)
        expect(bounds[2]).toBe(5);  // 3 + 2
        expect(bounds[3]).toBe(6);  // 4 + 2
    });

    it("GlowFilter(inner=true)の場合はboundsが拡張されない", () =>
    {
        const video = new Video(3, 4);
        video.$filters = [new GlowFilter(0, 1, 4, 4, 1, 1, true)];

        const bounds = execute(video);
        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });
});
