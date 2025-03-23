import { execute } from "./DisplayObjectContainerSetChildIndexUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerSetChildIndexUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        const shape0 = container.addChild(new Shape());
        const shape1 = container.addChild(new Shape());
        const shape2 = container.addChild(new Shape());
        const shape3 = container.addChild(new Shape());

        expect(container.children[0]).toBe(shape0);
        expect(container.children[1]).toBe(shape1);
        expect(container.children[2]).toBe(shape2);
        expect(container.children[3]).toBe(shape3);

        container.changed = false;
        expect(container.changed).toBe(false);
        
        execute(container, shape1, 2);

        expect(container.children[0]).toBe(shape0);
        expect(container.children[1]).toBe(shape2);
        expect(container.children[2]).toBe(shape1);
        expect(container.children[3]).toBe(shape3);
        expect(container.changed).toBe(true);
    });

    it("execute test case2", () =>
    {
        const container = new DisplayObjectContainer();
        const shape0 = container.addChild(new Shape());
        const shape1 = container.addChild(new Shape());
        const shape2 = container.addChild(new Shape());
        const shape3 = container.addChild(new Shape());

        expect(container.children[0]).toBe(shape0);
        expect(container.children[1]).toBe(shape1);
        expect(container.children[2]).toBe(shape2);
        expect(container.children[3]).toBe(shape3);

        container.changed = false;
        expect(container.changed).toBe(false);
        
        execute(container, shape0, 3);

        expect(container.children[0]).toBe(shape1);
        expect(container.children[1]).toBe(shape2);
        expect(container.children[2]).toBe(shape3);
        expect(container.children[3]).toBe(shape0);
        expect(container.changed).toBe(true);
    });
});