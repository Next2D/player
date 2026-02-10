import { describe, it, expect } from "vitest";
import { GlowFilterShader } from "./GlowFilterShader";

describe("GlowFilterShader", () =>
{
    describe("getVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = GlowFilterShader.getVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = GlowFilterShader.getVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define VertexInput struct", () =>
        {
            const shader = GlowFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexInput");
        });

        it("should define VertexOutput struct", () =>
        {
            const shader = GlowFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexOutput");
        });
    });

    describe("getFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define GlowUniforms struct", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(shader).toContain("struct GlowUniforms");
        });

        it("should include glow parameters", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(shader).toContain("glowColor");
            expect(shader).toContain("strength");
            expect(shader).toContain("inner");
            expect(shader).toContain("knockout");
        });

        it("should handle inner glow mode", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(shader).toContain("uniforms.inner");
        });

        it("should handle knockout mode", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(shader).toContain("uniforms.knockout");
        });

        it("should include texture sampling", () =>
        {
            const shader = GlowFilterShader.getFragmentShader();

            expect(shader).toContain("textureSample");
        });
    });
});
