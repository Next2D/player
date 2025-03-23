import { execute } from "./DisplayObjectHitTestPointUseCase";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("DisplayObjectHitTestPointUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();

        const shape1 = container.addChild(new Shape());
        shape1
            .graphics
            .beginFill()
            .drawRect(0, 0, 32, 32);

        shape1.x = 0;
        shape1.y = 0;
        expect(execute(shape1, 0, 0)).toBe(true);
        expect(execute(shape1, 33, 33)).toBe(false);

        const shape2 = container.addChild(new Shape());
        shape2
            .graphics
            .beginFill()
            .drawRect(0, 0, 32, 32);

        shape2.x = 32;
        shape2.y = 32;
        expect(execute(shape2, 60, 60)).toBe(true);
        expect(execute(shape2, 10, 10)).toBe(false);


        expect(execute(container, 10, 10)).toBe(true);
        expect(execute(container, 65, 65)).toBe(false);
    });
});