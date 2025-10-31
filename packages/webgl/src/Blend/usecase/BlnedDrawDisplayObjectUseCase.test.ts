import { execute } from "./BlnedDrawDisplayObjectUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Node } from "@next2d/texture-packer";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import * as BlendModule from "../../Blend";
import * as AtlasManagerModule from "../../AtlasManager";
import { renderQueue } from "@next2d/render-queue";

vi.mock("../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService", () => ({
    execute: vi.fn(() => ({ count: 0 }))
}));
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase", () => ({
    execute: vi.fn(() => ({ width: 100, height: 100 }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../TextureManager/usecase/TextureManagerBind01UseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase", () => ({
    execute: vi.fn(() => ({ width: 100, height: 100 }))
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase", () => ({
    execute: vi.fn(() => ({ texture: { width: 100, height: 100 } }))
}));
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerTransferTextureFromRectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetBlendWithColorTransformUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            globalCompositeOperation: "normal",
            globalAlpha: 1.0,
            $matrix: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
            currentAttachmentObject: null,
            drawArraysInstanced: vi.fn(),
            bind: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            setTransform: vi.fn(),
            reset: vi.fn()
        },
        $getViewportWidth: vi.fn(() => 800),
        $getViewportHeight: vi.fn(() => 600),
        $getFloat32Array6: vi.fn((...args: number[]) => new Float32Array(args)),
        $RENDER_MAX_SIZE: 4096
    };
});

describe("BlnedDrawDisplayObjectUseCase method test", () => {
    let mockNode: Node;
    let mockColorTransform: Float32Array;
    let mockShaderInstancedManager: any;
    let $context: any;

    beforeEach(async () => {
        const WebGLUtil = await import("../../WebGLUtil");
        $context = WebGLUtil.$context;

        mockNode = {
            index: 0,
            x: 0,
            y: 0,
            w: 100,
            h: 100
        } as Node;

        mockColorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        mockShaderInstancedManager = {
            count: 0
        };

        $context.globalCompositeOperation = "normal";
        $context.globalAlpha = 1.0;
        $context.$matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        $context.currentAttachmentObject = null;
        $context.drawArraysInstanced = vi.fn();
        $context.bind = vi.fn();
        $context.save = vi.fn();
        $context.restore = vi.fn();
        $context.setTransform = vi.fn();

        vi.spyOn(BlendModule, "$getCurrentBlendMode").mockReturnValue("normal");
        vi.spyOn(BlendModule, "$setCurrentBlendMode").mockImplementation(() => {});
        vi.spyOn(AtlasManagerModule, "$getCurrentAtlasIndex").mockReturnValue(0);
        vi.spyOn(AtlasManagerModule, "$setCurrentAtlasIndex").mockImplementation(() => {});
        vi.spyOn(AtlasManagerModule, "$setActiveAtlasIndex").mockImplementation(() => {});

        renderQueue.length = 0;
        renderQueue.push = vi.fn();
    });

    it("should handle normal blend mode without switching", () => {
        $context.globalCompositeOperation = "normal";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle layer blend mode", () => {
        $context.globalCompositeOperation = "layer";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle add blend mode", () => {
        $context.globalCompositeOperation = "add";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle screen blend mode", () => {
        $context.globalCompositeOperation = "screen";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle alpha blend mode", () => {
        $context.globalCompositeOperation = "alpha";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle erase blend mode", () => {
        $context.globalCompositeOperation = "erase";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle copy blend mode", () => {
        $context.globalCompositeOperation = "copy";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should switch blend mode when different from current", () => {
        vi.spyOn(BlendModule, "$getCurrentBlendMode").mockReturnValue("multiply");
        $context.globalCompositeOperation = "normal";

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("should switch atlas index when different from current", () => {
        vi.spyOn(AtlasManagerModule, "$getCurrentAtlasIndex").mockReturnValue(1);
        mockNode.index = 0;

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("should handle multiply blend mode with complex processing", () => {
        $context.globalCompositeOperation = "multiply";
        const currentAttachment = {} as IAttachmentObject;
        $context.currentAttachmentObject = currentAttachment;

        execute(mockNode, 0, 0, 100, 100, mockColorTransform);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("should handle color transform with offset values", () => {
        const colorTransformWithOffset = new Float32Array([0.5, 0.5, 0.5, 0.8, 50, 100, 150, 200]);
        $context.globalCompositeOperation = "normal";

        execute(mockNode, 0, 0, 100, 100, colorTransformWithOffset);

        expect(renderQueue.push).toHaveBeenCalled();
    });

    it("should handle transformed matrix", () => {
        $context.globalCompositeOperation = "multiply";
        $context.$matrix = new Float32Array([2, 0, 0, 0, 2, 0, 50, 50, 1]);

        execute(mockNode, 0, 0, 200, 200, mockColorTransform);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("should handle rotated matrix", () => {
        $context.globalCompositeOperation = "multiply";
        const angle = Math.PI / 4;
        $context.$matrix = new Float32Array([
            Math.cos(angle), Math.sin(angle), 0,
            -Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1
        ]);

        execute(mockNode, 0, 0, 150, 150, mockColorTransform);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("should restore context after complex blend mode", () => {
        $context.globalCompositeOperation = "multiply";
        $context.$matrix = new Float32Array([2, 0, 0, 0, 2, 0, 0, 0, 1]);

        execute(mockNode, 0, 0, 200, 200, mockColorTransform);

        expect($context.drawArraysInstanced).toHaveBeenCalled();
    });

    it("should handle different node dimensions", () => {
        mockNode.w = 200;
        mockNode.h = 150;
        $context.globalCompositeOperation = "normal";

        execute(mockNode, 0, 0, 200, 150, mockColorTransform);

        expect(renderQueue.push).toHaveBeenCalled();
    });
});
