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

    // Regression guard for issue #274: scaleX×sin(rotation) が ±1 になる組み合わせ
    // (例: scaleX=2, rotation=30°) でも a/d が維持されることを確認する。
    it("preserves matrix.a when scaleX * sin(rotation) happens to equal 1 (issue #274)", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.scaleX = 2;
        displayObject.scaleY = 1;
        displayObject.rotation = 30;

        const rawData = displayObject.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        // a = scaleX * cos(30°) = 2 * 0.866 ≈ 1.732
        expect(rawData[0]).toBeCloseTo(1.7320508, 5);
        // b = scaleX * sin(30°) = 2 * 0.5 = 1
        expect(rawData[1]).toBeCloseTo(1, 5);
        // c = -scaleY * sin(30°) = -0.5
        expect(rawData[2]).toBeCloseTo(-0.5, 5);
        // d = scaleY * cos(30°) ≈ 0.866
        expect(rawData[3]).toBeCloseTo(0.8660254, 5);
    });
});