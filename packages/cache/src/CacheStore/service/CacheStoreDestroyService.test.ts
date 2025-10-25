import { execute } from "./CacheStoreDestroyService";
import { describe, expect, it, vi } from "vitest";

describe("CacheStoreDestroyService.js test", () =>
{
    it("test case1", () =>
    {
        const pool = [];
        expect(pool.length).toBe(0);

        execute(pool, null);
        expect(pool.length).toBe(0);
    });

    it("test case2", () =>
    {
        let state = "";
        const MockContext = vi.fn(function(this: any) {
            this.canvas = {
                "width": 100,
                "height": 200
            };
            this.clearRect = vi.fn(() => { state = "clear" });
        }) as any;
        
        const pool: HTMLCanvasElement[] = [];
        const mockContext = new MockContext();
        expect(pool.length).toBe(0);
        expect(state).toBe("");
        expect(mockContext.canvas.width).toBe(100);
        expect(mockContext.canvas.height).toBe(200);

        execute(pool, mockContext);

        expect(pool.length).toBe(1);
        expect(state).toBe("clear");
        expect(mockContext.canvas.width).toBe(1);
        expect(mockContext.canvas.height).toBe(1);
    });
});
