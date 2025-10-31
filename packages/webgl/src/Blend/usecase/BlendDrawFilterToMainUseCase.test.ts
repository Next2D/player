import { execute } from "./BlendDrawFilterToMainUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";

vi.mock("./BlendOperationUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase", () => ({
    execute: vi.fn(() => ({ width: 100, height: 100 }))
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase", () => ({
    execute: vi.fn(() => ({ texture: { width: 100, height: 100 } }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerBind01UseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetBlendWithColorTransformUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureWithColorTransformUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../service/BlendResetService", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerTransferTextureFromRectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            globalCompositeOperation: "normal",
            currentAttachmentObject: null,
            $mainAttachmentObject: null,
            bind: vi.fn(),
            setTransform: vi.fn(),
            reset: vi.fn()
        }
    };
});

describe("BlendDrawFilterToMainUseCase method test", () => {
    let mockTextureObject: ITextureObject;
    let mockAttachmentObject: IAttachmentObject;
    let mockColorTransform: Float32Array;
    let $context: any;

    beforeEach(async () => {
        const WebGLUtil = await import("../../WebGLUtil");
        $context = WebGLUtil.$context;

        mockTextureObject = {
            width: 100,
            height: 100,
            texture: {} as WebGLTexture
        } as ITextureObject;

        mockAttachmentObject = {
            width: 200,
            height: 200,
            texture: mockTextureObject
        } as IAttachmentObject;

        mockColorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        $context.$mainAttachmentObject = mockAttachmentObject;
        $context.currentAttachmentObject = null;
        $context.bind = vi.fn();
        $context.setTransform = vi.fn();
        $context.reset = vi.fn();
    });

    it("should draw normal blend mode to main attachment", () => {
        $context.globalCompositeOperation = "normal";

        execute(mockTextureObject, mockColorTransform, 10, 20);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 10, 20);
    });

    it("should draw layer blend mode to main attachment", () => {
        $context.globalCompositeOperation = "layer";

        execute(mockTextureObject, mockColorTransform, 5, 15);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 5, 15);
    });

    it("should draw add blend mode to main attachment", () => {
        $context.globalCompositeOperation = "add";

        execute(mockTextureObject, mockColorTransform, 0, 0);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    });

    it("should draw screen blend mode to main attachment", () => {
        $context.globalCompositeOperation = "screen";

        execute(mockTextureObject, mockColorTransform, 30, 40);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
    });

    it("should draw alpha blend mode to main attachment", () => {
        $context.globalCompositeOperation = "alpha";

        execute(mockTextureObject, mockColorTransform, 50, 60);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
    });

    it("should draw erase blend mode to main attachment", () => {
        $context.globalCompositeOperation = "erase";

        execute(mockTextureObject, mockColorTransform, 70, 80);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
    });

    it("should draw copy blend mode to main attachment", () => {
        $context.globalCompositeOperation = "copy";

        execute(mockTextureObject, mockColorTransform, 90, 100);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
    });

    it("should handle complex blend mode with intermediate framebuffer", () => {
        $context.globalCompositeOperation = "multiply";

        execute(mockTextureObject, mockColorTransform, 10, 20);

        expect($context.reset).toHaveBeenCalled();
    });

    it("should restore current attachment object after drawing", () => {
        const currentAttachment = {} as IAttachmentObject;
        $context.currentAttachmentObject = currentAttachment;
        $context.globalCompositeOperation = "normal";

        execute(mockTextureObject, mockColorTransform, 0, 0);

        expect($context.bind).toHaveBeenCalledWith(currentAttachment);
    });

    it("should handle color transform with offset values", () => {
        const colorTransformWithOffset = new Float32Array([0.5, 0.5, 0.5, 0.8, 10, 20, 30, 40]);
        $context.globalCompositeOperation = "normal";

        execute(mockTextureObject, colorTransformWithOffset, 15, 25);

        expect($context.bind).toHaveBeenCalledWith(mockAttachmentObject);
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 15, 25);
    });
});
