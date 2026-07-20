import { execute } from "./GraphicsInvalidateOwnerCacheUseCase";
import { Graphics } from "../../Graphics";
import { Shape } from "../../Shape";
import { MovieClip } from "../../MovieClip";
import { $cacheStore } from "@next2d/cache";
import { describe, expect, it } from "vitest";

describe("GraphicsInvalidateOwnerCacheUseCase.js test", () =>
{
    it("execute test case1 - resets uniqueKey and marks shape as changed", () =>
    {
        const shape = new Shape();
        const graphics = shape.graphics;

        shape.uniqueKey = "123456789";
        shape.changed   = false;

        execute(graphics);

        expect(shape.uniqueKey).toBe("");
        expect(shape.changed).toBe(true);
    });

    it("execute test case2 - removes cache store entry of the old uniqueKey", () =>
    {
        const shape = new Shape();
        const graphics = shape.graphics;

        shape.uniqueKey = "987654321";
        $cacheStore.set(shape.uniqueKey, "0", true);

        expect($cacheStore.has(shape.uniqueKey)).toBe(true);

        execute(graphics);

        expect($cacheStore.has("987654321")).toBe(false);
    });

    it("execute test case3 - detaches $cache reference", () =>
    {
        const shape = new Shape();
        const graphics = shape.graphics;

        shape.uniqueKey = "111222333";
        shape.$cache = new Map();

        execute(graphics);

        expect(shape.$cache).toBeNull();
    });

    it("execute test case4 - does nothing for graphics without owner", () =>
    {
        const graphics = new Graphics();

        expect(() => execute(graphics)).not.toThrow();
    });

    it("execute test case5 - propagates changed flag to parent", () =>
    {
        const parent = new MovieClip();
        const shape  = new Shape();
        parent.addChild(shape);

        parent.changed = false;
        shape.changed  = false;

        execute(shape.graphics);

        expect(shape.changed).toBe(true);
        expect(parent.changed).toBe(true);
    });

    it("Graphics.clear test - clear() invalidates the owner shape cache", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .beginFill(0xff0000)
            .drawRect(0, 0, 100, 100)
            .endFill();

        shape.uniqueKey = "555666777";
        $cacheStore.set(shape.uniqueKey, "0", true);
        shape.changed = false;

        shape.graphics.clear();

        expect(shape.uniqueKey).toBe("");
        expect(shape.changed).toBe(true);
        expect($cacheStore.has("555666777")).toBe(false);
    });
});
