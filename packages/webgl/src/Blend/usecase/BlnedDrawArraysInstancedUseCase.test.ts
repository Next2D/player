import { execute } from "./BlnedDrawArraysInstancedUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as variantsBlendInstanceShaderService from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";

vi.mock("../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService");
vi.mock("../../Shader/ShaderInstancedManager/usecase/ShaderInstancedManagerDrawArraysInstancedUseCase");
vi.mock("../../Blend/usecase/BlendOperationUseCase");
vi.mock("../../FrameBufferManager/service/FrameBufferManagerTransferAtlasTextureService");

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            globalCompositeOperation: "normal"
        }
    };
});

describe("BlnedDrawArraysInstancedUseCase method test", () => {
    let mockShaderInstancedManager: any;
    let $context: any;

    beforeEach(async () => {
        const WebGLUtil = await import("../../WebGLUtil");
        $context = WebGLUtil.$context;

        mockShaderInstancedManager = {
            count: 0,
            clear: vi.fn()
        };

        $context.globalCompositeOperation = "normal";

        vi.mocked(variantsBlendInstanceShaderService.execute).mockReturnValue(mockShaderInstancedManager);
    });

    it("should return early when count is 0", () => {
        mockShaderInstancedManager.count = 0;

        execute();

        expect(mockShaderInstancedManager.clear).not.toHaveBeenCalled();
    });

    it("should execute instance drawing when count is greater than 0", () => {
        mockShaderInstancedManager.count = 5;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should clear shader manager after drawing", () => {
        mockShaderInstancedManager.count = 10;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalledTimes(1);
    });

    it("should handle normal blend mode", () => {
        $context.globalCompositeOperation = "normal";
        mockShaderInstancedManager.count = 3;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should handle add blend mode", () => {
        $context.globalCompositeOperation = "add";
        mockShaderInstancedManager.count = 3;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should handle screen blend mode", () => {
        $context.globalCompositeOperation = "screen";
        mockShaderInstancedManager.count = 3;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should handle multiply blend mode", () => {
        $context.globalCompositeOperation = "multiply";
        mockShaderInstancedManager.count = 3;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should handle large count value", () => {
        mockShaderInstancedManager.count = 1000;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should handle count value of 1", () => {
        mockShaderInstancedManager.count = 1;

        execute();

        expect(mockShaderInstancedManager.clear).toHaveBeenCalled();
    });

    it("should not execute drawing when manager is not initialized", () => {
        vi.mocked(variantsBlendInstanceShaderService.execute).mockReturnValue({
            count: 0,
            clear: vi.fn()
        });

        execute();

        expect(mockShaderInstancedManager.clear).not.toHaveBeenCalled();
    });
});
