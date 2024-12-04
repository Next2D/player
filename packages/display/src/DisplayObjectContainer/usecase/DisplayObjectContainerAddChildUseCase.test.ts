import { execute } from "./DisplayObjectContainerAddChildUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerAddChildUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        const shape1 = new Shape();
        const shape2 = new Shape();

        container.changed = false;
        expect(container.changed).toBe(false);

        expect(shape1.$added).toBe(false);
        expect(shape1.parent).toBe(null);
        expect(container.children.length).toBe(0);
        execute(container, shape1);
        expect(shape1.$added).toBe(true);
        expect((shape1.parent as NonNullable<DisplayObjectContainer>).instanceId).toBe(container.instanceId);
        expect(container.changed).toBe(true);

        container.changed = false;
        expect(container.changed).toBe(false);

        expect(shape2.$added).toBe(false);
        expect(shape2.parent).toBe(null);
        expect(container.children.length).toBe(1);
        execute(container, shape2);
        expect(shape2.$added).toBe(true);
        expect((shape2.parent as NonNullable<DisplayObjectContainer>).instanceId).toBe(container.instanceId);
        expect(container.changed).toBe(true);

        expect(container.children.length).toBe(2);

        expect((container.children[0] as NonNullable<Shape>).instanceId).toBe(shape1.instanceId);
        expect((container.children[1] as NonNullable<Shape>).instanceId).toBe(shape2.instanceId);
    });

    it("execute test case2", () =>
    {
        const container = new DisplayObjectContainer();
        const shape1 = new Shape();
        const shape2 = new Shape();
        const shape3 = new Shape();

        container.changed = false;
        expect(container.changed).toBe(false);

        expect(shape1.$added).toBe(false);
        expect(shape1.parent).toBe(null);
        expect(container.children.length).toBe(0);
        execute(container, shape1, 0);
        expect(container.children.length).toBe(1);
        expect(shape1.$added).toBe(true);
        expect((shape1.parent as NonNullable<DisplayObjectContainer>).instanceId).toBe(container.instanceId);
        expect(container.changed).toBe(true);

        container.changed = false;
        expect(container.changed).toBe(false);

        expect(shape2.$added).toBe(false);
        expect(shape2.parent).toBe(null);
        execute(container, shape2, 0);
        expect(container.children.length).toBe(2);
        expect(shape2.$added).toBe(true);
        expect((shape2.parent as NonNullable<DisplayObjectContainer>).instanceId).toBe(container.instanceId);
        expect(container.changed).toBe(true);

        execute(container, shape3, 0);
        expect(container.children.length).toBe(3);

        expect((container.children[0] as NonNullable<Shape>).instanceId).toBe(shape3.instanceId);
        expect((container.children[1] as NonNullable<Shape>).instanceId).toBe(shape2.instanceId);
        expect((container.children[2] as NonNullable<Shape>).instanceId).toBe(shape1.instanceId);
    });
});