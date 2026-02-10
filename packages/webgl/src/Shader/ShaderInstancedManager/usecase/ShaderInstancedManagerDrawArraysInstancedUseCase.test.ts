import { execute } from "./ShaderInstancedManagerDrawArraysInstancedUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderInstancedManager } from "../../ShaderInstancedManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            TRIANGLES: 4,
            drawArraysInstanced: vi.fn()
        }
    };
});

vi.mock("../../../VertexArrayObject/usecase/VertexArrayObjectBindAttributeUseCase.ts", () => ({
    execute: vi.fn()
}));

import { $gl } from "../../../WebGLUtil";
import { execute as bindAttributeUseCase } from "../../../VertexArrayObject/usecase/VertexArrayObjectBindAttributeUseCase";

describe("ShaderInstancedManagerDrawArraysInstancedUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute instanced drawing", () =>
    {
        const mockUseProgram = vi.fn();
        const mockBindUniform = vi.fn();
        const mockShaderInstancedManager = {
            useProgram: mockUseProgram,
            bindUniform: mockBindUniform,
            count: 10
        } as unknown as ShaderInstancedManager;

        execute(mockShaderInstancedManager);

        expect(mockUseProgram).toHaveBeenCalledTimes(1);
        expect(mockBindUniform).toHaveBeenCalledTimes(1);
        expect(bindAttributeUseCase).toHaveBeenCalledTimes(1);
        expect($gl.drawArraysInstanced).toHaveBeenCalledWith(4, 0, 6, 10);
    });

    it("test case - should use correct instance count", () =>
    {
        const mockShaderInstancedManager = {
            useProgram: vi.fn(),
            bindUniform: vi.fn(),
            count: 50
        } as unknown as ShaderInstancedManager;

        execute(mockShaderInstancedManager);

        expect($gl.drawArraysInstanced).toHaveBeenCalledWith(4, 0, 6, 50);
    });
});
