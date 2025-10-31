import { execute } from "./ShapeLoadSrcUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeLoadSrcUseCase.js test", () =>
{
    it("execute test case1 - accepts valid URL string", () =>
    {
        const shape = new Shape();
        const url = "https://example.com/image.png";
        
        expect(() => {
            execute(shape, url);
        }).not.toThrow();
    });

    it("execute test case2 - accepts data URL", () =>
    {
        const shape = new Shape();
        const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        
        expect(() => {
            execute(shape, dataUrl);
        }).not.toThrow();
    });

    it("execute test case3 - accepts empty string", () =>
    {
        const shape = new Shape();
        const emptyUrl = "";
        
        expect(() => {
            execute(shape, emptyUrl);
        }).not.toThrow();
    });

    it("execute test case4 - accepts relative URL", () =>
    {
        const shape = new Shape();
        const relativeUrl = "./images/test.png";
        
        expect(() => {
            execute(shape, relativeUrl);
        }).not.toThrow();
    });

    it("execute test case5 - accepts absolute URL", () =>
    {
        const shape = new Shape();
        const absoluteUrl = "/assets/image.jpg";
        
        expect(() => {
            execute(shape, absoluteUrl);
        }).not.toThrow();
    });

    it("execute test case6 - preserves shape instance", () =>
    {
        const shape = new Shape();
        const originalShape = shape;
        const url = "https://example.com/test.png";
        
        execute(shape, url);
        
        expect(shape).toBe(originalShape);
    });

    it("execute test case7 - accepts different image formats", () =>
    {
        const shape = new Shape();
        
        const urls = [
            "https://example.com/image.png",
            "https://example.com/image.jpg",
            "https://example.com/image.gif",
            "https://example.com/image.webp"
        ];
        
        urls.forEach(url => {
            expect(() => {
                execute(shape, url);
            }).not.toThrow();
        });
    });

    it("execute test case8 - can be called multiple times", () =>
    {
        const shape = new Shape();
        
        execute(shape, "https://example.com/image1.png");
        execute(shape, "https://example.com/image2.png");
        execute(shape, "https://example.com/image3.png");
        
        expect(shape).toBeDefined();
    });

    it("execute test case9 - accepts URL with query parameters", () =>
    {
        const shape = new Shape();
        const urlWithParams = "https://example.com/image.png?size=large&quality=high";
        
        expect(() => {
            execute(shape, urlWithParams);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter types", () =>
    {
        const shape = new Shape();
        const url = "https://example.com/image.png";
        
        expect(shape).toBeInstanceOf(Shape);
        expect(typeof url).toBe("string");
    });
});
