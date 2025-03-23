import { EventDispatcher } from "../../EventDispatcher";
import { describe, expect, it, vi } from "vitest";

describe("EventDispatcher.js willTrigger test", () =>
{
    it("willTrigger test success case1", () =>
    {
        class Parent extends EventDispatcher {}
        const parent2 = new Parent();

        const parent1 = new Parent();
        class Child extends EventDispatcher
        {
            private _$parent: Parent;
            constructor (src: Parent)
            {
                super();

                this._$parent = src;
            }
            get parent ()
            {
                return this._$parent;
            }
        }
        const child = new Child(parent1);

        parent1.addEventListener("test", vi.fn());

        expect(parent2.willTrigger("test")).toBe(false);
        expect(parent1.willTrigger("test")).toBe(true);
        expect(child.willTrigger("test")).toBe(true);
    });

    it("willTrigger test success case2", () =>
    {
        class Parent extends EventDispatcher {}

        const parent = new Parent();
        class Child extends EventDispatcher
        {
            private _$parent: Parent;
            constructor (src: Parent)
            {
                super();

                this._$parent = src;
            }
            get parent ()
            {
                return this._$parent;
            }
        }
        const child1 = new Child(parent);
        const child2 = new Child(parent);

        parent.addEventListener("test", vi.fn());

        expect(parent.willTrigger("test")).toBe(true);
        expect(child1.willTrigger("test")).toBe(true);
        expect(child2.willTrigger("test")).toBe(true);

    });
});