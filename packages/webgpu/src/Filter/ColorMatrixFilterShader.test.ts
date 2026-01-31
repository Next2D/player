import { describe, it, expect } from "vitest";
import { ColorMatrixFilterShader } from "./ColorMatrixFilterShader";

describe("ColorMatrixFilterShader", () =>
{
    describe("getVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ColorMatrixFilterShader.getVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ColorMatrixFilterShader.getVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define VertexInput struct", () =>
        {
            const shader = ColorMatrixFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexInput");
        });

        it("should define VertexOutput struct", () =>
        {
            const shader = ColorMatrixFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexOutput");
        });
    });

    describe("getFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define ColorMatrixUniforms struct", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("struct ColorMatrixUniforms");
        });

        it("should include matrix uniform", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("matrix: mat4x4<f32>");
        });

        it("should include offset uniform", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("offset: vec4<f32>");
        });

        it("should apply matrix transformation", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("uniforms.matrix * color");
        });

        it("should apply offset", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("+ uniforms.offset");
        });

        it("should clamp result to 0-1 range", () =>
        {
            const shader = ColorMatrixFilterShader.getFragmentShader();

            expect(shader).toContain("clamp");
        });
    });
});
