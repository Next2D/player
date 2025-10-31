import { execute } from "./BlendDrawFilterToMainUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $context } from "../../WebGLUtil";

vi.mock("./BlendOperationUseCase");
vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase");
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService");
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase");
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase");
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase");
vi.mock("../../TextureManager/usecase/TextureManagerBind01UseCase");
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService");
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetBlendWithColorTransformUniformService");
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureWithColorTransformUniformService");
vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase");
vi.mock("../service/BlendResetService");
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerTransferTextureFromRectUseCase");
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase");

describe("BlendDrawFilterToMainUseCase method test", () => {
    let mockTextureObject: ITextureObject;
    let mockAttachmentObject: IAttachmentObject;
    let mockColorTransform: Float32Array;

    beforeEach(() => {
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
