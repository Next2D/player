import { describe, expect, it, vi, beforeEach } from "vitest";

const binds: string[] = vi.hoisted(() => []);
const draws: string[] = vi.hoisted(() => []);
const stencils: string[] = vi.hoisted(() => []);
const state = vi.hoisted(() => ({
    "attachmentId": 0,
    "current": null as any,
    "stencilDisabled": 0,
    "scissor": [0, 0, 0, 0]
}));
const mockScissorBox = vi.hoisted(() => new Int32Array(4));

vi.mock("../../../WebGLUtil.ts", async (importOriginal) =>
{
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $enableScissorTest: vi.fn(),
        $disableScissorTest: vi.fn(),
        $disableStencilTest: vi.fn(() =>
        {
            state.stencilDisabled++;
        }),
        $scissorBox: mockScissorBox,
        $setScissorBox: vi.fn((x, y, w, h) =>
        {
            state.scissor = [x, y, w, h];
        }),
        $context: {
            get currentAttachmentObject ()
            {
                return state.current;
            },
            "bind": vi.fn((attachment: any) =>
            {
                // LUT の枠は、テクスチャの名前から描画先の名前を作る
                binds.push(attachment.name || String(attachment.texture).replace("texture_", ""));
                if (attachment.stencil) {
                    stencils.push(attachment.stencil);
                }
            })
        }
    };
});

vi.mock("../../GradientLUTGenerator.ts", async (importOriginal) =>
{
    const mod = await importOriginal<typeof import("../../GradientLUTGenerator.ts")>();
    return {
        ...mod,
        $getGradientLUTGeneratorMaxLength: vi.fn(() => 10)
    };
});

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase.ts", () => ({
    execute: vi.fn((width: number) =>
    {
        const name = `lut${width}_${state.attachmentId++}`;
        return { name, "texture": `texture_${name}`, "stencil": `stencil${width}`, width, "height": 1 };
    })
}));

vi.mock("../../../TextureManager/usecase/TextureManagerGetTextureUseCase.ts", () => ({
    execute: vi.fn((width: number) => `texture_lut${width}_${state.attachmentId++}`)
}));

vi.mock("../../../Blend/service/BlendOneZeroService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Stencil/service/StencilResetService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../Variants/GradientLUT/service/VariantsGradientLUTShaderService.ts", () => ({
    execute: vi.fn(() => ({}))
}));

vi.mock("../service/GradientLUTSetUniformService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("./GradientLUTGeneratorFillTextureUseCase.ts", () => ({
    execute: vi.fn(() =>
    {
        draws.push(binds[binds.length - 1]);
    })
}));

import { execute } from "./GradientLUTPrepareShapeTexturesUseCase";
import { execute as gradientLUTGenerateShapeTextureUseCase } from "./GradientLUTGenerateShapeTextureUseCase";
import { $clearGradientLUTSlots, $GRADIENT_LUT_SLOT_COUNT } from "../../GradientLUTCache";
import { $gradientData } from "../../../Gradient";
import { $fillTypes } from "../../../Mesh";

const stopsOf = (value: number): number[] => [0, value, 0, 0, 255, 255, 0, 255, 0, 255];

const addLinear = (stops: number[], interpolation: number = 0): void =>
{
    $fillTypes.push("linear");
    $gradientData.push(stops, new Float32Array(6), 0, interpolation);
};

const addRadial = (stops: number[], interpolation: number = 0): void =>
{
    $fillTypes.push("radial");
    $gradientData.push(stops, new Float32Array(6), 0, interpolation, 0.5);
};

describe("GradientLUTPrepareShapeTexturesUseCase.js method test", () =>
{
    const main = { "name": "main" };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        $clearGradientLUTSlots();
        $fillTypes.length = 0;
        $gradientData.length = 0;
        binds.length = 0;
        draws.length = 0;
        stencils.length = 0;
        state.attachmentId = 0;
        state.current = main;
        state.stencilDisabled = 0;
        state.scissor = [0, 0, 0, 0];
        mockScissorBox.set([1, 2, 3, 4]);
    });

    it("test case - nothing is touched when there is no gradient", () =>
    {
        $fillTypes.push("fill", "bitmap", "fill");

        expect(execute()).toBe(false);
        expect(binds).toEqual([]);
        expect(state.stencilDisabled).toBe(0);
    });

    it("test case - every gradient is drawn first and the target is restored once", () =>
    {
        $fillTypes.push("fill");
        addLinear(stopsOf(1));
        $fillTypes.push("bitmap");
        addRadial(stopsOf(2));
        addLinear(stopsOf(3), 1);

        expect(execute()).toBe(true);

        // LUT ごとに別の描画先、元へ戻すのは最後の 1 回だけ
        expect(binds).toEqual(["lut256_0", "lut256_1", "lut256_2", "main"]);
        expect(draws).toEqual(["lut256_0", "lut256_1", "lut256_2"]);

        // 同じ解像度の枠は、ステンシルバッファを共有する (枠を切り替えても付け替えが起きない)
        expect(stencils).toEqual(["stencil256", "stencil256", "stencil256"]);
        expect(state.stencilDisabled).toBe(1);
        expect(state.scissor).toEqual([1, 2, 3, 4]);

        // 塗りの順番や $gradientData は変えない
        expect($fillTypes).toEqual(["fill", "linear", "bitmap", "radial", "linear"]);
        expect($gradientData.length).toBe(13);

        // 塗るときは、用意済みの LUT を描かずに受け取れる
        binds.length = 0;
        expect(gradientLUTGenerateShapeTextureUseCase(stopsOf(2), 0)).toBe("texture_lut256_1");
        expect(gradientLUTGenerateShapeTextureUseCase(stopsOf(3), 1)).toBe("texture_lut256_2");
        expect(gradientLUTGenerateShapeTextureUseCase(stopsOf(1), 0)).toBe("texture_lut256_0");
        expect(binds).toEqual([]);
    });

    it("test case - gradients already held are not drawn again", () =>
    {
        addLinear(stopsOf(1));
        addRadial(stopsOf(2));
        execute();

        // 同じ図形をもう一度
        binds.length = 0;
        state.stencilDisabled = 0;
        expect(execute()).toBe(false);
        expect(binds).toEqual([]);
        expect(state.stencilDisabled).toBe(0);

        // 同じ色が 1 つの図形に何度出ても、描くのは 1 回
        $fillTypes.length = 0;
        $gradientData.length = 0;
        addLinear(stopsOf(7));
        addLinear(stopsOf(7));
        addRadial(stopsOf(7));
        expect(execute()).toBe(true);
        expect(binds).toEqual(["lut256_2", "main"]);
    });

    it("test case - the resolution follows the number of stops", () =>
    {
        const stops: number[] = [];
        for (let idx = 0; idx < 6; ++idx) {
            stops.push(idx * 51, idx, 0, 0, 255);
        }
        addLinear(stopsOf(1));
        addLinear(stops);

        execute();
        expect(binds).toEqual(["lut256_0", "lut512_1", "main"]);
    });

    it("test case - gradients that do not fit are left for the fill itself", () =>
    {
        const count = $GRADIENT_LUT_SLOT_COUNT + 3;
        for (let idx = 0; idx < count; ++idx) {
            addLinear(stopsOf(idx));
        }

        expect(execute()).toBe(true);

        // 枠の数だけ描いて、元へ戻す
        expect(draws.length).toBe($GRADIENT_LUT_SLOT_COUNT);
        expect(binds.length).toBe($GRADIENT_LUT_SLOT_COUNT + 1);
        expect(binds[binds.length - 1]).toBe("main");

        // 用意できたものは描かずに使える
        binds.length = 0;
        gradientLUTGenerateShapeTextureUseCase(stopsOf(0), 0);
        gradientLUTGenerateShapeTextureUseCase(stopsOf($GRADIENT_LUT_SLOT_COUNT - 1), 0);
        expect(binds).toEqual([]);

        // 入りきらなかったものは、塗るときに描く (描画先を切り替えて、戻す)
        gradientLUTGenerateShapeTextureUseCase(stopsOf(count - 1), 0);
        expect(binds.length).toBe(2);
        expect(binds[1]).toBe("main");
    });
});
