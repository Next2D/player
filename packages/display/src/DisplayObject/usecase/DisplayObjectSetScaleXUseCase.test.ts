import { execute } from "./DisplayObjectSetScaleXUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectSetScaleXUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$scaleX).toBe(null);
        expect(displayObject.$matrix).toBe(null);

        execute(displayObject, 1.5);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$scaleX).toBe(1.5);

        const rawData = displayObject.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(1.5);
        expect(rawData[1]).toBe(0);
        expect(rawData[2]).toBe(0);
        expect(rawData[3]).toBe(1);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$scaleX  = 2.2;
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$scaleX).toBe(2.2);

        execute(displayObject, 2.2);
        
        expect(displayObject.changed).toBe(false);
        expect(displayObject.$scaleX).toBe(2.2);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$scaleX).toBe(null);

        execute(displayObject, 2.2);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$scaleX).toBe(2.2);
    });

    it("execute test case4", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$scaleX).toBe(null);

        execute(displayObject, "a" as unknown as number);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$scaleX).toBe(1);
    });

    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;
        
        expect(displayObject.changed).toBe(false);
        expect(displayObject.$scaleX).toBe(null);
        expect(displayObject.$matrix).toBe(null);

        displayObject.rotation = 289;
        execute(displayObject, -1.5);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$scaleX).toBe(-1.5);

        execute(displayObject, 0.67);

        const rawData = displayObject.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(0.2181306779384613);
        expect(rawData[1]).toBe(-0.633497416973114);
        expect(rawData[2]).toBe(0.9455185532569885);
        expect(rawData[3]).toBe(0.32556816935539246);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
    });
});