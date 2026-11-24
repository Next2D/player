import { describe, expect, it, beforeEach, vi } from "vitest";

const mocks = vi.hoisted(() =>
{
    const order: string[] = [];
    const shader = (name: string): { program: object, useProgram: () => void, bindUniform: () => void } => ({
        "program": { name },
        "useProgram": (): void => { order.push(`${name}.useProgram`) },
        "bindUniform": (): void => { order.push(`${name}.bindUniform`) }
    });
    return {
        order,
        "mask": shader("mask"),
        "color": shader("color"),
        "native": vi.fn((): void => { order.push("native") }),
        "useGridOfMask": [] as boolean[],
        "useGridOfColor": [] as boolean[]
    };
});

vi.mock("../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService", () => ({
    "execute": (use_grid: boolean): unknown => { mocks.useGridOfMask.push(use_grid); return mocks.mask }
}));
vi.mock("../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService", () => ({
    "execute": (use_grid: boolean): unknown => { mocks.useGridOfColor.push(use_grid); return mocks.color }
}));
vi.mock("../../VertexArrayObject/service/VertexArrayObjectBindService", () => ({
    "execute": (): void => { mocks.order.push("bindVertexArray") }
}));
vi.mock("../../Blend/service/BlendResetService", () => ({
    "execute": (): void => { mocks.order.push("blendReset") }
}));
vi.mock("../../WebGLUtil.ts", () => ({
    "$nativeSolidFills": mocks.native
}));

import { execute } from "./ContextNormalFillRunUseCase";
import {
    STENCIL_MODE_FILL,
    STENCIL_MODE_MASK,
    $currentStencilMode,
    $colorMaskEnabled,
    $sampleAlphaToCoverageEnabled,
    $setStencilMode,
    $setColorMaskEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

describe("ContextNormalFillRunUseCase.js test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mocks.order.length = 0;
        mocks.useGridOfMask.length = 0;
        mocks.useGridOfColor.length = 0;
    });

    it("should prepare once, then call the runtime with both programs and the counts", () =>
    {
        const vertexArrayObject = { "id": 1, "resource": {} } as never;
        const counts = new Int32Array([6, 9, 3, 0]);
        execute(vertexArrayObject, 12, counts, 3);

        // 準備は実行環境の呼び出しより前。色のプログラムを最後に使用中にしておく
        // (実行環境も色のプログラムを使用中にして戻るので、使用中のプログラムの控えと一致する)
        expect(mocks.order).toEqual([
            "mask.useProgram", "mask.bindUniform",
            "color.useProgram", "color.bindUniform",
            "blendReset", "bindVertexArray",
            "native"
        ]);
        expect(mocks.useGridOfMask).toEqual([false]);
        expect(mocks.useGridOfColor).toEqual([false]);
        expect(mocks.native).toHaveBeenCalledWith(
            mocks.mask.program, mocks.color.program, 12, 3, counts
        );
    });

    it("should leave the cached stencil state as after a fill executed from JavaScript", () =>
    {
        $setStencilMode(STENCIL_MODE_MASK);
        $setColorMaskEnabled(false);
        $setSampleAlphaToCoverageEnabled(true);

        execute({ "id": 1, "resource": {} } as never, 0, new Int32Array([3]), 1);

        expect($currentStencilMode).toBe(STENCIL_MODE_FILL);
        expect($colorMaskEnabled).toBe(true);
        expect($sampleAlphaToCoverageEnabled).toBe(false);
    });
});
