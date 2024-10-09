import { execute } from "./DisplayObjectGetPlaceObjectService";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetPlaceObjectService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();

        const mockPlaceObject = {
            "matrix": [1, 2, 3, 4, 5, 6]
        };
        displayObject.placeObject = mockPlaceObject;
        expect(displayObject.placeObject).toBe(mockPlaceObject);

        execute(displayObject);
        expect(displayObject.placeObject).toBe(mockPlaceObject);
    });
});