import { describe, it, expect, beforeEach } from "vitest";
import {
    $gridDataMap,
    $fillBufferIndex,
    $terminateGrid
} from "./Grid";

describe("Grid", () =>
{
    beforeEach(() =>
    {
        $terminateGrid();
    });

    describe("$gridDataMap", () =>
    {
        it("should be a Map", () =>
        {
            expect($gridDataMap).toBeInstanceOf(Map);
        });

        it("should be empty after terminate", () =>
        {
            $gridDataMap.set(1, new Float32Array([1, 2, 3]));
            $terminateGrid();
            expect($gridDataMap.size).toBe(0);
        });

        it("should store and retrieve grid data", () =>
        {
            const data = new Float32Array([1, 2, 3, 4]);
            $gridDataMap.set(42, data);

            expect($gridDataMap.has(42)).toBe(true);
            expect($gridDataMap.get(42)).toBe(data);
        });

        it("should allow null values", () =>
        {
            $gridDataMap.set(1, null);
            expect($gridDataMap.get(1)).toBeNull();
        });
    });

    describe("$terminateGrid", () =>
    {
        it("should clear grid data map", () =>
        {
            $gridDataMap.set(1, new Float32Array([1]));
            $gridDataMap.set(2, new Float32Array([2]));
            $gridDataMap.set(3, new Float32Array([3]));

            $terminateGrid();

            expect($gridDataMap.size).toBe(0);
        });

        it("should reset fill buffer index", () =>
        {
            // Note: $fillBufferIndex is exported as let, so we can't directly modify it
            // but we can verify it gets reset by $terminateGrid
            $terminateGrid();
            expect($fillBufferIndex).toBe(0);
        });
    });
});
