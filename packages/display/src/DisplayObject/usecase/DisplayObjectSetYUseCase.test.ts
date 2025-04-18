import { execute } from "./DisplayObjectSetYUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectSetYUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$matrix).toBe(null);

        execute(displayObject, 150);

        expect(displayObject.changed).toBe(true);

        const rawData = displayObject.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(1);
        expect(rawData[1]).toBe(0);
        expect(rawData[2]).toBe(0);
        expect(rawData[3]).toBe(1);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(150);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        execute(displayObject, 0);
        expect(displayObject.changed).toBe(true);
    });
});