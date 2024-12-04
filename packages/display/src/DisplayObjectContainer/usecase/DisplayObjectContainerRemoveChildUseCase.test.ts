import { execute } from "./DisplayObjectContainerRemoveChildUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerRemoveChildUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        const shape1 = container.addChild(new Shape());
        const shape2 = container.addChild(new Shape());

        container.changed = false;
        expect(container.changed).toBe(false);

        expect(shape1.$added).toBe(true);
        expect(shape1.parent?.instanceId).toBe(container.instanceId);

        expect(shape2.$added).toBe(true);
        expect(shape2.parent?.instanceId).toBe(container.instanceId);

        expect(container.children.length).toBe(2);
        execute(container, shape1);

        expect(container.children.length).toBe(1);
        expect(shape1.$added).toBe(false);
        expect(shape1.parent).toBe(null);

        execute(container, shape2);

        expect(container.children.length).toBe(0);
        expect(shape2.$added).toBe(false);
        expect(shape2.parent).toBe(null);

        expect(container.changed).toBe(true);
    });

});