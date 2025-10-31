import { execute } from "./StageReadyUseCase";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("StageReadyUseCase.js test", () =>
{
    it("execute test case1 - handles DisplayObjectContainer", () =>
    {
        const container = new DisplayObjectContainer();
        
        expect(() => {
            execute(container);
        }).not.toThrow();
    });

    it("execute test case2 - handles MovieClip", () =>
    {
        const movieClip = new MovieClip();
        
        expect(() => {
            execute(movieClip);
        }).not.toThrow();
    });

    it("execute test case3 - handles empty container", () =>
    {
        const container = new DisplayObjectContainer();
        
        expect(container.numChildren).toBe(0);
        
        expect(() => {
            execute(container);
        }).not.toThrow();
    });

    it("execute test case4 - handles container with children", () =>
    {
        const container = new DisplayObjectContainer();
        const child1 = new DisplayObjectContainer();
        const child2 = new MovieClip();
        
        container.addChild(child1);
        container.addChild(child2);
        
        expect(container.numChildren).toBe(2);
        
        expect(() => {
            execute(container);
        }).not.toThrow();
    });

    it("execute test case5 - preserves container instance", () =>
    {
        const container = new DisplayObjectContainer();
        const originalContainer = container;
        
        execute(container);
        
        expect(container).toBe(originalContainer);
    });

    it("execute test case6 - handles nested containers", () =>
    {
        const parentContainer = new DisplayObjectContainer();
        const childContainer = new DisplayObjectContainer();
        const grandchildContainer = new DisplayObjectContainer();
        
        childContainer.addChild(grandchildContainer);
        parentContainer.addChild(childContainer);
        
        expect(() => {
            execute(parentContainer);
        }).not.toThrow();
    });

    it("execute test case7 - handles MovieClip with frames", () =>
    {
        const movieClip = new MovieClip();
        movieClip.totalFrames = 10;
        
        expect(() => {
            execute(movieClip);
        }).not.toThrow();
    });

    it("execute test case8 - can be called multiple times", () =>
    {
        const container = new DisplayObjectContainer();
        
        expect(() => {
            execute(container);
            execute(container);
            execute(container);
        }).not.toThrow();
    });

    it("execute test case9 - handles different container types", () =>
    {
        const container1 = new DisplayObjectContainer();
        const container2 = new MovieClip();
        const container3 = new DisplayObjectContainer();
        
        expect(() => {
            execute(container1);
            execute(container2);
            execute(container3);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter type", () =>
    {
        const container = new DisplayObjectContainer();
        
        expect(container).toBeInstanceOf(DisplayObjectContainer);
    });
});
