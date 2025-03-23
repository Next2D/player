import { execute } from "./DisplayObjectContainerRemoveChildAtUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerRemoveChildAtUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        container.addChild(new Shape());
        container.addChild(new Shape());
        container.addChild(new Shape());
        
        const shape4 = container.addChild(new Shape());
        const shape5 = container.addChild(new Shape());
        expect(container.children.length).toBe(5);

        container.changed = false;
        expect(container.changed).toBe(false);
       
        expect(shape4.parent).toBe(container);
        execute(container, 3);
        expect(shape4.parent).toBe(null);
        expect(container.children.length).toBe(4);

        expect(shape5.parent).toBe(container);
        execute(container, container.numChildren - 1);
        expect(container.children.length).toBe(3);
        expect(shape5.parent).toBe(null);

        expect(container.changed).toBe(true);
    });
});