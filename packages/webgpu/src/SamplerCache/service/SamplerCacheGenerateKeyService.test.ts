import { describe, it, expect } from "vitest";
import { execute } from "./SamplerCacheGenerateKeyService";

describe("SamplerCacheGenerateKeyService", () =>
{
    it("should generate key with all linear filters", () =>
    {
        const result = execute("linear", "linear", "clamp-to-edge", "clamp-to-edge");
        expect(result).toBe("linear_linear_clamp-to-edge_clamp-to-edge");
    });

    it("should generate key with all nearest filters", () =>
    {
        const result = execute("nearest", "nearest", "repeat", "repeat");
        expect(result).toBe("nearest_nearest_repeat_repeat");
    });

    it("should generate key with mixed filters", () =>
    {
        const result = execute("linear", "nearest", "clamp-to-edge", "repeat");
        expect(result).toBe("linear_nearest_clamp-to-edge_repeat");
    });

    it("should generate unique keys for different configurations", () =>
    {
        const key1 = execute("linear", "linear", "clamp-to-edge", "clamp-to-edge");
        const key2 = execute("nearest", "nearest", "clamp-to-edge", "clamp-to-edge");
        const key3 = execute("linear", "linear", "repeat", "repeat");

        expect(key1).not.toBe(key2);
        expect(key1).not.toBe(key3);
        expect(key2).not.toBe(key3);
    });

    it("should generate same key for same configuration", () =>
    {
        const key1 = execute("linear", "nearest", "repeat", "mirror-repeat");
        const key2 = execute("linear", "nearest", "repeat", "mirror-repeat");

        expect(key1).toBe(key2);
    });

    it("should handle mirror-repeat address mode", () =>
    {
        const result = execute("linear", "linear", "mirror-repeat", "mirror-repeat");
        expect(result).toBe("linear_linear_mirror-repeat_mirror-repeat");
    });

    it("should differentiate address modes U and V", () =>
    {
        const key1 = execute("linear", "linear", "repeat", "clamp-to-edge");
        const key2 = execute("linear", "linear", "clamp-to-edge", "repeat");

        expect(key1).not.toBe(key2);
    });
});
