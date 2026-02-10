import { describe, it, expect } from "vitest";
import { execute } from "./BufferManagerUpperPowerOfTwoService";

describe("BufferManagerUpperPowerOfTwoService", () =>
{
    it("should return 1 for input 1", () =>
    {
        expect(execute(1)).toBe(1);
    });

    it("should return same value for power of two inputs", () =>
    {
        expect(execute(2)).toBe(2);
        expect(execute(4)).toBe(4);
        expect(execute(8)).toBe(8);
        expect(execute(16)).toBe(16);
        expect(execute(32)).toBe(32);
        expect(execute(64)).toBe(64);
        expect(execute(128)).toBe(128);
        expect(execute(256)).toBe(256);
        expect(execute(512)).toBe(512);
        expect(execute(1024)).toBe(1024);
    });

    it("should round up non-power of two values", () =>
    {
        expect(execute(3)).toBe(4);
        expect(execute(5)).toBe(8);
        expect(execute(6)).toBe(8);
        expect(execute(7)).toBe(8);
        expect(execute(9)).toBe(16);
        expect(execute(15)).toBe(16);
        expect(execute(17)).toBe(32);
        expect(execute(100)).toBe(128);
        expect(execute(200)).toBe(256);
        expect(execute(500)).toBe(512);
        expect(execute(1000)).toBe(1024);
    });

    it("should handle large values", () =>
    {
        expect(execute(2048)).toBe(2048);
        expect(execute(2049)).toBe(4096);
        expect(execute(4096)).toBe(4096);
        expect(execute(4097)).toBe(8192);
    });

    it("should handle edge cases", () =>
    {
        // 0 -> 0 (edge case behavior)
        expect(execute(0)).toBe(0);
    });

    it("should handle typical texture sizes", () =>
    {
        // Common texture dimension patterns
        expect(execute(640)).toBe(1024);
        expect(execute(480)).toBe(512);
        expect(execute(1920)).toBe(2048);
        expect(execute(1080)).toBe(2048);
    });
});
