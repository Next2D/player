import { execute } from "./TextFieldCalcLayerBoundsUseCase";
import { TextField } from "@next2d/text";
import { describe, expect, it } from "vitest";
import { BlurFilter, GlowFilter } from "@next2d/filters";

describe("TextFieldCalcLayerBoundsUseCase.ts test", () =>
{
    it("フィルターなしの場合はCalcBoundsMatrixと同じ結果を返す", () =>
    {
        const textField = new TextField();
        const bounds = execute(textField);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(100);
    });

    it("BlurFilter適用後のboundsが拡張される", () =>
    {
        const textField = new TextField();

        // BlurFilter(blurX=4, blurY=4, quality=1)
        // dx=2, dy=2 → filterBounds: [-2, -2, 2, 2]
        textField.$filters = [new BlurFilter(4, 4, 1)];

        const bounds = execute(textField);
        expect(bounds[0]).toBe(-2);  // 0 + (-2)
        expect(bounds[1]).toBe(-2);  // 0 + (-2)
        expect(bounds[2]).toBe(102); // 100 + 2
        expect(bounds[3]).toBe(102); // 100 + 2
    });

    it("GlowFilter(inner=true)の場合はboundsが拡張されない", () =>
    {
        const textField = new TextField();
        textField.$filters = [new GlowFilter(0, 1, 4, 4, 1, 1, true)];

        const bounds = execute(textField);
        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(100);
    });
});
