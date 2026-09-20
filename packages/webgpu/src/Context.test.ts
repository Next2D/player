import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Context } from "./Context";
import { Node } from "@next2d/texture-packer";
import { getComplexBlendQueue, getInstancedShaderManager } from "./Blend/BlendInstancedManager";
import { $cacheStore } from "@next2d/cache";
import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { FrameBufferManager } from "./FrameBufferManager";
import type { BufferManager } from "./BufferManager";
import type { PipelineManager } from "./Shader/PipelineManager";
import type { ExternalImageUploadBatch } from "./ExternalImageUploadBatch";

// Mock WebGPU globals
const mockTexture = {
    createView: vi.fn().mockReturnValue({}),
    width: 1024,
    height: 768,
    destroy: vi.fn()
};

const mockBuffer = {
    destroy: vi.fn(),
    mapAsync: vi.fn().mockResolvedValue(undefined),
    getMappedRange: vi.fn().mockReturnValue(new ArrayBuffer(256)),
    unmap: vi.fn()
};

const mockRenderPassEncoder = {
    setPipeline: vi.fn(),
    setVertexBuffer: vi.fn(),
    setBindGroup: vi.fn(),
    draw: vi.fn(),
    drawIndexed: vi.fn(),
    end: vi.fn(),
    setStencilReference: vi.fn(),
    setScissorRect: vi.fn(),
    setViewport: vi.fn(),
    executeBundles: vi.fn()
};

const mockCommandEncoder = {
    beginRenderPass: vi.fn().mockReturnValue(mockRenderPassEncoder),
    copyTextureToTexture: vi.fn(),
    copyBufferToBuffer: vi.fn(),
    finish: vi.fn().mockReturnValue({})
};

const mockQueue = {
    onSubmittedWorkDone: vi.fn().mockResolvedValue(undefined),
    submit: vi.fn(),
    writeBuffer: vi.fn(),
    writeTexture: vi.fn()
};

const mockDevice = {
    createTexture: vi.fn().mockReturnValue(mockTexture),
    createBuffer: vi.fn().mockReturnValue(mockBuffer),
    createCommandEncoder: vi.fn().mockReturnValue(mockCommandEncoder),
    createRenderPipeline: vi.fn().mockReturnValue({}),
    createBindGroup: vi.fn().mockReturnValue({}),
    createBindGroupLayout: vi.fn().mockReturnValue({}),
    createPipelineLayout: vi.fn().mockReturnValue({}),
    createSampler: vi.fn().mockReturnValue({}),
    createShaderModule: vi.fn().mockReturnValue({}),
    createComputePipeline: vi.fn().mockReturnValue({}),
    createQuerySet: vi.fn().mockReturnValue({
        destroy: vi.fn()
    }),
    queue: mockQueue,
    features: new Set(["timestamp-query"]),
    limits: {
        maxTextureDimension2D: 8192
    },
    destroy: vi.fn()
};

const mockCanvasContext = {
    configure: vi.fn(),
    getCurrentTexture: vi.fn().mockReturnValue(mockTexture),
    canvas: {
        width: 1024,
        height: 768
    }
};

// Mock GPU constants
vi.stubGlobal("GPUBufferUsage", {
    VERTEX: 32,
    INDEX: 16,
    UNIFORM: 64,
    STORAGE: 128,
    COPY_DST: 8,
    COPY_SRC: 4,
    MAP_READ: 1
});

vi.stubGlobal("GPUTextureUsage", {
    RENDER_ATTACHMENT: 16,
    TEXTURE_BINDING: 4,
    COPY_SRC: 1,
    COPY_DST: 2,
    STORAGE_BINDING: 8
});

vi.stubGlobal("GPUShaderStage", {
    VERTEX: 1,
    FRAGMENT: 2,
    COMPUTE: 4
});

vi.stubGlobal("GPUColorWrite", {
    RED: 1,
    GREEN: 2,
    BLUE: 4,
    ALPHA: 8,
    ALL: 15
});

vi.stubGlobal("GPUMapMode", {
    READ: 1,
    WRITE: 2
});

describe("Context", () =>
{
    let context: Context;

    beforeEach(() =>
    {
        vi.clearAllMocks();
        context = new Context(
            mockDevice as unknown as GPUDevice,
            mockCanvasContext as unknown as GPUCanvasContext,
            "bgra8unorm" as GPUTextureFormat
        );
    });

    it("exposes completion of the submitted GPU queue", async () => {
        await context.getRenderCompletion();
        expect(mockQueue.onSubmittedWorkDone).toHaveBeenCalledTimes(1);
        mockQueue.onSubmittedWorkDone.mockRejectedValueOnce(new Error("lost"));
        await expect(context.getRenderCompletion()).rejects.toThrow("lost");
    });

    it("flushes staged images before submitting frame draws", () => {
        const flush = vi.fn();
        context["externalImageUploadBatch"] = { flush } as unknown as ExternalImageUploadBatch;
        context.beginFrame();
        context.endFrame();
        expect(flush).toHaveBeenCalledTimes(1);
        expect(flush.mock.invocationCallOrder[0]).toBeLessThan(mockQueue.submit.mock.invocationCallOrder[0]);
    });

    describe("cached filter output pass", () =>
    {
        afterEach(() =>
        {
            vi.restoreAllMocks();
            mockCommandEncoder.beginRenderPass.mockReturnValue(mockRenderPassEncoder);
            getInstancedShaderManager().count = 0;
            getComplexBlendQueue().length = 0;
        });

        const setup = () =>
        {
            const internals = context as unknown as {
                frameStarted: boolean;
                commandEncoder: GPUCommandEncoder;
                renderPassEncoder: GPURenderPassEncoder | null;
                cachedFilterPass: GPURenderPassEncoder | null;
                cachedFilterPassColorView: GPUTextureView | null;
                renderPassIsInstanced: boolean;
                frameBufferManager: FrameBufferManager;
                bufferManager: BufferManager;
                pipelineManager: PipelineManager;
                ensureFillRenderPass(): void;
                resolveMainAttachment(): void;
            };
            internals.frameStarted = true;
            internals.commandEncoder = mockCommandEncoder as unknown as GPUCommandEncoder;
            context.$mainAttachmentObject = {
                "width": 64, "height": 48, "texture": { "view": {} },
                "msaa": true, "msaaTexture": { "view": {} }, "stencil": { "view": {} },
                "msaaStencil": { "view": {} }
            } as IAttachmentObject;
            const cached = { "width": 16, "height": 12, "texture": { "view": {}, "width": 16, "height": 12 } } as IAttachmentObject;
            $cacheStore.set("cached-pass-test", "fKey", "valid");
            $cacheStore.set("cached-pass-test", "fTexture", cached);
            vi.spyOn(internals.pipelineManager, "getPipeline").mockReturnValue({} as GPURenderPipeline);
            vi.spyOn(internals.pipelineManager, "getBindGroupLayout").mockReturnValue({} as GPUBindGroupLayout);
            vi.spyOn(internals.frameBufferManager, "createTemporaryAttachment").mockReturnValue(cached);
            vi.spyOn(internals.frameBufferManager, "releaseTemporaryAttachment").mockImplementation(() => {});
            const passes: typeof mockRenderPassEncoder[] = [];
            vi.spyOn(mockCommandEncoder, "beginRenderPass").mockImplementation(() =>
            {
                const pass = { ...mockRenderPassEncoder, "end": vi.fn() };
                passes.push(pass);
                return pass;
            });
            getInstancedShaderManager().count = 0;
            getComplexBlendQueue().length = 0;
            return { internals, passes, cached };
        };
        const draw = (mode: IBlendMode = "normal", alpha = 1, x = 3) => context.containerDrawCachedFilter(
            mode, new Float32Array([1, 0, 0, 1, x, 4]),
            new Float32Array([1, 1, 1, alpha, 0, 0, 0, 0]),
            new Float32Array([0, 0, 16, 12]), "cached-pass-test", "valid"
        );

        it("keeps one pass across blend changes, closing before submit", () =>
        {
            const { internals, passes } = setup();
            draw(); draw("add"); draw("screen");
            expect(passes).toHaveLength(1);
            expect(passes[0].end).not.toHaveBeenCalled();
            expect(internals.renderPassIsInstanced).toBe(false);
            context.endFrame();
            expect(passes[0].end).toHaveBeenCalledOnce();
            expect(internals.cachedFilterPass).toBeNull();
            expect(internals.cachedFilterPassColorView).toBeNull();
            expect(mockQueue.submit).toHaveBeenCalled();
        });

        it("fuses CT and identity output without a temporary attachment", () =>
        {
            const { internals, passes } = setup();
            draw(); draw("normal", 0.5); draw("screen", 0.7); draw();
            expect(passes).toHaveLength(1);
            expect(passes[0].end).not.toHaveBeenCalled();
            expect(internals.frameBufferManager.createTemporaryAttachment).not.toHaveBeenCalled();
            expect(internals.pipelineManager.getPipeline).toHaveBeenCalledWith("cached_ct_msaa");
            expect(internals.pipelineManager.getPipeline).toHaveBeenCalledWith("cached_ct_screen_msaa");
        });

        it("reuses identity bindings across blends but invalidates on source view replacement", () =>
        {
            const { internals, cached } = setup();
            const getBuffer = vi.spyOn(internals.bufferManager, "getIdentityUVBuffer");
            mockDevice.createBindGroup.mockClear();
            draw(); draw("add"); draw("screen");
            expect(mockDevice.createBindGroup).toHaveBeenCalledOnce();
            expect(getBuffer).toHaveBeenCalledOnce();
            context.drawArraysInstanced();
            draw();
            expect(mockDevice.createBindGroup).toHaveBeenCalledOnce();
            cached.texture!.view = {} as GPUTextureView;
            draw();
            expect(mockDevice.createBindGroup).toHaveBeenCalledTimes(2);
        });

        it("keeps CT uniforms independent and does not reuse identity bindings for CT", () =>
        {
            const { internals } = setup();
            const allocate = vi.spyOn(internals.bufferManager, "acquireAndWriteUniformBuffer");
            mockDevice.createBindGroup.mockClear();
            draw("normal", 0.3); draw("screen", 0.7); draw(); draw("add");
            expect(allocate).toHaveBeenCalledTimes(2);
            expect(allocate.mock.calls[0][0].byteLength).toBe(32);
            expect(mockDevice.createBindGroup).toHaveBeenCalledTimes(3);
            const entries = mockDevice.createBindGroup.mock.calls[2][0].entries;
            expect(Array.from(entries)[0].resource).toMatchObject({ "offset": 0, "size": 16 });
        });

        it.each(["missing pipeline", "non-1:1 texture"])("retains the two-pass CT fallback for %s", reason =>
        {
            const { internals, passes, cached } = setup();
            if (reason === "missing pipeline") {
                vi.mocked(internals.pipelineManager.getPipeline).mockImplementation(name =>
                    name.startsWith("cached_ct") ? undefined : {} as GPURenderPipeline);
            } else {
                cached.texture!.width = 32;
            }
            draw(); draw("normal", 0.5); draw();
            expect(passes).toHaveLength(3);
            expect(passes[0].end).toHaveBeenCalledOnce();
            expect(passes[1].end).toHaveBeenCalledOnce();
            expect(passes[2].end).not.toHaveBeenCalled();
            expect(internals.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalledOnce();
        });

        it("ends at an explicit ordinary-draw flush even with an empty queue", () =>
        {
            const { passes } = setup();
            draw(); context.drawArraysInstanced(); draw();
            expect(passes).toHaveLength(2);
            expect(passes[0].end).toHaveBeenCalledOnce();
        });

        it.each(["ordinary", "complex"])("flushes pending %s draws before continuing cached output", kind =>
        {
            const { internals, passes } = setup();
            draw();
            if (kind === "ordinary") getInstancedShaderManager().count = 1;
            else getComplexBlendQueue().push({} as ReturnType<typeof getComplexBlendQueue>[number]);
            const flush = vi.spyOn(context, "drawArraysInstanced").mockImplementation(() =>
            {
                internals.renderPassEncoder!.end();
                internals.renderPassEncoder = null;
                getInstancedShaderManager().count = 0;
                getComplexBlendQueue().length = 0;
            });
            draw();
            expect(flush).toHaveBeenCalledOnce();
            expect(passes).toHaveLength(2);
            expect(passes[0].end).toHaveBeenCalledOnce();
        });

        it("ends on target binding changes and does not reuse an ended pass", () =>
        {
            const { passes } = setup();
            draw();
            context.bind({ "width": 32, "height": 32, "texture": { "view": {} } } as IAttachmentObject);
            expect(passes[0].end).toHaveBeenCalledOnce();
            draw();
            expect(passes).toHaveLength(2);
        });

        it("does not reuse cached output for a fill pass", () =>
        {
            const { internals, passes } = setup();
            draw(); internals.ensureFillRenderPass();
            expect(passes[0].end).toHaveBeenCalledOnce();
            expect(passes).toHaveLength(2);
            draw();
            expect(passes[1].end).toHaveBeenCalledOnce();
            expect(passes).toHaveLength(3);
        });

        it("does not reuse cached output for a clip pass", () =>
        {
            const { passes } = setup();
            draw();
            context.beginPath(); context.moveTo(0, 0); context.lineTo(10, 0);
            context.lineTo(10, 10); context.closePath(); context.clip();
            expect(passes[0].end).toHaveBeenCalledOnce();
            expect(passes).toHaveLength(2);
        });

        it("closes output before MSAA resolve and only resolves once", () =>
        {
            const { internals, passes } = setup();
            draw(); draw(); internals.resolveMainAttachment(); internals.resolveMainAttachment();
            expect(passes).toHaveLength(2);
            expect(passes[0].end).toHaveBeenCalledOnce();
            expect(passes[1].end).toHaveBeenCalledOnce();
            expect(context.$mainAttachmentObject!.msaaDirty).toBe(false);
        });

        it("keeps an existing pass valid across offscreen draws and cache misses", () =>
        {
            const { passes } = setup();
            draw(); draw("normal", 1, 100); draw();
            $cacheStore.set("cached-pass-test", "fKey", "stale"); draw();
            expect(passes).toHaveLength(1);
            expect(passes[0].end).not.toHaveBeenCalled();
        });

        it("changes passes when the main view changes without an explicit bind", () =>
        {
            const { passes } = setup();
            draw();
            context.$mainAttachmentObject!.msaaTexture!.view = {} as GPUTextureView;
            draw();
            expect(passes).toHaveLength(2);
            expect(passes[0].end).toHaveBeenCalledOnce();
        });

        it("ends cached output before beginning a mask", () =>
        {
            const { passes } = setup();
            draw(); context.beginMask();
            expect(passes[0].end).toHaveBeenCalledOnce();
            expect(passes).toHaveLength(2);
            context.endMask();
        });

        it("drops cached pass references when resize discards the frame", () =>
        {
            const { internals } = setup();
            draw(); context.resize(80, 64, false);
            expect(internals.cachedFilterPass).toBeNull();
            expect(internals.cachedFilterPassColorView).toBeNull();
            expect(internals.renderPassEncoder).toBeNull();
        });
    });

    describe("constructor", () =>
    {
        it("leaves backdrop resolve selection to the complex blend usecase", () =>
        {
            const internals = context as unknown as {
                processComplexBlendQueue(): void;
                resolveMainAttachment(): void;
            };
            const resolve = vi.spyOn(internals, "resolveMainAttachment");
            getComplexBlendQueue().push({
                "node": new Node(0, 0, 0, 1, 1),
                "x_min": 0, "y_min": 0, "x_max": 1, "y_max": 1,
                "color_transform": new Float32Array(8), "matrix": new Float32Array(9),
                "blend_mode": "overlay", "viewport_width": 1, "viewport_height": 1,
                "render_max_size": 1, "global_alpha": 1
            });
            internals.processComplexBlendQueue();
            expect(resolve).not.toHaveBeenCalled();
            expect(getComplexBlendQueue()).toHaveLength(0);
            resolve.mockRestore();
        });

        it("should initialize with default values", () =>
        {
            expect(context).toBeDefined();
            expect(context.$stack).toBeInstanceOf(Array);
            expect(context.$matrix).toBeInstanceOf(Float32Array);
        });

        it("should initialize matrix with identity (3x3)", () =>
        {
            // 3x3 matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1]
            expect(context.$matrix[0]).toBe(1); // [0][0]
            expect(context.$matrix[1]).toBe(0); // [0][1]
            expect(context.$matrix[2]).toBe(0); // [0][2]
            expect(context.$matrix[3]).toBe(0); // [1][0]
            expect(context.$matrix[4]).toBe(1); // [1][1]
            expect(context.$matrix[5]).toBe(0); // [1][2]
            expect(context.$matrix[6]).toBe(0); // [2][0]
            expect(context.$matrix[7]).toBe(0); // [2][1]
            expect(context.$matrix[8]).toBe(1); // [2][2]
        });

        it("should initialize clear color to black transparent", () =>
        {
            expect(context.$clearColorR).toBe(0);
            expect(context.$clearColorG).toBe(0);
            expect(context.$clearColorB).toBe(0);
            expect(context.$clearColorA).toBe(0);
        });

        it("should initialize globalAlpha to 1", () =>
        {
            expect(context.globalAlpha).toBe(1);
        });

        it("should initialize globalCompositeOperation to normal", () =>
        {
            expect(context.globalCompositeOperation).toBe("normal");
        });

        it("should initialize imageSmoothingEnabled to false", () =>
        {
            expect(context.imageSmoothingEnabled).toBe(false);
        });

        it("should initialize stroke properties", () =>
        {
            expect(context.thickness).toBe(1);
            expect(context.caps).toBe(0);     // none
            expect(context.joints).toBe(2);   // miter
            expect(context.miterLimit).toBe(0);
        });

        it("should initialize fill and stroke styles", () =>
        {
            expect(context.$fillStyle).toBeInstanceOf(Float32Array);
            expect(context.$strokeStyle).toBeInstanceOf(Float32Array);
        });

        it("should initialize mask bounds", () =>
        {
            expect(context.maskBounds).toBeDefined();
            expect(context.maskBounds.xMin).toBe(0);
            expect(context.maskBounds.yMin).toBe(0);
            expect(context.maskBounds.xMax).toBe(0);
            expect(context.maskBounds.yMax).toBe(0);
        });
    });

    describe("setTransform", () =>
    {
        it("should update matrix values (3x3 format)", () =>
        {
            context.setTransform(2, 0.5, -0.5, 2, 100, 200);

            // 3x3 matrix layout: [a, b, 0, c, d, 0, e, f, 1]
            expect(context.$matrix[0]).toBe(2);    // a (scale x)
            expect(context.$matrix[1]).toBe(0.5);  // b (skew y)
            expect(context.$matrix[3]).toBe(-0.5); // c (skew x)
            expect(context.$matrix[4]).toBe(2);    // d (scale y)
            expect(context.$matrix[6]).toBe(100);  // e (translate x)
            expect(context.$matrix[7]).toBe(200);  // f (translate y)
        });
    });

    describe("fillStyle", () =>
    {
        it("should update fill style when set", () =>
        {
            context.$fillStyle = new Float32Array([1, 0, 0, 1]);

            expect(context.$fillStyle[0]).toBe(1);
            expect(context.$fillStyle[1]).toBe(0);
            expect(context.$fillStyle[2]).toBe(0);
            expect(context.$fillStyle[3]).toBe(1);
        });
    });

    describe("strokeStyle", () =>
    {
        it("should update stroke style when set", () =>
        {
            context.$strokeStyle = new Float32Array([0, 1, 0, 1]);

            expect(context.$strokeStyle[0]).toBe(0);
            expect(context.$strokeStyle[1]).toBe(1);
            expect(context.$strokeStyle[2]).toBe(0);
            expect(context.$strokeStyle[3]).toBe(1);
        });
    });

    describe("save and restore", () =>
    {
        it("should save current matrix to stack", () =>
        {
            context.setTransform(2, 0, 0, 2, 10, 20);
            context.save();

            expect(context.$stack.length).toBe(1);
            expect(context.$stack[0][0]).toBe(2);    // a
            expect(context.$stack[0][6]).toBe(10);   // e (translate x in 3x3)
        });

        it("should restore matrix from stack", () =>
        {
            context.setTransform(2, 0, 0, 2, 10, 20);
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.restore();

            expect(context.$matrix[0]).toBe(2);
            expect(context.$matrix[6]).toBe(10);   // translate x in 3x3
            expect(context.$stack.length).toBe(0);
        });

        it("should handle multiple save/restore cycles", () =>
        {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.save();
            context.setTransform(2, 0, 0, 2, 0, 0);
            context.save();
            context.setTransform(3, 0, 0, 3, 0, 0);

            expect(context.$matrix[0]).toBe(3);
            expect(context.$stack.length).toBe(2);

            context.restore();
            expect(context.$matrix[0]).toBe(2);
            expect(context.$stack.length).toBe(1);

            context.restore();
            expect(context.$matrix[0]).toBe(1);
            expect(context.$stack.length).toBe(0);
        });
    });

    describe("attachment objects", () =>
    {
        it("should return null for currentAttachmentObject when stack is empty", () =>
        {
            expect(context.currentAttachmentObject).toBeNull();
        });

        it("should return atlas attachment object from frame buffer manager", () =>
        {
            // Atlas attachment is created by FrameBufferManager during initialization
            const atlas = context.atlasAttachmentObject;
            expect(atlas).toBeDefined();
        });
    });

    describe("globalAlpha", () =>
    {
        it("should accept values between 0 and 1", () =>
        {
            context.globalAlpha = 0.5;
            expect(context.globalAlpha).toBe(0.5);

            context.globalAlpha = 0;
            expect(context.globalAlpha).toBe(0);

            context.globalAlpha = 1;
            expect(context.globalAlpha).toBe(1);
        });
    });

    describe("globalCompositeOperation", () =>
    {
        it("should accept valid blend modes", () =>
        {
            const blendModes = [
                "normal", "add", "multiply", "screen",
                "overlay", "hardlight", "darken", "lighten",
                "difference", "subtract", "invert", "alpha", "erase"
            ];

            blendModes.forEach(mode =>
            {
                context.globalCompositeOperation = mode as any;
                expect(context.globalCompositeOperation).toBe(mode);
            });
        });
    });

    describe("thickness", () =>
    {
        it("should set stroke thickness", () =>
        {
            context.thickness = 5;
            expect(context.thickness).toBe(5);

            context.thickness = 0.5;
            expect(context.thickness).toBe(0.5);
        });
    });

    describe("caps", () =>
    {
        it("should set line cap style", () =>
        {
            context.caps = 0; // none
            expect(context.caps).toBe(0);

            context.caps = 1; // round
            expect(context.caps).toBe(1);

            context.caps = 2; // square
            expect(context.caps).toBe(2);
        });
    });

    describe("joints", () =>
    {
        it("should set line join style", () =>
        {
            context.joints = 0; // round
            expect(context.joints).toBe(0);

            context.joints = 1; // bevel
            expect(context.joints).toBe(1);

            context.joints = 2; // miter
            expect(context.joints).toBe(2);
        });
    });

    describe("miterLimit", () =>
    {
        it("should set miter limit value", () =>
        {
            context.miterLimit = 20;
            expect(context.miterLimit).toBe(20);

            context.miterLimit = 1;
            expect(context.miterLimit).toBe(1);
        });
    });

    describe("beginNodeRendering", () =>
    {
        it("should set scissor with +1px extension for clearing (WebGL compatible)", () =>
        {
            // Prepare mock attachment with stencil
            const mockAttachment = {
                "texture": {
                    "view": {},
                    "resource": mockTexture
                },
                "stencil": {
                    "view": {}
                },
                "width": 4096,
                "height": 4096,
                "msaa": false
            };

            // Mock getAttachment to return atlas
            vi.spyOn(context["frameBufferManager"], "getAttachment").mockReturnValue(mockAttachment);
            vi.spyOn(context["frameBufferManager"], "createStencilRenderPassDescriptor").mockReturnValue({
                "colorAttachments": [{ "view": {}, "loadOp": "load", "storeOp": "store" }],
                "depthStencilAttachment": { "view": {}, "stencilLoadOp": "clear", "stencilStoreOp": "store" }
            } as unknown as GPURenderPassDescriptor);

            // Mock pipeline manager
            vi.spyOn(context["pipelineManager"], "getPipeline").mockReturnValue({} as GPURenderPipeline);

            // Mock buffer manager
            vi.spyOn(context["bufferManager"], "acquireVertexBuffer").mockReturnValue(mockBuffer as unknown as GPUBuffer);

            const mockNode = { "x": 100, "y": 200, "w": 50, "h": 30 };

            // Begin frame first
            context.beginFrame();

            // Clear mocks to track calls during beginNodeRendering
            mockRenderPassEncoder.setScissorRect.mockClear();

            // Call beginNodeRendering
            context.beginNodeRendering(mockNode as any);

            // Verify scissor was set with +1px extension for clearing (WebGL compatible)
            // Scissor should be: (x, y, w+1, h+1) = (100, 200, 51, 31)
            expect(mockRenderPassEncoder.setScissorRect).toHaveBeenCalledWith(100, 200, 51, 31);

            // Verify currentNodeScissor is stored for later reset
            expect(context["currentNodeScissor"]).toEqual({ "x": 100, "y": 200, "w": 50, "h": 30 });
        });

        it("should store node scissor info for clear reset", () =>
        {
            const mockAttachment = {
                "texture": {
                    "view": {},
                    "resource": mockTexture
                },
                "stencil": {
                    "view": {}
                },
                "width": 4096,
                "height": 4096,
                "msaa": false
            };

            vi.spyOn(context["frameBufferManager"], "getAttachment").mockReturnValue(mockAttachment);
            vi.spyOn(context["frameBufferManager"], "createStencilRenderPassDescriptor").mockReturnValue({
                "colorAttachments": [{ "view": {}, "loadOp": "load", "storeOp": "store" }],
                "depthStencilAttachment": { "view": {}, "stencilLoadOp": "clear", "stencilStoreOp": "store" }
            } as unknown as GPURenderPassDescriptor);
            vi.spyOn(context["pipelineManager"], "getPipeline").mockReturnValue({} as GPURenderPipeline);
            vi.spyOn(context["bufferManager"], "acquireVertexBuffer").mockReturnValue(mockBuffer as unknown as GPUBuffer);

            const mockNode = { "x": 0, "y": 0, "w": 100, "h": 100 };

            context.beginFrame();
            context.beginNodeRendering(mockNode as any);

            // Verify node scissor is stored
            expect(context["currentNodeScissor"]).toEqual({ "x": 0, "y": 0, "w": 100, "h": 100 });

            // nodeAreaCleared should be false (lazy clear)
            expect(context["nodeAreaCleared"]).toBe(false);
        });
    });

    describe("drawPixels", () =>
    {
        it.each([false, true])("ends pass before writing texture, clearing only atlas output (cached=%s)", cached =>
        {
            const mockAttachment = {
                "texture": {
                    "view": {},
                    "resource": mockTexture
                },
                "stencil": {
                    "view": {}
                },
                "width": 4096,
                "height": 4096,
                "msaa": false
            };

            vi.spyOn(context["frameBufferManager"], "getAttachment").mockReturnValue(mockAttachment);
            vi.spyOn(context["frameBufferManager"], "createStencilRenderPassDescriptor").mockReturnValue({
                "colorAttachments": [{ "view": {}, "loadOp": "load", "storeOp": "store" }],
                "depthStencilAttachment": { "view": {}, "stencilLoadOp": "clear", "stencilStoreOp": "store" }
            } as unknown as GPURenderPassDescriptor);
            vi.spyOn(context["pipelineManager"], "getPipeline").mockReturnValue({} as GPURenderPipeline);
            vi.spyOn(context["bufferManager"], "acquireVertexBuffer").mockReturnValue(mockBuffer as unknown as GPUBuffer);

            const mockNode = { "x": 0, "y": 0, "w": 10, "h": 10 };
            const mockPixels = new Uint8Array(10 * 10 * 4);

            context.beginFrame();
            context.beginNodeRendering(mockNode as any);

            // Verify render pass is active and node area not cleared yet
            expect(context["renderPassEncoder"]).not.toBeNull();
            expect(context["nodeAreaCleared"]).toBe(false);

            if (cached) context["cachedFilterPass"] = context["renderPassEncoder"];

            // Clear mocks
            mockRenderPassEncoder.end.mockClear();
            mockRenderPassEncoder.draw.mockClear();
            mockQueue.submit.mockClear();
            mockQueue.writeTexture.mockClear();

            // Call drawPixels
            const clearNode = vi.spyOn(context as unknown as { ensureNodeAreaCleared(): void }, "ensureNodeAreaCleared");
            context.drawPixels(mockNode as any, mockPixels);

            // Verify node area was cleared (draw(6) for quad)
            if (cached) expect(clearNode).not.toHaveBeenCalled();
            else expect(mockRenderPassEncoder.draw).toHaveBeenCalledWith(6);

            // Verify render pass was ended after clearing
            expect(mockRenderPassEncoder.end).toHaveBeenCalled();
            // submit is no longer called here — commandEncoder is reused by drawPixelsToMsaa
            expect(mockQueue.writeTexture).toHaveBeenCalled();

            // Verify render pass is now null
            expect(context["renderPassEncoder"]).toBeNull();
        });
    });

    describe("drawElement", () =>
    {
        it.each([[false, false], [false, true], [true, false], [true, true]])(
            "shares node clear and image draws until flush (msaa=%s, nextAtlas=%s)", (msaa, nextAtlas) =>
        {
            const attachment = {
                "texture": { "view": {}, "resource": mockTexture },
                "stencil": { "view": {} },
                "msaaTexture": { "view": {} },
                "msaaStencil": { "view": {} },
                "width": 4096, "height": 4096, msaa
            };
            vi.spyOn(context["frameBufferManager"], "getAttachment").mockReturnValue(attachment);
            vi.spyOn(context["pipelineManager"], "getPipeline").mockReturnValue({} as GPURenderPipeline);
            vi.spyOn(context["pipelineManager"], "getBindGroupLayout").mockReturnValue({} as GPUBindGroupLayout);
            mockQueue.copyExternalImageToTexture = vi.fn();
            const first = { "index": 0, "x": 4, "y": 5, "w": 10, "h": 12 } as Node;
            const second = { "index": nextAtlas ? 1 : 0, "x": 30, "y": 50, "w": 8, "h": 9 } as Node;
            context.beginFrame();
            mockCommandEncoder.beginRenderPass.mockClear();
            mockRenderPassEncoder.end.mockClear();
            mockRenderPassEncoder.draw.mockClear();
            mockRenderPassEncoder.setScissorRect.mockClear();
            for (const node of [first, second]) {
                context.beginNodeRendering(node);
                context.drawElement(node, { "width": node.w, "height": node.h } as ImageBitmap, true);
                context.endNodeRendering();
            }
            expect(mockCommandEncoder.beginRenderPass).toHaveBeenCalledTimes(nextAtlas ? 2 : 1);
            expect(mockRenderPassEncoder.end).toHaveBeenCalledTimes(nextAtlas ? 1 : 0);
            expect(mockRenderPassEncoder.draw).toHaveBeenCalledTimes(4);
            expect(mockRenderPassEncoder.setScissorRect).toHaveBeenCalledWith(4, 5, 11, 13);
            expect(mockRenderPassEncoder.setScissorRect).toHaveBeenCalledWith(30, 50, 9, 10);
            expect(mockRenderPassEncoder.setScissorRect).toHaveBeenLastCalledWith(30, 50, 8, 9);
            expect(mockQueue.copyExternalImageToTexture).toHaveBeenCalledTimes(2);
            expect(mockQueue.copyExternalImageToTexture).toHaveBeenCalledWith(
                expect.objectContaining({ "flipY": true }),
                expect.objectContaining({ "premultipliedAlpha": true }),
                { "width": 8, "height": 9 }
            );
            expect(context["pooledRenderTextures"]).toHaveLength(2);
            context.drawArraysInstanced();
            expect(mockRenderPassEncoder.end).toHaveBeenCalledTimes(nextAtlas ? 2 : 1);
            expect(context["renderPassEncoder"]).toBeNull();
        });

        it.each([false, true])("ends pass before copying an image, clearing only atlas output (cached=%s)", cached =>
        {
            const mockAttachment = {
                "texture": {
                    "view": {},
                    "resource": mockTexture
                },
                "stencil": {
                    "view": {}
                },
                "width": 4096,
                "height": 4096,
                "msaa": false
            };

            vi.spyOn(context["frameBufferManager"], "getAttachment").mockReturnValue(mockAttachment);
            vi.spyOn(context["frameBufferManager"], "createStencilRenderPassDescriptor").mockReturnValue({
                "colorAttachments": [{ "view": {}, "loadOp": "load", "storeOp": "store" }],
                "depthStencilAttachment": { "view": {}, "stencilLoadOp": "clear", "stencilStoreOp": "store" }
            } as unknown as GPURenderPassDescriptor);
            vi.spyOn(context["pipelineManager"], "getPipeline").mockReturnValue({} as GPURenderPipeline);
            vi.spyOn(context["bufferManager"], "acquireVertexBuffer").mockReturnValue(mockBuffer as unknown as GPUBuffer);

            // Mock copyExternalImageToTexture
            mockQueue.copyExternalImageToTexture = vi.fn();

            const mockNode = { "x": 0, "y": 0, "w": 10, "h": 10 };
            const mockImageBitmap = { "width": 10, "height": 10 } as ImageBitmap;

            context.beginFrame();
            context.beginNodeRendering(mockNode as any);

            // Verify render pass is active and node area not cleared yet
            expect(context["renderPassEncoder"]).not.toBeNull();
            expect(context["nodeAreaCleared"]).toBe(false);

            if (cached) context["cachedFilterPass"] = context["renderPassEncoder"];

            // Clear mocks
            mockRenderPassEncoder.end.mockClear();
            mockRenderPassEncoder.draw.mockClear();
            mockQueue.submit.mockClear();

            // Call drawElement
            const clearNode = vi.spyOn(context as unknown as { ensureNodeAreaCleared(): void }, "ensureNodeAreaCleared");
            context.drawElement(mockNode as any, mockImageBitmap);

            // Verify node area was cleared (draw(6) for quad)
            if (cached) expect(clearNode).not.toHaveBeenCalled();
            else expect(mockRenderPassEncoder.draw).toHaveBeenCalledWith(6);

            // Verify render pass was ended after clearing
            expect(mockRenderPassEncoder.end).toHaveBeenCalled();
            // submit is no longer called here — commandEncoder is reused by drawElementToMsaa/drawElementToTexture
            expect(mockQueue.copyExternalImageToTexture).toHaveBeenCalled();

            // Verify render pass is now null
            expect(context["renderPassEncoder"]).toBeNull();
        });
    });

    describe("resize と reconfigure フロー", () =>
    {
        it("allocates atlas pages only when requested after resize", () =>
        {
            const createAttachment = vi.spyOn(context["frameBufferManager"], "createAttachment");
            context.resize(800, 600);
            expect(createAttachment.mock.calls.map(call => call[0])).toEqual(["main"]);

            const atlas = context.atlasAttachmentObject;
            expect(atlas).toBeDefined();
            expect(createAttachment.mock.calls.map(call => call[0])).toEqual(["main", "atlas_0"]);
        });

        it("resize()後に$needsReconfigureがtrueになること", () =>
        {
            context.resize(800, 600);
            expect(context["$needsReconfigure"]).toBe(true);
        });

        it("resize()後にmainTexture/mainTextureViewがnullになること", () =>
        {
            // beginFrameでmainTextureを取得
            context.beginFrame();
            expect(context["mainTexture"]).not.toBeNull();
            expect(context["mainTextureView"]).not.toBeNull();

            // endFrameしてからresizeする
            context.endFrame();
            context.resize(800, 600);

            expect(context["mainTexture"]).toBeNull();
            expect(context["mainTextureView"]).toBeNull();
        });

        it("resize()自体ではcanvasContext.configure()が呼ばれないこと", () =>
        {
            // コンストラクタで1回呼ばれているのでクリア
            mockCanvasContext.configure.mockClear();

            context.resize(800, 600);

            // resize()内ではconfigure()を呼ばず、遅延実行する
            expect(mockCanvasContext.configure).not.toHaveBeenCalled();
        });

        it("resize()後のbeginFrame()でconfigure()がgetCurrentTexture()の前に1回だけ呼ばれること", () =>
        {
            context.resize(800, 600);

            // コンストラクタ分のconfigure/getCurrentTextureをクリア
            mockCanvasContext.configure.mockClear();
            mockCanvasContext.getCurrentTexture.mockClear();

            // 呼び出し順序を記録
            const callOrder: string[] = [];
            mockCanvasContext.configure.mockImplementation(() =>
            {
                callOrder.push("configure");
            });
            mockCanvasContext.getCurrentTexture.mockImplementation(() =>
            {
                callOrder.push("getCurrentTexture");
                return mockTexture;
            });

            context.beginFrame();

            // configure()が1回だけ呼ばれる
            expect(mockCanvasContext.configure).toHaveBeenCalledTimes(1);
            // getCurrentTexture()が1回だけ呼ばれる
            expect(mockCanvasContext.getCurrentTexture).toHaveBeenCalledTimes(1);
            // configure()がgetCurrentTexture()の前に呼ばれている
            expect(callOrder).toEqual(["configure", "getCurrentTexture"]);
        });

        it("resize()後のbeginFrame()でconfigure()に正しいパラメータが渡されること", () =>
        {
            context.resize(800, 600);
            mockCanvasContext.configure.mockClear();

            context.beginFrame();

            expect(mockCanvasContext.configure).toHaveBeenCalledWith({
                "device": mockDevice,
                "format": "bgra8unorm",
                "alphaMode": "premultiplied"
            });
        });

        it("resize()後のbeginFrame()で$needsReconfigureがfalseに戻ること", () =>
        {
            context.resize(800, 600);
            expect(context["$needsReconfigure"]).toBe(true);

            context.beginFrame();
            expect(context["$needsReconfigure"]).toBe(false);
        });

        it("2フレーム目のbeginFrame()ではconfigure()が呼ばれないこと", () =>
        {
            context.resize(800, 600);

            // 1フレーム目
            context.beginFrame();
            context.endFrame();

            // 2フレーム目開始前にmockをクリア
            mockCanvasContext.configure.mockClear();
            mockCanvasContext.getCurrentTexture.mockClear();

            // 2フレーム目
            context.beginFrame();

            // configure()は呼ばれない（リサイズなし）
            expect(mockCanvasContext.configure).not.toHaveBeenCalled();
            // getCurrentTexture()は呼ばれる
            expect(mockCanvasContext.getCurrentTexture).toHaveBeenCalledTimes(1);
        });

        it("resize()なしのbeginFrame()ではconfigure()が呼ばれないこと", () =>
        {
            // コンストラクタ分をクリア
            mockCanvasContext.configure.mockClear();
            mockCanvasContext.getCurrentTexture.mockClear();

            context.beginFrame();

            // リサイズしていないのでconfigure()は呼ばれない
            expect(mockCanvasContext.configure).not.toHaveBeenCalled();
            // getCurrentTexture()は呼ばれる
            expect(mockCanvasContext.getCurrentTexture).toHaveBeenCalledTimes(1);
        });

        it("連続resize()でも最終的にconfigure()は1回だけ呼ばれること", () =>
        {
            // 2回連続でresizeする
            context.resize(800, 600);
            context.resize(1024, 768);

            mockCanvasContext.configure.mockClear();

            context.beginFrame();

            // 2回resizeしてもconfigure()は1回だけ
            expect(mockCanvasContext.configure).toHaveBeenCalledTimes(1);
        });
    });
});
