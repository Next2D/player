import { DisplayObject } from "./DisplayObject";
import { Matrix } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObject cacheAsBitmap test", () =>
{
    it("default value is null", () =>
    {
        const displayObject = new DisplayObject();
        expect(displayObject.cacheAsBitmap).toBe(null);
    });

    it("setting Matrix marks changed", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);

        const matrix = new Matrix(2, 0, 0, 2, 0, 0);
        displayObject.cacheAsBitmap = matrix;

        expect(displayObject.cacheAsBitmap).toBe(matrix);
        expect(displayObject.changed).toBe(true);
    });

    it("setting null when already null does not mark changed", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.cacheAsBitmap).toBe(null);

        displayObject.cacheAsBitmap = null;

        expect(displayObject.changed).toBe(false);
    });

    it("setting to null after Matrix marks changed", () =>
    {
        const displayObject = new DisplayObject();
        const matrix = new Matrix(2, 0, 0, 2, 0, 0);
        displayObject.cacheAsBitmap = matrix;
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);

        displayObject.cacheAsBitmap = null;

        expect(displayObject.cacheAsBitmap).toBe(null);
        expect(displayObject.changed).toBe(true);
    });

    it("setting same Matrix instance does not mark changed", () =>
    {
        const displayObject = new DisplayObject();
        const matrix = new Matrix(2, 0, 0, 2, 0, 0);
        displayObject.cacheAsBitmap = matrix;
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);

        displayObject.cacheAsBitmap = matrix;

        expect(displayObject.changed).toBe(false);
    });

    it("propagates changed to parent", () =>
    {
        const displayObject = new DisplayObject();
        const parent = new DisplayObject();
        displayObject.parent = parent;

        parent.changed = false;
        displayObject.changed = false;

        displayObject.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);

        expect(displayObject.changed).toBe(true);
        expect(parent.changed).toBe(true);
    });

    it("ignores invalid values (non-Matrix, non-null)", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        displayObject.cacheAsBitmap = "invalid" as any;

        expect(displayObject.cacheAsBitmap).toBe(null);
        expect(displayObject.changed).toBe(false);
    });
});
