import { execute } from "./DisplayObjectHitTestObjectUseCase";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("DisplayObjectHitTestObjectUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();

        const shape1 = container.addChild(new Shape());
        shape1
            .graphics
            .beginFill()
            .drawRect(0, 0, 32, 32);

        shape1.x = 32;
        shape1.y = 32;

        const shape2 = container.addChild(new Shape());
        shape2
            .graphics
            .beginFill()
            .drawRect(0, 0, 32, 32);

        shape2.x = 65;
        shape2.y = 65;
        expect(execute(shape1, shape2)).toBe(false);

        shape2.x = 64;
        shape2.y = 64;
        expect(execute(shape1, shape2)).toBe(true);
    });
});