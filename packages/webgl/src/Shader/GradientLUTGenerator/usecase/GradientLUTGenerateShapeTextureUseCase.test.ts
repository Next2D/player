import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock modules at the top level
const mockAttachmentObject = {
    "frameBuffer": "mockFrameBuffer",
    "texture": "mockTexture",
    "width": 512,
    "height": 1
};

let mockScissorBox = [0, 0, 0, 0];
let currentAttachment: any = null;
let scissorTestEnabled = false;
let currentScissor = [0, 0, 0, 0];
let bindCallCount = 0;
let enableCalls: string[] = [];
let disableCalls: string[] = [];
let scissorCalls: number[][] = [];

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => 
{
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            "SCISSOR_TEST": "SCISSOR_TEST",
            "SCISSOR_BOX": "SCISSOR_BOX",
            "getParameter": vi.fn((param) =>
            {
                if (param === "SCISSOR_BOX") {
                    return mockScissorBox;
                }
                return null;
            }),
            "disable": vi.fn((cap) =>
            {
                disableCalls.push(cap);
                scissorTestEnabled = false;
            }),
            "enable": vi.fn((cap) =>
            {
                enableCalls.push(cap);
                scissorTestEnabled = true;
            }),
            "scissor": vi.fn((x, y, w, h) =>
            {
                currentScissor = [x, y, w, h];
                scissorCalls.push([x, y, w, h]);
            })
        },
        $context: {
            get currentAttachmentObject() {
                return currentAttachment;
            },
            "bind": vi.fn(() =>
            {
                bindCallCount++;
            })
        }
    };
});

vi.mock("../../GradientLUTGenerator.ts", async (importOriginal) => 
{
    const mod = await importOriginal<typeof import("../../GradientLUTGenerator.ts")>();
    return {
        ...mod,
        $getGradientAttachmentObject: vi.fn(() => mockAttachmentObject),
        $getGradientLUTGeneratorMaxLength: vi.fn(() => 10),
        $rgbToLinearTable: new Float32Array(256),
        $rgbIdentityTable: new Float32Array(256)
    };
});

vi.mock("../../../Blend/service/BlendOneZeroService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../Variants/GradientLUT/service/VariantsGradientLUTShaderService.ts", () => ({
    execute: vi.fn(() => ({
        useProgram: vi.fn(),
        bindUniform: vi.fn()
    }))
}));

vi.mock("../service/GradientLUTSetUniformService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("./GradientLUTGeneratorFillTextureUseCase.ts", () => ({
    execute: vi.fn()
}));

import { execute } from "./GradientLUTGenerateShapeTextureUseCase";

describe("GradientLUTGenerateShapeTextureUseCase.js method test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        scissorTestEnabled = false;
        currentScissor = [0, 0, 0, 0];
        bindCallCount = 0;
        enableCalls = [];
        disableCalls = [];
        scissorCalls = [];
    });

    it("test case - linear interpolation with single stop segment", () =>
    {
        mockScissorBox = [10, 20, 100, 50];
        currentAttachment = mockAttachmentObject;

        // RGB linear interpolation (interpolation = 0)
        const stops = [
            0,   255, 0,   0,   255,  // offset=0,   R=255, G=0,   B=0,   A=255
            255, 0,   255, 0,   255   // offset=255, R=0,   G=255, B=0,   A=255
        ];
        const interpolation = 0;

        const result = execute(stops, interpolation);

        // シザーテストが無効化され、その後再び有効化されたことを確認
        expect(scissorTestEnabled).toBe(true);

        // シザーボックスが復元されたことを確認
        expect(currentScissor).toEqual(mockScissorBox);

        // 結果のテクスチャが返されることを確認
        expect(result).toBe("mockTexture");
    });

    it("test case - RGB interpolation with multiple stop segments", () =>
    {
        mockScissorBox = [0, 0, 512, 1];
        currentAttachment = null;

        // RGB interpolation (interpolation = 1)
        // 3 stops = 15 values (5 per stop)
        const stops = [
            0,   255, 0,   0,   255,
            127, 0,   255, 0,   255,
            255, 0,   0,   255, 255
        ];
        const interpolation = 1;

        const result = execute(stops, interpolation);

        expect(result).toBe("mockTexture");
    });

    it("test case - no current attachment (null case)", () =>
    {
        mockScissorBox = [5, 10, 200, 100];
        currentAttachment = null;

        const stops = [0, 255, 0, 0, 255, 255, 0, 255, 0, 255];
        const interpolation = 0;

        const result = execute(stops, interpolation);

        // currentAttachment が null なので、bind は1回だけ呼ばれる（gradientAttachmentObject のみ）
        expect(bindCallCount).toBe(1);
        expect(result).toBe("mockTexture");
    });

    it("test case - verifies scissor test is properly restored", () =>
    {
        mockScissorBox = [15, 25, 150, 75];
        currentAttachment = mockAttachmentObject;

        const stops = [0, 255, 0, 0, 255, 255, 0, 255, 0, 255];
        const interpolation = 0;

        execute(stops, interpolation);

        // シザーテストが最初に無効化され、最後に有効化されることを確認
        expect(disableCalls).toContain("SCISSOR_TEST");
        expect(enableCalls).toContain("SCISSOR_TEST");

        // シザーボックスが元の値で復元されることを確認
        const lastScissorCall = scissorCalls[scissorCalls.length - 1];
        expect(lastScissorCall).toEqual(mockScissorBox);
    });
});
