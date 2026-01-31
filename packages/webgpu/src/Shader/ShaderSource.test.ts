import { describe, it, expect } from "vitest";
import { ShaderSource } from "./ShaderSource";

describe("ShaderSource", () =>
{
    describe("getFillVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getFillVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getFillVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define VertexInput struct with position, bezier, color, and matrix", () =>
        {
            const shader = ShaderSource.getFillVertexShader();

            expect(shader).toContain("struct VertexInput");
            expect(shader).toContain("position: vec2<f32>");
            expect(shader).toContain("bezier: vec2<f32>");
            expect(shader).toContain("color: vec4<f32>");
            expect(shader).toContain("matrix0: vec3<f32>");
        });

        it("should define Uniforms struct with viewportSize", () =>
        {
            const shader = ShaderSource.getFillVertexShader();

            expect(shader).toContain("struct Uniforms");
            expect(shader).toContain("viewportSize: vec2<f32>");
        });
    });

    describe("getFillMainVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getFillMainVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getFillMainVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should include Y-axis inversion for main attachment", () =>
        {
            const shader = ShaderSource.getFillMainVertexShader();

            expect(shader).toContain("-ndc.y");
        });
    });

    describe("getFillFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getFillFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getFillFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include bezier curve handling", () =>
        {
            const shader = ShaderSource.getFillFragmentShader();

            expect(shader).toContain("bezier");
        });
    });

    describe("getStencilWriteVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getStencilWriteVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getStencilWriteVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getStencilWriteMainVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getStencilWriteMainVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getStencilWriteMainVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should include Y-axis inversion for main attachment", () =>
        {
            const shader = ShaderSource.getStencilWriteMainVertexShader();

            expect(shader).toContain("-ndc.y");
        });
    });

    describe("getStencilWriteFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getStencilWriteFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getStencilWriteFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getStencilFillVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getStencilFillVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getStencilFillVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getStencilFillFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getStencilFillFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getStencilFillFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getMaskVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getMaskVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getMaskVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getMaskFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getMaskFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getMaskFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include texture sampling", () =>
        {
            const shader = ShaderSource.getMaskFragmentShader();

            expect(shader).toContain("textureLoad");
        });
    });

    describe("getBasicVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getBasicVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getBasicVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getBasicMainVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getBasicMainVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getBasicMainVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should include Y-axis inversion", () =>
        {
            const shader = ShaderSource.getBasicMainVertexShader();

            expect(shader).toContain("-ndc.y");
        });
    });

    describe("getBasicFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getBasicFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getBasicFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getTextureFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getTextureFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getTextureFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include texture sampling", () =>
        {
            const shader = ShaderSource.getTextureFragmentShader();

            expect(shader).toContain("textureSample");
        });
    });

    describe("getInstancedVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getInstancedVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getInstancedVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define Uniforms struct", () =>
        {
            const shader = ShaderSource.getInstancedVertexShader();

            expect(shader).toContain("struct Uniforms");
        });
    });

    describe("getInstancedFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getInstancedFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getInstancedFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include color transform", () =>
        {
            const shader = ShaderSource.getInstancedFragmentShader();

            expect(shader).toContain("colorTransform");
        });
    });

    describe("getGradientFillVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getGradientFillVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getGradientFillVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getGradientFillMainVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getGradientFillMainVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getGradientFillMainVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getGradientFillFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getGradientFillFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getGradientFillFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should handle gradient types", () =>
        {
            const shader = ShaderSource.getGradientFillFragmentShader();

            expect(shader).toContain("gradientType");
        });
    });

    describe("getGradientFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getGradientFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getGradientFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getBitmapFillVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getBitmapFillVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getBitmapFillVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getBitmapFillMainVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getBitmapFillMainVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getBitmapFillMainVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getBitmapFillFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getBitmapFillFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getBitmapFillFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include texture sampling", () =>
        {
            const shader = ShaderSource.getBitmapFillFragmentShader();

            expect(shader).toContain("textureSample");
        });
    });

    describe("getBlendFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getBlendFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getBlendFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include color transform uniforms", () =>
        {
            const shader = ShaderSource.getBlendFragmentShader();

            expect(shader).toContain("colorTransform");
        });
    });

    describe("getBlurFilterVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getBlurFilterVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getBlurFilterVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getBlurFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string for halfBlur=2", () =>
        {
            const shader = ShaderSource.getBlurFilterFragmentShader(2);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getBlurFilterFragmentShader(2);

            expect(shader).toContain("@fragment");
        });

        it("should define BlurUniforms struct", () =>
        {
            const shader = ShaderSource.getBlurFilterFragmentShader(2);

            expect(shader).toContain("struct BlurUniforms");
        });

        it("should generate different shaders for different halfBlur values", () =>
        {
            const shader1 = ShaderSource.getBlurFilterFragmentShader(2);
            const shader2 = ShaderSource.getBlurFilterFragmentShader(4);

            expect(shader1).not.toBe(shader2);
        });
    });

    describe("getTextureCopyFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getTextureCopyFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getTextureCopyFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getBlurTextureCopyFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getBlurTextureCopyFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getBlurTextureCopyFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getFilterOutputFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getFilterOutputFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getFilterOutputFragmentShader();

            expect(shader).toContain("@fragment");
        });
    });

    describe("getColorMatrixFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getColorMatrixFilterFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getColorMatrixFilterFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define ColorMatrixUniforms struct", () =>
        {
            const shader = ShaderSource.getColorMatrixFilterFragmentShader();

            expect(shader).toContain("struct ColorMatrixUniforms");
        });
    });

    describe("getGlowFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getGlowFilterFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getGlowFilterFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define GlowUniforms struct", () =>
        {
            const shader = ShaderSource.getGlowFilterFragmentShader();

            expect(shader).toContain("struct GlowUniforms");
        });
    });

    describe("getDropShadowFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getDropShadowFilterFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getDropShadowFilterFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define DropShadowUniforms struct", () =>
        {
            const shader = ShaderSource.getDropShadowFilterFragmentShader();

            expect(shader).toContain("struct DropShadowUniforms");
        });
    });

    describe("getGradientGlowFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getGradientGlowFilterFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getGradientGlowFilterFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define GradientGlowUniforms struct", () =>
        {
            const shader = ShaderSource.getGradientGlowFilterFragmentShader();

            expect(shader).toContain("struct GradientGlowUniforms");
        });

        it("should include gradient texture sampling", () =>
        {
            const shader = ShaderSource.getGradientGlowFilterFragmentShader();

            expect(shader).toContain("gradientTexture");
        });
    });

    describe("getGradientBevelFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getGradientBevelFilterFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getGradientBevelFilterFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define GradientBevelUniforms struct", () =>
        {
            const shader = ShaderSource.getGradientBevelFilterFragmentShader();

            expect(shader).toContain("struct GradientBevelUniforms");
        });
    });

    describe("getConvolutionFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getConvolutionFilterFragmentShader(3, 3);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getConvolutionFilterFragmentShader(3, 3);

            expect(shader).toContain("@fragment");
        });

        it("should define Uniforms struct", () =>
        {
            const shader = ShaderSource.getConvolutionFilterFragmentShader(3, 3);

            expect(shader).toContain("struct Uniforms");
        });

        it("should generate different shaders for different matrix sizes", () =>
        {
            const shader3x3 = ShaderSource.getConvolutionFilterFragmentShader(3, 3);
            const shader5x5 = ShaderSource.getConvolutionFilterFragmentShader(5, 5);

            expect(shader3x3).not.toBe(shader5x5);
        });
    });

    describe("getBevelFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getBevelFilterFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getBevelFilterFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define BevelUniforms struct", () =>
        {
            const shader = ShaderSource.getBevelFilterFragmentShader();

            expect(shader).toContain("struct BevelUniforms");
        });
    });

    describe("getComplexBlendFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader for multiply mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("multiply");

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("multiply");

            expect(shader).toContain("@fragment");
        });

        it("should generate different shaders for different blend modes", () =>
        {
            const multiply = ShaderSource.getComplexBlendFragmentShader("multiply");
            const screen = ShaderSource.getComplexBlendFragmentShader("screen");
            const overlay = ShaderSource.getComplexBlendFragmentShader("overlay");

            expect(multiply).not.toBe(screen);
            expect(multiply).not.toBe(overlay);
        });

        it("should support multiply blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("multiply");

            expect(shader).toContain("fn blend");
        });

        it("should support screen blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("screen");

            expect(shader).toContain("fn blend");
        });

        it("should support lighten blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("lighten");

            expect(shader).toContain("step(srcRgb, dstRgb)");
        });

        it("should support darken blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("darken");

            expect(shader).toContain("step(dstRgb, srcRgb)");
        });

        it("should support difference blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("difference");

            expect(shader).toContain("fn blend");
        });

        it("should support subtract blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("subtract");

            expect(shader).toBeDefined();
        });

        it("should support invert blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("invert");

            expect(shader).toBeDefined();
        });

        it("should support overlay blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("overlay");

            expect(shader).toBeDefined();
        });

        it("should support hardlight blend mode", () =>
        {
            const shader = ShaderSource.getComplexBlendFragmentShader("hardlight");

            expect(shader).toBeDefined();
        });
    });

    describe("getDisplacementMapFilterFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("@fragment");
        });

        it("should define Uniforms struct", () =>
        {
            const shader = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 0);

            expect(shader).toContain("struct Uniforms");
        });

        it("should generate different shaders for different component channels", () =>
        {
            const shader1 = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 0);
            const shader2 = ShaderSource.getDisplacementMapFilterFragmentShader(4, 8, 0);

            expect(shader1).not.toBe(shader2);
        });

        it("should generate different shaders for different modes", () =>
        {
            const shader0 = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 0);
            const shader1 = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 1);
            const shader2 = ShaderSource.getDisplacementMapFilterFragmentShader(1, 2, 2);

            expect(shader0).not.toBe(shader1);
            expect(shader0).not.toBe(shader2);
        });
    });

    describe("getNodeClearVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getNodeClearVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getNodeClearVertexShader();

            expect(shader).toContain("@vertex");
        });
    });

    describe("getNodeClearFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getNodeClearFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getNodeClearFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should return transparent color", () =>
        {
            const shader = ShaderSource.getNodeClearFragmentShader();

            expect(shader).toContain("vec4<f32>(0.0, 0.0, 0.0, 0.0)");
        });
    });

    describe("getPositionedTextureVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = ShaderSource.getPositionedTextureVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = ShaderSource.getPositionedTextureVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define PositionUniforms struct", () =>
        {
            const shader = ShaderSource.getPositionedTextureVertexShader();

            expect(shader).toContain("struct PositionUniforms");
        });
    });

    describe("getPositionedTextureFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = ShaderSource.getPositionedTextureFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = ShaderSource.getPositionedTextureFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should include texture sampling", () =>
        {
            const shader = ShaderSource.getPositionedTextureFragmentShader();

            expect(shader).toContain("textureSample");
        });
    });

    describe("shader consistency", () =>
    {
        const vertexShaders = [
            { name: "getFillVertexShader", fn: () => ShaderSource.getFillVertexShader() },
            { name: "getFillMainVertexShader", fn: () => ShaderSource.getFillMainVertexShader() },
            { name: "getStencilWriteVertexShader", fn: () => ShaderSource.getStencilWriteVertexShader() },
            { name: "getStencilWriteMainVertexShader", fn: () => ShaderSource.getStencilWriteMainVertexShader() },
            { name: "getStencilFillVertexShader", fn: () => ShaderSource.getStencilFillVertexShader() },
            { name: "getMaskVertexShader", fn: () => ShaderSource.getMaskVertexShader() },
            { name: "getBasicVertexShader", fn: () => ShaderSource.getBasicVertexShader() },
            { name: "getBasicMainVertexShader", fn: () => ShaderSource.getBasicMainVertexShader() },
            { name: "getInstancedVertexShader", fn: () => ShaderSource.getInstancedVertexShader() },
            { name: "getGradientFillVertexShader", fn: () => ShaderSource.getGradientFillVertexShader() },
            { name: "getGradientFillMainVertexShader", fn: () => ShaderSource.getGradientFillMainVertexShader() },
            { name: "getBitmapFillVertexShader", fn: () => ShaderSource.getBitmapFillVertexShader() },
            { name: "getBitmapFillMainVertexShader", fn: () => ShaderSource.getBitmapFillMainVertexShader() },
            { name: "getBlurFilterVertexShader", fn: () => ShaderSource.getBlurFilterVertexShader() },
            { name: "getNodeClearVertexShader", fn: () => ShaderSource.getNodeClearVertexShader() },
            { name: "getPositionedTextureVertexShader", fn: () => ShaderSource.getPositionedTextureVertexShader() }
        ];

        const fragmentShaders = [
            { name: "getFillFragmentShader", fn: () => ShaderSource.getFillFragmentShader() },
            { name: "getStencilWriteFragmentShader", fn: () => ShaderSource.getStencilWriteFragmentShader() },
            { name: "getStencilFillFragmentShader", fn: () => ShaderSource.getStencilFillFragmentShader() },
            { name: "getMaskFragmentShader", fn: () => ShaderSource.getMaskFragmentShader() },
            { name: "getBasicFragmentShader", fn: () => ShaderSource.getBasicFragmentShader() },
            { name: "getTextureFragmentShader", fn: () => ShaderSource.getTextureFragmentShader() },
            { name: "getInstancedFragmentShader", fn: () => ShaderSource.getInstancedFragmentShader() },
            { name: "getGradientFillFragmentShader", fn: () => ShaderSource.getGradientFillFragmentShader() },
            { name: "getGradientFragmentShader", fn: () => ShaderSource.getGradientFragmentShader() },
            { name: "getBitmapFillFragmentShader", fn: () => ShaderSource.getBitmapFillFragmentShader() },
            { name: "getBlendFragmentShader", fn: () => ShaderSource.getBlendFragmentShader() },
            { name: "getTextureCopyFragmentShader", fn: () => ShaderSource.getTextureCopyFragmentShader() },
            { name: "getBlurTextureCopyFragmentShader", fn: () => ShaderSource.getBlurTextureCopyFragmentShader() },
            { name: "getFilterOutputFragmentShader", fn: () => ShaderSource.getFilterOutputFragmentShader() },
            { name: "getColorMatrixFilterFragmentShader", fn: () => ShaderSource.getColorMatrixFilterFragmentShader() },
            { name: "getGlowFilterFragmentShader", fn: () => ShaderSource.getGlowFilterFragmentShader() },
            { name: "getDropShadowFilterFragmentShader", fn: () => ShaderSource.getDropShadowFilterFragmentShader() },
            { name: "getGradientGlowFilterFragmentShader", fn: () => ShaderSource.getGradientGlowFilterFragmentShader() },
            { name: "getGradientBevelFilterFragmentShader", fn: () => ShaderSource.getGradientBevelFilterFragmentShader() },
            { name: "getBevelFilterFragmentShader", fn: () => ShaderSource.getBevelFilterFragmentShader() },
            { name: "getNodeClearFragmentShader", fn: () => ShaderSource.getNodeClearFragmentShader() },
            { name: "getPositionedTextureFragmentShader", fn: () => ShaderSource.getPositionedTextureFragmentShader() }
        ];

        vertexShaders.forEach(({ name, fn }) =>
        {
            it(`${name} should contain valid fn main entry point`, () =>
            {
                const shader = fn();

                expect(shader).toContain("fn main");
            });
        });

        fragmentShaders.forEach(({ name, fn }) =>
        {
            it(`${name} should contain valid fn main entry point`, () =>
            {
                const shader = fn();

                expect(shader).toContain("fn main");
            });
        });
    });
});
