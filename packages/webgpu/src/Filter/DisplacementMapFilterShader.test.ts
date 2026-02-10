import { describe, it, expect } from "vitest";
import { getDisplacementMapFilterFragmentShader, getDisplacementMapFilterShaderKey } from "./DisplacementMapFilterShader";

describe("DisplacementMapFilterShader", () =>
{
    describe("getDisplacementMapFilterFragmentShader", () =>
    {
        it("should return a valid WGSL shader string", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("@vertex");
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("@fragment");
        });

        it("should define DisplacementMapUniforms struct", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("struct DisplacementMapUniforms");
        });

        it("should include uvToStScale uniform", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("uvToStScale: vec2<f32>");
        });

        it("should include uvToStOffset uniform", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("uvToStOffset: vec2<f32>");
        });

        it("should include scale uniform", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("scale: vec2<f32>");
        });

        it("should include mapTexture binding", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("var mapTexture: texture_2d<f32>");
        });

        it("should include sourceTexture binding", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("var sourceTexture: texture_2d<f32>");
        });

        it("should include isInside helper function", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("fn isInside");
        });

        // Component channel tests
        it("should use mapColor.r for componentX = 1 (RED)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("mapColor.r");
        });

        it("should use mapColor.g for componentX = 2 (GREEN)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(2, 1, 0);

            expect(shader).toContain("vec2<f32>(mapColor.g, mapColor.r)");
        });

        it("should use mapColor.b for componentX = 4 (BLUE)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(4, 1, 0);

            expect(shader).toContain("vec2<f32>(mapColor.b, mapColor.r)");
        });

        it("should use mapColor.a for componentX = 8 (ALPHA)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(8, 1, 0);

            expect(shader).toContain("vec2<f32>(mapColor.a, mapColor.r)");
        });

        it("should use 0.5 for unknown component value", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(99, 99, 0);

            expect(shader).toContain("vec2<f32>(0.5, 0.5)");
        });

        // Mode tests
        it("should handle mode 0 (direct sampling)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("let sourceColor = textureSample(sourceTexture, sourceSampler, uv)");
            expect(shader).not.toContain("substituteColor");
        });

        it("should include substituteColor for mode 1", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 1);

            expect(shader).toContain("substituteColor: vec4<f32>");
            expect(shader).toContain("mix(substituteColor");
        });

        it("should handle mode 2 (wrap/repeat)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 2);

            expect(shader).toContain("fract(uv)");
        });

        it("should handle mode 3 (axis fallback)", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 3);

            expect(shader).toContain("fallbackUv");
        });

        it("should calculate offset from map color", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("let offset = vec2<f32>");
            expect(shader).toContain("- 0.5");
        });

        it("should calculate displaced UV", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("let uv = input.texCoord + offset * scale");
        });

        it("should mix original and displaced color based on map bounds", () =>
        {
            const shader = getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("mix(originalColor, sourceColor, isInside(st))");
        });
    });

    describe("getDisplacementMapFilterShaderKey", () =>
    {
        it("should generate unique key for component combination", () =>
        {
            const key = getDisplacementMapFilterShaderKey(1, 2, 0);

            expect(key).toBe("displacement_1_2_0");
        });

        it("should include all component and mode values", () =>
        {
            const key = getDisplacementMapFilterShaderKey(4, 8, 2);

            expect(key).toBe("displacement_4_8_2");
        });

        it("should generate different keys for different configurations", () =>
        {
            const key1 = getDisplacementMapFilterShaderKey(1, 2, 0);
            const key2 = getDisplacementMapFilterShaderKey(2, 1, 0);
            const key3 = getDisplacementMapFilterShaderKey(1, 2, 1);
            const key4 = getDisplacementMapFilterShaderKey(4, 8, 3);

            expect(key1).not.toBe(key2);
            expect(key1).not.toBe(key3);
            expect(key1).not.toBe(key4);
        });

        it("should include componentX in key", () =>
        {
            const key = getDisplacementMapFilterShaderKey(4, 2, 0);

            expect(key).toContain("_4_");
        });

        it("should include componentY in key", () =>
        {
            const key = getDisplacementMapFilterShaderKey(1, 8, 0);

            expect(key).toContain("_8_");
        });

        it("should include mode in key", () =>
        {
            const key = getDisplacementMapFilterShaderKey(1, 2, 3);

            expect(key).toContain("_3");
        });
    });
});
