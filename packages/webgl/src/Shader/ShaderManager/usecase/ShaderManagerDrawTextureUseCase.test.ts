import { execute } from "./ShaderManagerDrawTextureUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

const mockVao = { id: "rect-vao" };

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

vi.mock("../../../VertexArrayObject.ts", () => ({
    $getRectVertexArrayObject: () => ({ id: "rect-vao" })
}));

import { $gl } from "../../../WebGLUtil";
import { execute as bindService } from "../../../VertexArrayObject/service/VertexArrayObjectBindService";

describe("ShaderManagerDrawTextureUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute draw texture usecase", () =>
    {
        const mockUseProgram = vi.fn();
        const mockBindUniform = vi.fn();
        const mockShaderManager = {
            useProgram: mockUseProgram,
            bindUniform: mockBindUniform
        } as unknown as ShaderManager;

        execute(mockShaderManager);

        expect(mockUseProgram).toHaveBeenCalledTimes(1);
        expect(mockBindUniform).toHaveBeenCalledTimes(1);
        expect(bindService).toHaveBeenCalled();
        expect($gl.drawArrays).toHaveBeenCalledWith(4, 0, 6);
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

        execute(mockShaderManager);

        expect(callOrder).toEqual([
            "useProgram",
            "bindUniform",
            "bindVao",
            "drawArrays"
        ]);
    });
});
