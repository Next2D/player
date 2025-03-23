import { execute } from "./DisplayObjectSetAlphaUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectSetAlphaUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$alpha).toBe(null);
        expect(displayObject.$colorTransform).toBe(null);

        execute(displayObject, 0.5);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$alpha).toBe(0.5);

        const rawData = displayObject.$colorTransform?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(1);
        expect(rawData[1]).toBe(1);
        expect(rawData[2]).toBe(1);
        expect(rawData[3]).toBe(0.5);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
        expect(rawData[6]).toBe(0);
        expect(rawData[7]).toBe(0);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$alpha  = 0.2;
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$alpha).toBe(0.2);

        execute(displayObject, 0.2);
        
        expect(displayObject.changed).toBe(false);
        expect(displayObject.$alpha).toBe(0.2);
    });
});