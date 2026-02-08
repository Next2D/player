import { describe, it, expect } from "vitest";
import { BlendModeShader } from "./BlendModeShader";

describe("BlendModeShader", () =>
{
    describe("getVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define VertexInput struct", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(shader).toContain("struct VertexInput");
        });

        it("should define VertexOutput struct", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(shader).toContain("struct VertexOutput");
        });

        it("should include position in VertexInput", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(shader).toContain("@location(0) position: vec2<f32>");
        });

        it("should include texCoord in VertexInput", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(shader).toContain("@location(1) texCoord: vec2<f32>");
        });

        it("should output position with @builtin(position)", () =>
        {
            const shader = BlendModeShader.getVertexShader();

            expect(shader).toContain("@builtin(position) position: vec4<f32>");
        });
    });

    describe("getMultiplyShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(shader).toContain("@fragment");
        });

        it("should define BlendUniforms struct", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(shader).toContain("struct BlendUniforms");
        });

        it("should include colorTransform uniform", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(shader).toContain("colorTransform: vec4<f32>");
        });

        it("should include addColor uniform", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(shader).toContain("addColor: vec4<f32>");
        });

        it("should have two texture bindings for dst and src", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(shader).toContain("var texture0: texture_2d<f32>");
            expect(shader).toContain("var texture1: texture_2d<f32>");
        });

        it("should implement multiply blend formula", () =>
        {
            const shader = BlendModeShader.getMultiplyShader();

            expect(shader).toContain("src * dst");
        });
    });

    describe("getScreenShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getScreenShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getScreenShader();

            expect(shader).toContain("@fragment");
        });

        it("should define BlendUniforms struct", () =>
        {
            const shader = BlendModeShader.getScreenShader();

            expect(shader).toContain("struct BlendUniforms");
        });

        it("should implement screen blend formula", () =>
        {
            const shader = BlendModeShader.getScreenShader();
            expect(shader).toContain("srcRgb + dstRgb - srcRgb * dstRgb");
        });
    });

    describe("getLightenShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getLightenShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getLightenShader();

            expect(shader).toContain("@fragment");
        });

        it("should implement lighten blend using max", () =>
        {
            const shader = BlendModeShader.getLightenShader();

            expect(shader).toContain("max(srcRgb, dstRgb)");
        });

        it("should handle zero alpha cases", () =>
        {
            const shader = BlendModeShader.getLightenShader();

            expect(shader).toContain("if (src.a == 0.0) { return dst; }");
            expect(shader).toContain("if (dst.a == 0.0) { return src; }");
        });

        it("should unpremultiply colors for blending", () =>
        {
            const shader = BlendModeShader.getLightenShader();

            expect(shader).toContain("srcRgb = src.rgb / src.a");
            expect(shader).toContain("dstRgb = dst.rgb / dst.a");
        });
    });

    describe("getDarkenShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getDarkenShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getDarkenShader();

            expect(shader).toContain("@fragment");
        });

        it("should implement darken blend using min", () =>
        {
            const shader = BlendModeShader.getDarkenShader();

            expect(shader).toContain("min(srcRgb, dstRgb)");
        });

        it("should handle zero alpha cases", () =>
        {
            const shader = BlendModeShader.getDarkenShader();

            expect(shader).toContain("if (src.a == 0.0) { return dst; }");
            expect(shader).toContain("if (dst.a == 0.0) { return src; }");
        });
    });

    describe("getOverlayShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getOverlayShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getOverlayShader();

            expect(shader).toContain("@fragment");
        });

        it("should implement overlay blend with 0.5 threshold", () =>
        {
            const shader = BlendModeShader.getOverlayShader();

            expect(shader).toContain("if (dstRgb.r < 0.5)");
            expect(shader).toContain("if (dstRgb.g < 0.5)");
            expect(shader).toContain("if (dstRgb.b < 0.5)");
        });

        it("should use overlayRgb variable", () =>
        {
            const shader = BlendModeShader.getOverlayShader();

            expect(shader).toContain("overlayRgb");
        });
    });

    describe("getHardLightShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getHardLightShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getHardLightShader();

            expect(shader).toContain("@fragment");
        });

        it("should implement hard light blend with 0.5 threshold on source", () =>
        {
            const shader = BlendModeShader.getHardLightShader();

            expect(shader).toContain("if (srcRgb.r < 0.5)");
            expect(shader).toContain("if (srcRgb.g < 0.5)");
            expect(shader).toContain("if (srcRgb.b < 0.5)");
        });

        it("should use hardLightRgb variable", () =>
        {
            const shader = BlendModeShader.getHardLightShader();

            expect(shader).toContain("hardLightRgb");
        });
    });

    describe("getDifferenceShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getDifferenceShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getDifferenceShader();

            expect(shader).toContain("@fragment");
        });

        it("should implement difference blend using abs", () =>
        {
            const shader = BlendModeShader.getDifferenceShader();

            expect(shader).toContain("abs(srcRgb - dstRgb)");
        });
    });

    describe("getSubtractShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = BlendModeShader.getSubtractShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = BlendModeShader.getSubtractShader();

            expect(shader).toContain("@fragment");
        });

        it("should implement subtract blend (dst - src)", () =>
        {
            const shader = BlendModeShader.getSubtractShader();

            expect(shader).toContain("dstRgb - srcRgb");
        });

        it("should handle zero alpha cases", () =>
        {
            const shader = BlendModeShader.getSubtractShader();

            expect(shader).toContain("if (src.a == 0.0) { return dst; }");
            expect(shader).toContain("if (dst.a == 0.0) { return src; }");
        });
    });

    describe("common shader properties", () =>
    {
        const shaders = [
            { name: "Multiply", fn: BlendModeShader.getMultiplyShader },
            { name: "Screen", fn: BlendModeShader.getScreenShader },
            { name: "Lighten", fn: BlendModeShader.getLightenShader },
            { name: "Darken", fn: BlendModeShader.getDarkenShader },
            { name: "Overlay", fn: BlendModeShader.getOverlayShader },
            { name: "HardLight", fn: BlendModeShader.getHardLightShader },
            { name: "Difference", fn: BlendModeShader.getDifferenceShader },
            { name: "Subtract", fn: BlendModeShader.getSubtractShader }
        ];

        shaders.forEach(({ name, fn }) =>
        {
            it(`${name} shader should include textureSample calls`, () =>
            {
                const shader = fn();

                expect(shader).toContain("textureSample");
            });

            it(`${name} shader should apply color transform`, () =>
            {
                const shader = fn();

                expect(shader).toContain("uniforms.colorTransform");
            });

            it(`${name} shader should have sampler binding`, () =>
            {
                const shader = fn();

                expect(shader).toContain("var sampler0: sampler");
            });
        });
    });
});
