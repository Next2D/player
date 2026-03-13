import { execute } from "./BufferManagerReleaseStorageBufferUseCase";
import { describe, expect, it } from "vitest";

describe("BufferManagerReleaseStorageBufferUseCase.js test", () => {

    it("execute test case1 - should mark matching buffer as not in use", () =>
    {
        const targetBuffer = { "label": "target" } as unknown as GPUBuffer;
        const pool = [
            { "buffer": { "label": "other" } as unknown as GPUBuffer, "inUse": true, "lastUsedFrame": 0, "size": 256 },
            { "buffer": targetBuffer, "inUse": true, "lastUsedFrame": 0, "size": 256 }
        ] as any;

        execute(pool, targetBuffer);

        expect(pool[0].inUse).toBe(true);
        expect(pool[1].inUse).toBe(false);
    });

    it("execute test case2 - should do nothing if buffer not found", () =>
    {
        const targetBuffer = { "label": "target" } as unknown as GPUBuffer;
        const pool = [
            { "buffer": { "label": "other" } as unknown as GPUBuffer, "inUse": true, "lastUsedFrame": 0, "size": 256 }
        ] as any;

        execute(pool, targetBuffer);

        expect(pool[0].inUse).toBe(true);
    });

    it("execute test case3 - empty pool", () =>
    {
        const targetBuffer = {} as unknown as GPUBuffer;
        const pool: any[] = [];

        execute(pool, targetBuffer);

        expect(pool.length).toBe(0);
    });

    it("execute test case4 - should release first matching buffer only", () =>
    {
        const targetBuffer = {} as unknown as GPUBuffer;
        const pool = [
            { "buffer": targetBuffer, "inUse": true, "lastUsedFrame": 0, "size": 256 },
            { "buffer": targetBuffer, "inUse": true, "lastUsedFrame": 0, "size": 512 }
        ] as any;

        execute(pool, targetBuffer);

        expect(pool[0].inUse).toBe(false);
        expect(pool[1].inUse).toBe(true);
    });
});
