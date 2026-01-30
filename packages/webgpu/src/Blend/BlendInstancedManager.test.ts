import { describe, it, expect, beforeEach } from "vitest";
import {
    getComplexBlendQueue,
    clearComplexBlendQueue,
    getInstancedShaderManager
} from "./BlendInstancedManager";

describe("BlendInstancedManager", () =>
{
    beforeEach(() =>
    {
        clearComplexBlendQueue();
    });

    describe("complex blend queue", () =>
    {
        it("should return empty array initially", () =>
        {
            const queue = getComplexBlendQueue();
            expect(queue).toBeInstanceOf(Array);
            expect(queue.length).toBe(0);
        });

        it("should clear the queue", () =>
        {
            const queue = getComplexBlendQueue();
            // Manually add item for testing
            queue.push({} as any);

            clearComplexBlendQueue();

            expect(getComplexBlendQueue().length).toBe(0);
        });

        it("should return same array reference before clear", () =>
        {
            const queue1 = getComplexBlendQueue();
            const queue2 = getComplexBlendQueue();

            expect(queue1).toBe(queue2);
        });

        it("should return new array after clear", () =>
        {
            const queue1 = getComplexBlendQueue();
            clearComplexBlendQueue();
            const queue2 = getComplexBlendQueue();

            expect(queue1).not.toBe(queue2);
        });
    });

    describe("instanced shader manager", () =>
    {
        it("should return shader manager instance", () =>
        {
            const manager = getInstancedShaderManager();

            expect(manager).toBeDefined();
            expect(typeof manager.count).toBe("number");
        });

        it("should return same instance on multiple calls", () =>
        {
            const manager1 = getInstancedShaderManager();
            const manager2 = getInstancedShaderManager();

            expect(manager1).toBe(manager2);
        });

        it("should have clear method", () =>
        {
            const manager = getInstancedShaderManager();

            expect(typeof manager.clear).toBe("function");
        });

        it("should track count", () =>
        {
            const manager = getInstancedShaderManager();
            manager.clear();

            expect(manager.count).toBe(0);

            manager.count++;
            expect(manager.count).toBe(1);

            manager.count += 5;
            expect(manager.count).toBe(6);

            manager.clear();
            expect(manager.count).toBe(0);
        });
    });
});
