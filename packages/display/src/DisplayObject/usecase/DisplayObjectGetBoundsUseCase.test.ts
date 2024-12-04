import { execute } from "./DisplayObjectGetBoundsUseCase";
import type { DisplayObject } from "../../DisplayObject";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetBoundsUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const sprite = new DisplayObjectContainer();

        const container = new DisplayObjectContainer();
        container.x = 100;
        container.y = 100;
        sprite.addChild(container);

        const contents = new Shape();
        contents.graphics.drawCircle(0, 0, 100);
        container.addChild(contents);

        const bounds1 = execute(contents, container as unknown as DisplayObject);
        const bounds2 = execute(contents, sprite as unknown as DisplayObject);

        expect(bounds1.x).toBe(-100);
        expect(bounds1.y).toBe(-100);
        expect(bounds1.width).toBe(200);
        expect(bounds1.height).toBe(200);
        expect(bounds2.x).toBe(0);
        expect(bounds2.y).toBe(0);
        expect(bounds2.width).toBe(200);
        expect(bounds2.height).toBe(200);
    });
});