import { execute } from "./GradientLUTGeneratorFillTextureUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            TRIANGLE_STRIP: 5,
            drawArrays: vi.fn()
        }
    };
});

vi.mock("../../../VertexArrayObject/usecase/VertexArrayObjectGetGradientObjectUseCase.ts", () => ({
    execute: vi.fn(() => ({ id: "gradient-vao" }))
}));

vi.mock("../../../VertexArrayObject/service/VertexArrayObjectBindService.ts", () => ({
    execute: vi.fn()
}));

import { $gl } from "../../../WebGLUtil";
import { execute as getGradientObjectUseCase } from "../../../VertexArrayObject/usecase/VertexArrayObjectGetGradientObjectUseCase";
import { execute as bindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";

describe("GradientLUTGeneratorFillTextureUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute gradient texture fill", () =>
    {
        const mockUseProgram = vi.fn();
        const mockBindUniform = vi.fn();
        const mockShaderManager = {
            useProgram: mockUseProgram,
            bindUniform: mockBindUniform
        } as unknown as ShaderManager;

        execute(mockShaderManager, 0, 1);

        expect(mockUseProgram).toHaveBeenCalledTimes(1);
        expect(mockBindUniform).toHaveBeenCalledTimes(1);
        expect(getGradientObjectUseCase).toHaveBeenCalledWith(0, 1);
        expect(bindService).toHaveBeenCalled();
        expect($gl.drawArrays).toHaveBeenCalledWith(5, 0, 4);
    });

    it("test case - should pass begin and end to gradient object usecase", () =>
    {
        const mockShaderManager = {
            useProgram: vi.fn(),
            bindUniform: vi.fn()
        } as unknown as ShaderManager;

        execute(mockShaderManager, 0.25, 0.75);

        expect(getGradientObjectUseCase).toHaveBeenCalledWith(0.25, 0.75);
    });

    it("test case - should call operations in correct order", () =>
    {
        const callOrder: string[] = [];
        const mockShaderManager = {
            useProgram: vi.fn(() => callOrder.push("useProgram")),
            bindUniform: vi.fn(() => callOrder.push("bindUniform"))
        } as unknown as ShaderManager;

        vi.mocked(bindService).mockImplementation(() => callOrder.push("bindVao"));
        vi.mocked($gl.drawArrays).mockImplementation(() => callOrder.push("drawArrays"));

        execute(mockShaderManager, 0, 1);

        expect(callOrder).toEqual([
            "useProgram",
            "bindUniform",
            "bindVao",
            "drawArrays"
        ]);
    });
});
