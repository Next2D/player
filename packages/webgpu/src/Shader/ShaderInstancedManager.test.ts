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
        it("should initialize count to 0", () =>
        {
            const manager = new ShaderInstancedManager();

            expect(manager.count).toBe(0);
        });
    });

    describe("count", () =>
    {
        it("should be mutable", () =>
        {
            const manager = new ShaderInstancedManager();

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
            const manager = new ShaderInstancedManager();
            manager.count = 50;

            manager.clear();

            expect(manager.count).toBe(0);
        });

        it("should reset renderQueue offset to 0", () =>
        {
            const manager = new ShaderInstancedManager();
            (renderQueue as any).offset = 100;

            manager.clear();

            expect(renderQueue.offset).toBe(0);
        });

        it("should reset both count and offset simultaneously", () =>
        {
            const manager = new ShaderInstancedManager();
            manager.count = 25;
            (renderQueue as any).offset = 50;

            manager.clear();

            expect(manager.count).toBe(0);
            expect(renderQueue.offset).toBe(0);
        });
    });
});
