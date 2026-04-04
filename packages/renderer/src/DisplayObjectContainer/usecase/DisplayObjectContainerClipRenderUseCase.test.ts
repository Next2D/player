import { execute } from "./DisplayObjectContainerClipRenderUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../Shape/usecase/ShapeClipRenderUseCase", () => ({
    "execute": vi.fn((render_queue: Float32Array, index: number) => {
        // Skip matrix(6) + isGridEnabled(1) + length(1) + commands(n)
        index += 6; // matrix
        const isGrid = Boolean(render_queue[index++]);
        if (isGrid) { index += 24; }
        const len = render_queue[index++];
        index += len;
        return index;
    })
}));

describe("DisplayObjectContainerClipRenderUseCase.js test", () => {

    it("execute test case1 - empty container", () =>
    {
        const renderQueue = new Float32Array([0]); // length = 0
        const result = execute(renderQueue, 0);
        expect(result).toBe(1);
    });

    it("execute test case2 - shape clip child", async () =>
    {
        const shapeClipMod = await import("../../Shape/usecase/ShapeClipRenderUseCase");
        vi.mocked(shapeClipMod.execute).mockClear();

        // length(1) + type(1) + shape data
        const data: number[] = [];
        data.push(1);     // 1 child
        data.push(0x01);  // type = shape
        // matrix (6)
        data.push(1, 0, 0, 1, 0, 0);
        // isGridEnabled
        data.push(0);
        // command length
        data.push(2);
        // commands
        data.push(9, 12);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0);

        expect(shapeClipMod.execute).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case3 - nested container clip", () =>
    {
        // outer: length=1, type=container(0x00)
        //   inner: length=0
        const data: number[] = [];
        data.push(1);     // 1 child
        data.push(0x00);  // type = container
        data.push(0);     // inner length = 0

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0);

        expect(result).toBe(data.length);
    });

    it("execute test case4 - unknown type is skipped", () =>
    {
        const data: number[] = [];
        data.push(1);     // 1 child
        data.push(0x02);  // type = text (not handled in clip)

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0);

        // Should consume length + type but nothing else
        expect(result).toBe(2);
    });
});
