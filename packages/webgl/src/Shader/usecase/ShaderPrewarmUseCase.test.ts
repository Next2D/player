import { execute } from "./ShaderPrewarmUseCase";
import { $setWebGL2RenderingContext } from "../../WebGLUtil";
import { $collection as $blendCollection } from "../Variants/BlendVariants";
import { $collection as $shapeCollection } from "../Variants/ShapeVariants";
import { $collection as $gradientCollection } from "../Variants/GradientVariants";
import { $getFromCache } from "../Variants/GradientLUTVariants";
import { describe, expect, it, vi } from "vitest";

describe("ShaderPrewarmUseCase.js method test", () =>
{
    it("creates the shaders that basic drawing always needs, once", () =>
    {
        const mockGL = {
            "createProgram": vi.fn(() => ({})),
            "createShader": vi.fn(() => ({})),
            "shaderSource": vi.fn(),
            "compileShader": vi.fn(),
            "attachShader": vi.fn(),
            "linkProgram": vi.fn(),
            "detachShader": vi.fn(),
            "deleteShader": vi.fn(),
            "getParameter": vi.fn(() => null),
            "getProgramParameter": vi.fn(() => 0),
            "getActiveUniform": vi.fn(),
            "getUniformLocation": vi.fn(),
            "getUniformBlockIndex": vi.fn(() => 0),
            "uniformBlockBinding": vi.fn(),
            "useProgram": vi.fn(),
            "VERTEX_SHADER": 1,
            "FRAGMENT_SHADER": 2,
            "ACTIVE_UNIFORMS": 3
        } as unknown as WebGL2RenderingContext;
        $setWebGL2RenderingContext(mockGL);

        execute();

        // 塗り・マスク・アトラスへの合成・インスタンス描画
        expect($blendCollection.has("i")).toBe(true);
        expect($blendCollection.has("pp")).toBe(true);
        expect($blendCollection.has("mn")).toBe(true);
        expect($shapeCollection.has("mn")).toBe(true);
        expect($shapeCollection.has("sn")).toBe(true);

        // グラデーションの既定の組み合わせ (線形・放射状、ストップ数の共用分)
        expect($gradientCollection.has("nnn2")).toBe(true);
        expect($gradientCollection.has("nyn2")).toBe(true);
        expect($getFromCache("l008n")).not.toBeNull();

        const linked = (mockGL.linkProgram as ReturnType<typeof vi.fn>).mock.calls.length;
        expect(linked).toBe(8);

        // 2 回目は作り直さない
        execute();
        expect((mockGL.linkProgram as ReturnType<typeof vi.fn>).mock.calls.length).toBe(linked);
    });
});
