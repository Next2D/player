import { afterEach, describe, expect, it, vi } from "vitest";
import type { Node } from "@next2d/texture-packer";
import { renderQueue } from "@next2d/render-queue";
import { addDisplayObjectToInstanceArray, clearComplexBlendQueue, getComplexBlendQueue } from "./BlendInstancedManager";

vi.mock("../WebGPUUtil", () => ({ "$context": null }));
vi.mock("../Shader/ShaderInstancedManager", () => ({
    "ShaderInstancedManager": class { count = 0; }
}));

const node = { "index": 0, "x": 0, "y": 0, "w": 100, "h": 100 } as Node;
const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 10, 20, 1]);
const colors = new Float32Array([0.5, -0, 1.25, 0.75, -32, 128, 300, 64]);
const draw = (source: Float32Array, mode: string, offset?: number): void =>
{
    addDisplayObjectToInstanceArray(node, 0, 0, 100, 100,
        source, matrix, mode, 800, 600, 4096, 0.375, offset);
};

describe("Blend color transform element offsets", () =>
{
    afterEach(() =>
    {
        clearComplexBlendQueue();
        vi.restoreAllMocks();
    });

    it.each(["normal", "layer", "add", "screen", "alpha", "erase", "copy"])(
        "packs the same instance with a sliced source and omitted offset (%s)", mode =>
        {
            const storage = new Float32Array(40).fill(999);
            const source = storage.subarray(5, 35);
            source.set(colors, 9);
            const push = vi.spyOn(renderQueue, "pushInstanceBuffer").mockImplementation(() => {});
            draw(colors, mode);
            const expected = [...push.mock.calls[0]];
            const subarray = vi.spyOn(source, "subarray");
            draw(source, mode, 9);
            expect(push.mock.calls[1]).toEqual(expected);
            expect(push.mock.calls[1].slice(16)).toEqual([
                0.5, -0, 1.25, 0.375, -32 / 255, 128 / 255, 300 / 255, 0
            ]);
            expect(subarray).not.toHaveBeenCalled();
        }
    );

    it("copies exactly eight raw values for deferred blend and owns them across source reuse", () =>
    {
        const storage = new Float32Array(40).fill(999);
        const source = storage.subarray(5);
        source.set(colors, 7);
        const bits = new Uint32Array(source.buffer, source.byteOffset + 7 * 4, 8);
        bits[2] = 0x7fc01234;
        const expectedBits = bits.slice();
        draw(source, "multiply", 7);
        const subarray = vi.spyOn(colors, "subarray");
        draw(colors, "overlay");
        expect(subarray).not.toHaveBeenCalled();
        const queue = getComplexBlendQueue();
        expect(queue).toHaveLength(2);
        expect(queue[0].color_transform).not.toBe(source);
        expect(queue[0].color_transform).not.toBe(queue[1].color_transform);
        source.fill(0);
        expect(new Uint32Array(queue[0].color_transform.buffer)).toEqual(expectedBits);
        expect(queue[1].color_transform).toEqual(colors);
        expect(queue[0].global_alpha).toBe(0.375);
        clearComplexBlendQueue();
        draw(colors, "multiply");
        expect(getComplexBlendQueue()[0].color_transform).toEqual(colors);
    });
});
