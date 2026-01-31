import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShaderInstancedManager } from "./ShaderInstancedManager";

// Mock render-queue
vi.mock("@next2d/render-queue", () => ({
    "renderQueue": {
        "offset": 0
    }
}));

import { renderQueue } from "@next2d/render-queue";

describe("ShaderInstancedManager", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        (renderQueue as any).offset = 0;
    });

    describe("constructor", () =>
    {
        it("should create instance with pipeline name", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");

            expect(manager.pipelineName).toBe("testPipeline");
        });

        it("should set isAtlas to true by default", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");

            expect(manager.isAtlas).toBe(true);
        });

        it("should allow setting isAtlas to false", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline", false);

            expect(manager.isAtlas).toBe(false);
        });

        it("should initialize count to 0", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");

            expect(manager.count).toBe(0);
        });
    });

    describe("pipelineName", () =>
    {
        it("should be readonly", () =>
        {
            const manager = new ShaderInstancedManager("myPipeline");

            expect(manager.pipelineName).toBe("myPipeline");
        });

        it("should preserve the exact name given", () =>
        {
            const name = "fill_gradient_atlas";
            const manager = new ShaderInstancedManager(name);

            expect(manager.pipelineName).toBe(name);
        });
    });

    describe("count", () =>
    {
        it("should be mutable", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");

            manager.count = 10;
            expect(manager.count).toBe(10);

            manager.count = 100;
            expect(manager.count).toBe(100);
        });
    });

    describe("clear", () =>
    {
        it("should reset count to 0", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");
            manager.count = 50;

            manager.clear();

            expect(manager.count).toBe(0);
        });

        it("should reset renderQueue offset to 0", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");
            (renderQueue as any).offset = 100;

            manager.clear();

            expect(renderQueue.offset).toBe(0);
        });

        it("should reset both count and offset simultaneously", () =>
        {
            const manager = new ShaderInstancedManager("testPipeline");
            manager.count = 25;
            (renderQueue as any).offset = 50;

            manager.clear();

            expect(manager.count).toBe(0);
            expect(renderQueue.offset).toBe(0);
        });
    });
});
