import { describe, it, expect } from "vitest";
import { getBitmapFilterFragmentShader, getBitmapFilterShaderKey } from "./BitmapFilterShader";

describe("BitmapFilterShader", () =>
{
    describe("getBitmapFilterFragmentShader", () =>
    {
        it("should return a valid WGSL shader string", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "full", false, true, false);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "full", false, true, false);

            expect(shader).toContain("@vertex");
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "full", false, true, false);

            expect(shader).toContain("@fragment");
        });

        it("should define BitmapFilterUniforms struct", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "full", false, true, false);

            expect(shader).toContain("struct BitmapFilterUniforms");
        });

        it("should include base scale/offset when transformsBase is true", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, false, true, "full", false, false, false);

            expect(shader).toContain("baseScale");
            expect(shader).toContain("baseOffset");
        });

        it("should include blur scale/offset when transformsBlur is true", () =>
        {
            const shader = getBitmapFilterFragmentShader(false, true, true, "full", false, false, false);

            expect(shader).toContain("blurScale");
            expect(shader).toContain("blurOffset");
        });

        it("should include strength when appliesStrength is true", () =>
        {
            const shader = getBitmapFilterFragmentShader(false, false, true, "full", false, true, false);

            expect(shader).toContain("strength");
        });

        it("should include color for glow mode", () =>
        {
            const shader = getBitmapFilterFragmentShader(false, false, true, "full", false, false, false);

            expect(shader).toContain("color");
        });

        it("should include highlight/shadow colors for bevel mode", () =>
        {
            const shader = getBitmapFilterFragmentShader(false, false, false, "full", false, false, false);

            expect(shader).toContain("highlightColor");
            expect(shader).toContain("shadowColor");
        });

        it("should include gradient texture when isGradient is true", () =>
        {
            const shader = getBitmapFilterFragmentShader(false, false, true, "full", false, false, true);

            expect(shader).toContain("gradientTexture");
        });

        it("should handle inner type", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "inner", false, true, false);

            expect(shader).toContain("blur");
        });

        it("should handle outer type", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "outer", false, true, false);

            expect(shader).toContain("blur");
        });

        it("should handle knockout mode", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "full", true, true, false);

            expect(shader).toBeDefined();
        });

        it("should include isInside helper function", () =>
        {
            const shader = getBitmapFilterFragmentShader(true, true, true, "full", false, true, false);

            expect(shader).toContain("fn isInside");
        });
    });

    describe("getBitmapFilterShaderKey", () =>
    {
        it("should generate unique key for glow configuration", () =>
        {
            const key = getBitmapFilterShaderKey(true, true, true, "full", false, true, false);

            expect(key).toBe("bitmap_yygfullnsso");
        });

        it("should generate unique key for bevel configuration", () =>
        {
            const key = getBitmapFilterShaderKey(true, true, false, "full", false, true, false);

            expect(key).toBe("bitmap_yybfullnsso");
        });

        it("should generate different keys for different configurations", () =>
        {
            const key1 = getBitmapFilterShaderKey(true, true, true, "full", false, true, false);
            const key2 = getBitmapFilterShaderKey(true, true, true, "inner", false, true, false);
            const key3 = getBitmapFilterShaderKey(true, true, true, "full", true, true, false);

            expect(key1).not.toBe(key2);
            expect(key1).not.toBe(key3);
        });

        it("should include gradient flag in key", () =>
        {
            const keyNonGradient = getBitmapFilterShaderKey(true, true, true, "full", false, true, false);
            const keyGradient = getBitmapFilterShaderKey(true, true, true, "full", false, true, true);

            expect(keyNonGradient).toContain("so");
            expect(keyGradient).toContain("gr");
        });
    });
});
