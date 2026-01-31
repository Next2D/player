import { describe, it, expect, vi, beforeEach } from "vitest";
import { Context } from "./Context";

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
    COPY_DST: 2
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

    describe("constructor", () =>
    {
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
            expect(context.caps).toBe(1);     // round
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

    describe("clearRect", () =>
    {
        it("should be a no-op in WebGPU (clear happens at render pass start)", () =>
        {
            // clearRect does nothing in WebGPU - clear is done at render pass start
            expect(() => context.clearRect(0, 0, 100, 100)).not.toThrow();
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
});
