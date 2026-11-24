import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as fillAtlas } from "./ContextFillWithStencilService";
import { execute as fillMain } from "./ContextFillWithStencilMainService";

// 実行環境が __next2dStencilFill を置いているレンダーパス
const createNativePass = (): GPURenderPassEncoder & { __next2dStencilFill: ReturnType<typeof vi.fn> } =>
{
    return {
        "setPipeline": vi.fn(),
        "setVertexBuffer": vi.fn(),
        "setStencilReference": vi.fn(),
        "setBindGroup": vi.fn(),
        "draw": vi.fn(),
        "__next2dStencilFill": vi.fn()
    } as unknown as GPURenderPassEncoder & { __next2dStencilFill: ReturnType<typeof vi.fn> };
};

const createPipelineManager = (missing: string = ""): PipelineManager =>
{
    return {
        "getPipeline": vi.fn((name: string) => name === missing ? undefined : { "label": name })
    } as unknown as PipelineManager;
};

const vertexBuffer = { "label": "vertexBuffer" } as unknown as GPUBuffer;
const bindGroup = { "label": "bindGroup" } as unknown as GPUBindGroup;

describe("ContextFillWithStencilService / ContextFillWithStencilMainService (the runtime provides __next2dStencilFill)", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should perform both passes of an atlas fill with one call into the runtime", () =>
    {
        const pass = createNativePass();
        fillAtlas(pass, createPipelineManager(), vertexBuffer, 12, bindGroup, 512);

        expect(pass.__next2dStencilFill).toHaveBeenCalledTimes(1);
        const args = pass.__next2dStencilFill.mock.calls[0];
        expect(args[0]).toEqual({ "label": "stencil_write_atlas" });
        expect(args[1]).toEqual({ "label": "stencil_fill_atlas" });
        expect(args[2]).toBe(vertexBuffer);
        expect(args[3]).toBe(bindGroup);
        expect(args[4]).toBe(512);
        expect(args[5]).toBe(12);

        expect(pass.setPipeline).not.toHaveBeenCalled();
        expect(pass.draw).not.toHaveBeenCalled();
    });

    it("should perform both passes of a main fill with one call into the runtime", () =>
    {
        const pass = createNativePass();
        fillMain(pass, createPipelineManager(), vertexBuffer, 24, bindGroup, 256);

        expect(pass.__next2dStencilFill).toHaveBeenCalledTimes(1);
        const args = pass.__next2dStencilFill.mock.calls[0];
        expect(args[0]).toEqual({ "label": "stencil_write_main" });
        expect(args[1]).toEqual({ "label": "stencil_fill_main" });
        expect(args.slice(2)).toEqual([vertexBuffer, bindGroup, 256, 24]);
        expect(pass.draw).not.toHaveBeenCalled();
    });

    it("should fall back to the separate calls when a pipeline is missing", () =>
    {
        // 塗りのパイプラインが無い: 従来どおり、ステンシルへの書き込みだけを行う
        const withoutFill = createNativePass();
        fillAtlas(withoutFill, createPipelineManager("stencil_fill_atlas"), vertexBuffer, 12, bindGroup, 0);
        expect(withoutFill.__next2dStencilFill).not.toHaveBeenCalled();
        expect(withoutFill.setPipeline).toHaveBeenCalledTimes(1);
        expect(withoutFill.draw).toHaveBeenCalledTimes(1);

        // 書き込みのパイプラインが無い: 従来どおり、塗りだけを行う
        const withoutWrite = createNativePass();
        fillMain(withoutWrite, createPipelineManager("stencil_write_main"), vertexBuffer, 12, bindGroup, 0);
        expect(withoutWrite.__next2dStencilFill).not.toHaveBeenCalled();
        expect(withoutWrite.setPipeline).toHaveBeenCalledTimes(1);
        expect(withoutWrite.draw).toHaveBeenCalledTimes(1);
    });
});
