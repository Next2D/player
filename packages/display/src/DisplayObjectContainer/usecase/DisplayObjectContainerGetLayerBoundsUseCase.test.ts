import { execute } from "./DisplayObjectContainerGetLayerBoundsUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";
import { BlurFilter, GlowFilter } from "@next2d/filters";

describe("DisplayObjectContainerGetLayerBoundsUseCase.ts test", () =>
{
    it("子要素がない場合は[0,0,0,0]を返す", () =>
    {
        const container = new DisplayObjectContainer();
        const bounds = execute(container);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(0);
        expect(bounds[3]).toBe(0);
    });

    it("フィルターなしの子要素のboundsを統合する", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 20;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 60;
        container.addChild(shape);

        const textField = new TextField();
        container.addChild(textField);

        const bounds = execute(container);
        // Shape: [10, 20, 50, 60]
        // TextField: [0, 0, 100, 100]
        expect(bounds[0]).toBe(0);   // min(10, 0)
        expect(bounds[1]).toBe(0);   // min(20, 0)
        expect(bounds[2]).toBe(100); // max(50, 100)
        expect(bounds[3]).toBe(100); // max(60, 100)
    });

    it("BlurFilterを持つ子要素のboundsがフィルター分拡張される", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 20;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 60;
        // BlurFilter(blurX=4, blurY=4, quality=1) → dx=2, dy=2
        shape.$filters = [new BlurFilter(4, 4, 1)];
        container.addChild(shape);

        const bounds = execute(container);
        // Shape layer bounds: [10-2, 20-2, 50+2, 60+2] = [8, 18, 52, 62]
        expect(bounds[0]).toBe(8);
        expect(bounds[1]).toBe(18);
        expect(bounds[2]).toBe(52);
        expect(bounds[3]).toBe(62);
    });

    it("フィルターありとなしの子要素が混在する場合のbounds統合", () =>
    {
        const container = new DisplayObjectContainer();

        // フィルターあり
        const shape1 = new Shape();
        shape1.graphics.xMin = 10;
        shape1.graphics.yMin = 20;
        shape1.graphics.xMax = 50;
        shape1.graphics.yMax = 60;
        shape1.$filters = [new BlurFilter(4, 4, 1)];
        container.addChild(shape1);

        // フィルターなし
        const shape2 = new Shape();
        shape2.graphics.xMin = 100;
        shape2.graphics.yMin = 100;
        shape2.graphics.xMax = 200;
        shape2.graphics.yMax = 200;
        container.addChild(shape2);

        const bounds = execute(container);
        // shape1 layer bounds: [8, 18, 52, 62]
        // shape2 layer bounds: [100, 100, 200, 200]
        expect(bounds[0]).toBe(8);   // min(8, 100)
        expect(bounds[1]).toBe(18);  // min(18, 100)
        expect(bounds[2]).toBe(200); // max(52, 200)
        expect(bounds[3]).toBe(200); // max(62, 200)
    });

    it("GlowFilter(inner=true)の子要素はboundsが拡張されない", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 20;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 60;
        shape.$filters = [new GlowFilter(0, 1, 4, 4, 1, 1, true)];
        container.addChild(shape);

        const bounds = execute(container);
        expect(bounds[0]).toBe(10);
        expect(bounds[1]).toBe(20);
        expect(bounds[2]).toBe(50);
        expect(bounds[3]).toBe(60);
    });

    it("複数タイプの子要素(Shape, TextField, Video)のフィルターboundsを統合", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = new Shape();
        shape.graphics.xMin = -10;
        shape.graphics.yMin = -10;
        shape.graphics.xMax = 10;
        shape.graphics.yMax = 10;
        shape.$filters = [new BlurFilter(4, 4, 1)];
        container.addChild(shape);

        const textField = new TextField();
        textField.$filters = [new BlurFilter(4, 4, 1)];
        container.addChild(textField);

        const video = new Video(50, 50);
        container.addChild(video);

        const bounds = execute(container);
        // Shape layer: [-10-2, -10-2, 10+2, 10+2] = [-12, -12, 12, 12]
        // TextField layer: [0-2, 0-2, 100+2, 100+2] = [-2, -2, 102, 102]
        // Video layer (no filter): [0, 0, 50, 50]
        expect(bounds[0]).toBe(-12); // min(-12, -2, 0)
        expect(bounds[1]).toBe(-12); // min(-12, -2, 0)
        expect(bounds[2]).toBe(102); // max(12, 102, 50)
        expect(bounds[3]).toBe(102); // max(12, 102, 50)
    });

    it("ネストされたコンテナの子要素のフィルターboundsを再帰的に統合", () =>
    {
        const parent = new DisplayObjectContainer();
        const child = new DisplayObjectContainer();
        parent.addChild(child);

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        shape.$filters = [new BlurFilter(4, 4, 1)];
        child.addChild(shape);

        const bounds = execute(parent);
        // Shape layer: [0-2, 0-2, 100+2, 100+2] = [-2, -2, 102, 102]
        expect(bounds[0]).toBe(-2);
        expect(bounds[1]).toBe(-2);
        expect(bounds[2]).toBe(102);
        expect(bounds[3]).toBe(102);
    });
});
