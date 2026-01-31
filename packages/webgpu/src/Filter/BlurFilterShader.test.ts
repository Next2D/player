import { describe, it, expect } from "vitest";
import { BlurFilterShader } from "./BlurFilterShader";

describe("BlurFilterShader", () =>
{
    describe("getVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = BlurFilterShader.getVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = BlurFilterShader.getVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should contain main function", () =>
        {
            const shader = BlurFilterShader.getVertexShader();

            expect(shader).toContain("fn main");
        });

        it("should define VertexInput struct", () =>
        {
            const shader = BlurFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexInput");
        });

        it("should define VertexOutput struct", () =>
        {
            const shader = BlurFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexOutput");
        });

        it("should include position and texCoord attributes", () =>
        {
            const shader = BlurFilterShader.getVertexShader();

            expect(shader).toContain("@location(0) position");
            expect(shader).toContain("@location(1) texCoord");
        });
    });

    describe("getHorizontalBlurShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlurFilterShader.getHorizontalBlurShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlurFilterShader.getHorizontalBlurShader();

            expect(shader).toContain("@fragment");
        });

        it("should define BlurUniforms struct", () =>
        {
            const shader = BlurFilterShader.getHorizontalBlurShader();

            expect(shader).toContain("struct BlurUniforms");
        });

        it("should include blur parameters", () =>
        {
            const shader = BlurFilterShader.getHorizontalBlurShader();

            expect(shader).toContain("blurSize");
            expect(shader).toContain("textureWidth");
        });

        it("should use textureWidth for horizontal sampling", () =>
        {
            const shader = BlurFilterShader.getHorizontalBlurShader();

            expect(shader).toContain("1.0 / uniforms.textureWidth");
        });

        it("should include texture sampling", () =>
        {
            const shader = BlurFilterShader.getHorizontalBlurShader();

            expect(shader).toContain("textureSample");
        });
    });

    describe("getVerticalBlurShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlurFilterShader.getVerticalBlurShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlurFilterShader.getVerticalBlurShader();

            expect(shader).toContain("@fragment");
        });

        it("should define BlurUniforms struct", () =>
        {
            const shader = BlurFilterShader.getVerticalBlurShader();

            expect(shader).toContain("struct BlurUniforms");
        });

        it("should use textureHeight for vertical sampling", () =>
        {
            const shader = BlurFilterShader.getVerticalBlurShader();

            expect(shader).toContain("1.0 / uniforms.textureHeight");
        });

        it("should include y-axis offset calculation", () =>
        {
            const shader = BlurFilterShader.getVerticalBlurShader();

            expect(shader).toContain("input.texCoord.y + offset");
        });
    });
});
