import { describe, it, expect } from "vitest";
import { getConvolutionFilterFragmentShader, getConvolutionFilterShaderKey } from "./ConvolutionFilterShader";

describe("ConvolutionFilterShader", () =>
{
    describe("getConvolutionFilterFragmentShader", () =>
    {
        it("should return a valid WGSL shader string", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("@vertex");
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("@fragment");
        });

        it("should define ConvolutionUniforms struct", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("struct ConvolutionUniforms");
        });

        it("should include rcpSize uniform", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("rcpSize: vec2<f32>");
        });

        it("should include rcpDivisor uniform", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("rcpDivisor: f32");
        });

        it("should include bias uniform", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("bias: f32");
        });

        it("should include substituteColor uniform", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("substituteColor: vec4<f32>");
        });

        it("should include matrix array", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("matrix: array<vec4<f32>");
        });

        it("should generate correct matrix size for 3x3", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);
            // 3x3 = 9 elements, ceil(9/4) = 3
            expect(shader).toContain("array<vec4<f32>, 3>");
        });

        it("should generate correct matrix size for 5x5", () =>
        {
            const shader = getConvolutionFilterFragmentShader(5, 5, true, true);
            // 5x5 = 25 elements, ceil(25/4) = 7
            expect(shader).toContain("array<vec4<f32>, 7>");
        });

        it("should include isInside helper function", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("fn isInside");
        });

        it("should include getMatrixWeight helper function", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("fn getMatrixWeight");
        });

        it("should include getWeightedColor helper function", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("fn getWeightedColor");
        });

        it("should preserve alpha when preserveAlpha is true", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("result.a = textureSample(sourceTexture, sourceSampler, input.texCoord).a");
        });

        it("should not preserve alpha when preserveAlpha is false", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, false, true);

            expect(shader).not.toContain("result.a = textureSample(sourceTexture, sourceSampler, input.texCoord).a");
        });

        it("should include substituteColor handling when clamp is false", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, false);

            expect(shader).toContain("substituteColor");
            expect(shader).toContain("mix(substituteColor, color, isInside(uv))");
        });

        it("should not include substituteColor handling when clamp is true", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);
            // Should still have substituteColor in uniforms but not the mix statement
            expect(shader).not.toContain("mix(substituteColor, color, isInside(uv))");
        });

        it("should clamp result values", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("clamp(result * rcpDivisor + bias");
        });

        it("should premultiply result", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("result.rgb * result.a");
        });

        it("should unpremultiply color for processing", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            expect(shader).toContain("color.rgb / max(0.0001, color.a)");
        });

        it("should generate 9 getWeightedColor calls for 3x3 matrix", () =>
        {
            const shader = getConvolutionFilterFragmentShader(3, 3, true, true);

            let count = 0;
            for (let i = 0; i < 9; i++) {
                if (shader.includes(`getWeightedColor(${i}`)) {
                    count++;
                }
            }

            expect(count).toBe(9);
        });

        it("should handle asymmetric matrix sizes", () =>
        {
            const shader = getConvolutionFilterFragmentShader(5, 3, true, true);
            // 5x3 = 15 elements, ceil(15/4) = 4
            expect(shader).toContain("array<vec4<f32>, 4>");
        });
    });

    describe("getConvolutionFilterShaderKey", () =>
    {
        it("should generate unique key for 3x3 with preserveAlpha and clamp", () =>
        {
            const key = getConvolutionFilterShaderKey(3, 3, true, true);

            expect(key).toBe("convolution_3x3_pa_c");
        });

        it("should generate unique key for 5x5 without preserveAlpha and without clamp", () =>
        {
            const key = getConvolutionFilterShaderKey(5, 5, false, false);

            expect(key).toBe("convolution_5x5_npa_nc");
        });

        it("should include matrix dimensions in key", () =>
        {
            const key = getConvolutionFilterShaderKey(7, 3, true, true);

            expect(key).toContain("7x3");
        });

        it("should include preserveAlpha flag in key", () =>
        {
            const keyWithPA = getConvolutionFilterShaderKey(3, 3, true, true);
            const keyWithoutPA = getConvolutionFilterShaderKey(3, 3, false, true);

            expect(keyWithPA).toContain("_pa_");
            expect(keyWithoutPA).toContain("_npa_");
        });

        it("should include clamp flag in key", () =>
        {
            const keyWithClamp = getConvolutionFilterShaderKey(3, 3, true, true);
            const keyWithoutClamp = getConvolutionFilterShaderKey(3, 3, true, false);

            expect(keyWithClamp).toContain("_c");
            expect(keyWithoutClamp).toContain("_nc");
        });

        it("should generate different keys for different configurations", () =>
        {
            const key1 = getConvolutionFilterShaderKey(3, 3, true, true);
            const key2 = getConvolutionFilterShaderKey(3, 3, false, true);
            const key3 = getConvolutionFilterShaderKey(3, 3, true, false);
            const key4 = getConvolutionFilterShaderKey(5, 5, true, true);

            expect(key1).not.toBe(key2);
            expect(key1).not.toBe(key3);
            expect(key1).not.toBe(key4);
        });
    });
});
