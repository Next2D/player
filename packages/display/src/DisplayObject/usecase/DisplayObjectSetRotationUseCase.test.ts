import { execute } from "./DisplayObjectSetRotationUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectSetRotationUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$rotation).toBe(null);
        expect(displayObject.$matrix).toBe(null);

        execute(displayObject, 12);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$rotation).toBe(12);

        const rawData = displayObject.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(0.9781476259231567);
        expect(rawData[1]).toBe(0.2079116851091385);
        expect(rawData[2]).toBe(-0.2079116851091385);
        expect(rawData[3]).toBe(0.9781476259231567);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$rotation  = 32;
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$rotation).toBe(32);

        execute(displayObject, 32);
        
        expect(displayObject.changed).toBe(false);
        expect(displayObject.$rotation).toBe(32);
    });
});