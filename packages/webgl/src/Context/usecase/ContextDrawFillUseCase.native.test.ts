import { describe, expect, it, beforeEach, vi } from "vitest";

// 実行環境が __next2dSolidFills を置いている状態 ($nativeSolidFills が null でない状態) を作る
const mocks = vi.hoisted(() => ({
    "normal": vi.fn(),
    "run": vi.fn(),
    "linear": vi.fn(),
    "grid": new Map<number, Float32Array | null>(),
    "types": [] as string[],
    "indexes": [] as number[]
}));

vi.mock("../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase", () => ({
    "execute": vi.fn(() => ({ "id": 1, "resource": {} }))
}));
vi.mock("../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService", () => ({
    "execute": vi.fn()
}));
vi.mock("./ContextNormalFillUseCase", () => ({ "execute": mocks.normal }));
vi.mock("./ContextNormalFillRunUseCase", () => ({
    // counts は使い回しの配列なので、呼ばれた時点の内容を控える
    "execute": (vao: unknown, offset: number, counts: Int32Array, length: number): void =>
    {
        mocks.run(offset, Array.from(counts.subarray(0, length)));
    }
}));
vi.mock("./ContextLinearGradientFillUseCase", () => ({ "execute": mocks.linear }));
vi.mock("./ContextRadialGradientFillUseCase", () => ({ "execute": vi.fn() }));
vi.mock("./ContextPatternBitmapFillUseCase", () => ({ "execute": vi.fn() }));
vi.mock("../../Stencil/service/StencilResetService", () => ({ "execute": vi.fn() }));
vi.mock("../../Gradient", () => ({ "$gradientData": [] }));
vi.mock("../../Grid", () => ({
    "$terminateGrid": vi.fn(),
    "$gridDataMap": mocks.grid
}));
vi.mock("../../Mesh", () => ({
    "$fillBufferIndexes": mocks.indexes,
    "$fillTypes": mocks.types,
    "$clearFillBufferSetting": vi.fn()
}));
vi.mock("../../WebGLUtil.ts", () => ({
    "$gl": { "stencilMask": vi.fn() },
    "$nativeSolidFills": vi.fn(),
    "$enableStencilTest": vi.fn(),
    "$disableStencilTest": vi.fn()
}));

import { execute } from "./ContextDrawFillUseCase";

const setup = (types: string[], indexes: number[]): void =>
{
    mocks.types.length = 0;
    mocks.types.push(...types);
    mocks.indexes.length = 0;
    mocks.indexes.push(...indexes);
};

describe("ContextDrawFillUseCase.js test (the runtime provides __next2dSolidFills)", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mocks.grid.clear();
    });

    it("should execute consecutive solid fills in one run", () =>
    {
        setup(["fill", "fill", "fill"], [6, 9, 3]);
        execute();

        expect(mocks.run.mock.calls).toEqual([[0, [6, 9, 3]]]);
        expect(mocks.normal).not.toHaveBeenCalled();
        expect(mocks.indexes.length).toBe(0);
    });

    it("should split the run at other fill types and keep the vertex offset", () =>
    {
        setup(["fill", "fill", "linear", "fill"], [6, 9, 12, 3]);
        execute();

        expect(mocks.run.mock.calls).toEqual([[0, [6, 9]], [27, [3]]]);
        expect(mocks.linear).toHaveBeenCalledTimes(1);
        expect(mocks.linear.mock.calls[0][1]).toBe(15);
        expect(mocks.linear.mock.calls[0][2]).toBe(12);
    });

    it("should execute fills with 9-slice one by one, and resume runs after it ends", () =>
    {
        const grid = new Float32Array(26);
        mocks.grid.set(1, grid);
        mocks.grid.set(3, null);
        setup(["fill", "fill", "fill", "fill", "fill"], [3, 6, 9, 12, 15]);
        execute();

        // 0 はまとめて実行 (次で 9スライスの設定が変わるので 1 個で区切る)、1 と 2 は 9スライスつきで 1 つずつ、
        // 3 と 4 は 9スライスが終わったのでまとめて実行
        expect(mocks.run.mock.calls).toEqual([[0, [3]], [18, [12, 15]]]);
        expect(mocks.normal).toHaveBeenCalledTimes(2);
        expect(mocks.normal.mock.calls[0].slice(1)).toEqual([3, 6, grid]);
        expect(mocks.normal.mock.calls[1].slice(1)).toEqual([9, 9, grid]);
    });

    it("should handle a run longer than the initial work buffer", () =>
    {
        const types: string[] = [];
        const indexes: number[] = [];
        for (let idx = 0; idx < 700; ++idx) {
            types.push("fill");
            indexes.push(idx % 5 * 3 + 3);
        }
        setup(types, indexes.slice());
        execute();

        expect(mocks.run).toHaveBeenCalledTimes(1);
        expect(mocks.run.mock.calls[0][1]).toEqual(indexes);
    });
});
