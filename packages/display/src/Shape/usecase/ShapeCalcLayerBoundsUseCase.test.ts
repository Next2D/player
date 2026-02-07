import { execute } from "./ShapeCalcLayerBoundsUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";
import { BlurFilter, GlowFilter, DropShadowFilter } from "@next2d/filters";

describe("ShapeCalcLayerBoundsUseCase.ts test", () =>
{
    it("フィルターなしの場合はCalcBoundsMatrixと同じ結果を返す", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        const bounds = execute(shape);
        expect(bounds[0]).toBe(1);
        expect(bounds[1]).toBe(2);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("BlurFilter適用後のboundsが拡張される", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        // BlurFilter(blurX=4, blurY=4, quality=1)
        // step = $STEP[0] = 0.5
        // dx = Math.round(4 * 0.5) = 2, dy = 2
        // filterBounds: [-2, -2, 2, 2]
        shape.$filters = [new BlurFilter(4, 4, 1)];

        const bounds = execute(shape);
        expect(bounds[0]).toBe(-1); // 1 + (-2)
        expect(bounds[1]).toBe(0);  // 2 + (-2)
        expect(bounds[2]).toBe(5);  // 3 + 2
        expect(bounds[3]).toBe(6);  // 4 + 2
    });

    it("BlurFilter + matrix適用後のboundsが正しく拡張される", () =>
    {
        const shape = new Shape();
        shape.$matrix = new Matrix(1.3, 0.5, 0.2, 1.2, 110, 220);
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        shape.$filters = [new BlurFilter(4, 4, 1)];

        const bounds = execute(shape);
        // CalcBoundsMatrix結果: [111.7, 222.9, 114.7, 226.3]
        // filterBounds: [-2, -2, 2, 2]
        expect(bounds[0]).toBeCloseTo(109.7, 0);
        expect(bounds[1]).toBeCloseTo(220.9, 0);
        expect(bounds[2]).toBeCloseTo(116.7, 0);
        expect(bounds[3]).toBeCloseTo(228.3, 0);
    });

    it("GlowFilter(inner=true)の場合はboundsが拡張されない", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        // inner=trueの場合はboundsを拡張しない
        shape.$filters = [new GlowFilter(0, 1, 4, 4, 1, 1, true)];

        const bounds = execute(shape);
        expect(bounds[0]).toBe(1);
        expect(bounds[1]).toBe(2);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("DropShadowFilter(inner=true)の場合はboundsが拡張されない", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        // inner=trueの場合はboundsを拡張しない
        shape.$filters = [new DropShadowFilter(4, 45, 0, 1, 4, 4, 1, 1, true)];

        const bounds = execute(shape);
        expect(bounds[0]).toBe(1);
        expect(bounds[1]).toBe(2);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("複数フィルター適用時にパディングが累積される", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 20;
        shape.graphics.xMax = 30;
        shape.graphics.yMax = 40;

        // 2つのBlurFilterを適用
        // 各々 dx=2, dy=2 → 累積 filterBounds: [-4, -4, 4, 4]
        shape.$filters = [
            new BlurFilter(4, 4, 1),
            new BlurFilter(4, 4, 1)
        ];

        const bounds = execute(shape);
        expect(bounds[0]).toBe(6);  // 10 + (-4)
        expect(bounds[1]).toBe(16); // 20 + (-4)
        expect(bounds[2]).toBe(34); // 30 + 4
        expect(bounds[3]).toBe(44); // 40 + 4
    });

    it("DropShadowFilter適用後のboundsが影の方向に拡張される", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;

        // DropShadowFilter(distance=4, angle=45, blurX=4, blurY=4, quality=1)
        // blur: dx=2, dy=2 → [-2, -2, 2, 2]
        // shadow: x = cos(45°)*4 ≈ 2.828, y = sin(45°)*4 ≈ 2.828
        // bounds[0] = Math.min(-2, 2.828) = -2
        // bounds[2] += 2.828 → 2 + 2.828 ≈ 4.828
        // bounds[1] = Math.min(-2, 2.828) = -2
        // bounds[3] += 2.828 → 2 + 2.828 ≈ 4.828
        shape.$filters = [new DropShadowFilter(4, 45, 0, 1, 4, 4, 1, 1)];

        const bounds = execute(shape);
        expect(bounds[0]).toBeCloseTo(-2, 0);     // 0 + (-2)
        expect(bounds[1]).toBeCloseTo(-2, 0);     // 0 + (-2)
        expect(bounds[2]).toBeCloseTo(104.83, 0); // 100 + 4.828
        expect(bounds[3]).toBeCloseTo(104.83, 0); // 100 + 4.828
    });
});
