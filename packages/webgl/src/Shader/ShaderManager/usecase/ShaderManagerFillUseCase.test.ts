import { execute } from "./ShaderManagerFillUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";
import type { IVertexArrayObject } from "../../../interface/IVertexArrayObject";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            TRIANGLES: 4,
            drawArrays: vi.fn()
        }
    };
});

vi.mock("../../../VertexArrayObject/service/VertexArrayObjectBindService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService.ts", () => ({
    execute: vi.fn()
}));

import { $gl } from "../../../WebGLUtil";
import { execute as bindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";

describe("ShaderManagerFillUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute fill usecase", () =>
    {
        const mockUseProgram = vi.fn();
        const mockBindUniform = vi.fn();
        const mockShaderManager = {
            useProgram: mockUseProgram,
            bindUniform: mockBindUniform
        } as unknown as ShaderManager;

        const mockVao = { id: "test-vao" } as unknown as IVertexArrayObject;

        execute(mockShaderManager, mockVao, 0, 12);

        expect(mockUseProgram).toHaveBeenCalledTimes(1);
        expect(mockBindUniform).toHaveBeenCalledTimes(1);
        expect(blendResetService).toHaveBeenCalledTimes(1);
        expect(bindService).toHaveBeenCalledWith(mockVao);
        expect($gl.drawArrays).toHaveBeenCalledWith(4, 0, 12);
    });

    it("test case - should handle offset and count parameters", () =>
    {
        const mockShaderManager = {
            useProgram: vi.fn(),
            bindUniform: vi.fn()
        } as unknown as ShaderManager;

        const mockVao = { id: "test-vao" } as unknown as IVertexArrayObject;

        execute(mockShaderManager, mockVao, 6, 18);

        expect($gl.drawArrays).toHaveBeenCalledWith(4, 6, 18);
    });

    it("test case - should call operations in correct order", () =>
    {
        const callOrder: string[] = [];
        const mockShaderManager = {
            useProgram: vi.fn(() => callOrder.push("useProgram")),
            bindUniform: vi.fn(() => callOrder.push("bindUniform"))
        } as unknown as ShaderManager;

        const mockVao = { id: "test-vao" } as unknown as IVertexArrayObject;

        vi.mocked(blendResetService).mockImplementation(() => callOrder.push("blendReset"));
        vi.mocked(bindService).mockImplementation(() => callOrder.push("bindVao"));
        vi.mocked($gl.drawArrays).mockImplementation(() => callOrder.push("drawArrays"));

        execute(mockShaderManager, mockVao, 0, 6);

        expect(callOrder).toEqual([
            "useProgram",
            "bindUniform",
            "blendReset",
            "bindVao",
            "drawArrays"
        ]);
    });
});
