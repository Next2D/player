import { MovieClip } from "../../MovieClip";
import { DisplayObject } from "../../DisplayObject";
import { execute } from "./MovieClipGetChildrenService";
import { describe, expect, it } from "vitest";

describe("MovieClipGetChildrenService.js test", () =>
{
    it("execute test case1 - returns children when no loaderInfo", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        const result = execute(movieClip, children);

        expect(result).toBe(children);
        expect(result.length).toBe(0);
    });

    it("execute test case2 - returns same array reference when passed", () =>
    {
        const movieClip = new MovieClip();
        const child1 = new DisplayObject();
        const child2 = new DisplayObject();
        const children: DisplayObject[] = [child1, child2];
        
        const result = execute(movieClip, children);

        expect(result).toBe(children);
        expect(result).toContain(child1);
        expect(result).toContain(child2);
    });

    it("execute test case3 - returns empty array reference", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        const result = execute(movieClip, children);

        expect(result).toBe(children);
        expect(result.length).toBe(0);
    });

    it("execute test case4 - verifies return type is array", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        const result = execute(movieClip, children);

        expect(Array.isArray(result)).toBe(true);
    });

    it("execute test case5 - preserves children array structure", () =>
    {
        const movieClip = new MovieClip();
        const displayObject1 = new DisplayObject();
        const displayObject2 = new DisplayObject();
        const displayObject3 = new DisplayObject();
        const children: DisplayObject[] = [displayObject1, displayObject2, displayObject3];
        
        const result = execute(movieClip, children);

        expect(result).toBe(children);
        expect(result.length).toBe(3);
    });

    it("execute test case6 - handles new MovieClip instance", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        expect(movieClip.loaderInfo).toBeDefined();
        
        const result = execute(movieClip, children);

        expect(result).toBe(children);
    });

    it("execute test case7 - function returns DisplayObject array", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        const result = execute(movieClip, children);

        expect(result).toBeInstanceOf(Array);
        expect(result).toBe(children);
    });

    it("execute test case8 - preserves original children reference", () =>
    {
        const movieClip = new MovieClip();
        const originalChildren: DisplayObject[] = [];
        
        const result = execute(movieClip, originalChildren);

        // Verify same reference
        expect(result).toBe(originalChildren);
        
        // Adding to result should affect originalChildren
        const newChild = new DisplayObject();
        result.push(newChild);
        expect(originalChildren).toContain(newChild);
    });

    it("execute test case9 - works with multiple MovieClip instances", () =>
    {
        const movieClip1 = new MovieClip();
        const movieClip2 = new MovieClip();
        const children1: DisplayObject[] = [];
        const children2: DisplayObject[] = [new DisplayObject()];
        
        const result1 = execute(movieClip1, children1);
        const result2 = execute(movieClip2, children2);

        expect(result1).toBe(children1);
        expect(result2).toBe(children2);
        expect(result1).not.toBe(result2);
    });

    it("execute test case10 - maintains array identity through multiple calls", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        const result1 = execute(movieClip, children);
        const result2 = execute(movieClip, children);
        const result3 = execute(movieClip, children);

        expect(result1).toBe(children);
        expect(result2).toBe(children);
        expect(result3).toBe(children);
        expect(result1).toBe(result2);
        expect(result2).toBe(result3);
    });

    it("execute test case11 - works with empty DisplayObject array", () =>
    {
        const movieClip = new MovieClip();
        const emptyArray: DisplayObject[] = [];
        
        const result = execute(movieClip, emptyArray);

        expect(result).toStrictEqual([]);
        expect(result).toBe(emptyArray);
    });

    it("execute test case12 - returns consistent results", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        const result = execute(movieClip, children);

        expect(typeof result).toBe("object");
        expect(result).toBeInstanceOf(Array);
        expect(result).toBe(children);
    });

    it("execute test case13 - handles large children arrays", () =>
    {
        const movieClip = new MovieClip();
        const largeChildren: DisplayObject[] = [];
        
        for (let i = 0; i < 100; i++) {
            largeChildren.push(new DisplayObject());
        }
        
        const result = execute(movieClip, largeChildren);

        expect(result).toBe(largeChildren);
        expect(result.length).toBe(100);
    });

    it("execute test case14 - preserves DisplayObject properties", () =>
    {
        const movieClip = new MovieClip();
        const displayObject = new DisplayObject();
        displayObject.name = "testObject";
        const children: DisplayObject[] = [displayObject];
        
        const result = execute(movieClip, children);

        expect(result).toBe(children);
        expect(result[0]).toBe(displayObject);
        expect(result[0].name).toBe("testObject");
    });

    it("execute test case15 - sequential execution consistency", () =>
    {
        const movieClip = new MovieClip();
        const children: DisplayObject[] = [];
        
        for (let i = 0; i < 5; i++) {
            const result = execute(movieClip, children);
            expect(result).toBe(children);
        }
    });
});
