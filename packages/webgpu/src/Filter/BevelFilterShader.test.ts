import { describe, it, expect } from "vitest";
import { getBevelFilterFragmentShader, getBevelFilterShaderKey } from "./BevelFilterShader";

describe("BevelFilterShader", () =>
{
    describe("getBevelFilterFragmentShader", () =>
    {
        it("should return a valid WGSL shader string for full type", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, false);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should return a valid shader for inner type", () =>
        {
            const shader = getBevelFilterFragmentShader("inner", false, false);

            expect(shader).toContain("filterColor * baseAlpha");
        });

        it("should return a valid shader for outer type", () =>
        {
            const shader = getBevelFilterFragmentShader("outer", false, false);

            expect(shader).toContain("filterColor * (1.0 - baseAlpha)");
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, false);

            expect(shader).toContain("@vertex");
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, false);

            expect(shader).toContain("@fragment");
        });

        it("should define BevelUniforms struct", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, false);

            expect(shader).toContain("struct BevelUniforms");
        });

        it("should include highlight and shadow colors", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, false);

            expect(shader).toContain("highlightColor");
            expect(shader).toContain("shadowColor");
        });

        it("should handle knockout mode", () =>
        {
            const shader = getBevelFilterFragmentShader("full", true, false);

            expect(shader).toContain("finalColor");
        });

        it("should include gradient texture binding when isGradient is true", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, true);

            expect(shader).toContain("gradientTexture");
        });

        it("should not include gradient texture binding when isGradient is false", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, false);

            expect(shader).not.toContain("gradientTexture");
        });

        it("should use gradient LUT when isGradient is true", () =>
        {
            const shader = getBevelFilterFragmentShader("full", false, true);

            expect(shader).toContain("gradientCoord");
        });
    });

    describe("getBevelFilterShaderKey", () =>
    {
        it("should generate unique key for full type", () =>
        {
            const key = getBevelFilterShaderKey("full", false, false);

            expect(key).toBe("bevel_full_nko_ng");
        });

        it("should generate unique key for inner type with knockout", () =>
        {
            const key = getBevelFilterShaderKey("inner", true, false);

            expect(key).toBe("bevel_inner_ko_ng");
        });

        it("should generate unique key for outer type with gradient", () =>
        {
            const key = getBevelFilterShaderKey("outer", false, true);

            expect(key).toBe("bevel_outer_nko_g");
        });

        it("should generate different keys for different configurations", () =>
        {
            const key1 = getBevelFilterShaderKey("full", false, false);
            const key2 = getBevelFilterShaderKey("full", true, false);
            const key3 = getBevelFilterShaderKey("full", false, true);

            expect(key1).not.toBe(key2);
            expect(key1).not.toBe(key3);
            expect(key2).not.toBe(key3);
        });
    });
});
