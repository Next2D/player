import { execute } from "./DisplayObjectContainerRemoveChildrenUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerRemoveChildrenUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        container.addChild(new Shape());
        container.addChild(new Shape());
        const shape3 = container.addChild(new Shape());
        const shape4 = container.addChild(new Shape());
        container.addChild(new Shape());
        expect(container.children.length).toBe(5);

        container.changed = false;
        expect(container.changed).toBe(false);
       
        expect(shape3.parent).toBe(container);
        expect(shape4.parent).toBe(container);
        execute(container, [2, 3]);
        expect(shape3.parent).toBe(null);
        expect(shape4.parent).toBe(null);
        expect(container.children.length).toBe(3);

        expect(container.changed).toBe(true);
    });
});