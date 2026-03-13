import { execute } from "./ShapeClipRenderUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../RendererUtil", () => ({
    "$context": {
        "reset": vi.fn(),
        "setTransform": vi.fn(),
        "useGrid": vi.fn(),
        "clip": vi.fn()
    }
}));

vi.mock("../service/ShapeCommandService", () => ({
    "execute": vi.fn()
}));

describe("ShapeClipRenderUseCase.js test", () => {

    it("execute test case1 - basic clip without grid", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        const shapeCommandService = await import("../service/ShapeCommandService");

        vi.mocked($context.reset).mockClear();
        vi.mocked($context.setTransform).mockClear();
        vi.mocked($context.useGrid).mockClear();
        vi.mocked($context.clip).mockClear();
        vi.mocked(shapeCommandService.execute).mockClear();

        // matrix(6) + isGridEnabled(1) + length(1) + commands(3)
        const renderQueue = new Float32Array([
            1, 0, 0, 1, 10, 20,  // matrix
            0,                     // isGridEnabled = false
            3,                     // command length
            9, 0, 5               // commands (BEGIN_PATH, MOVE_TO partial)
        ]);

        const resultIndex = execute(renderQueue, 0);

        expect($context.reset).toHaveBeenCalledTimes(1);
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 10, 20);
        expect($context.useGrid).toHaveBeenCalledWith(null);
        expect(shapeCommandService.execute).toHaveBeenCalledTimes(1);
        expect($context.clip).toHaveBeenCalledTimes(1);
        expect(resultIndex).toBe(11);
    });

    it("execute test case2 - clip with grid enabled", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        const shapeCommandService = await import("../service/ShapeCommandService");

        vi.mocked($context.reset).mockClear();
        vi.mocked($context.setTransform).mockClear();
        vi.mocked($context.useGrid).mockClear();
        vi.mocked($context.clip).mockClear();
        vi.mocked(shapeCommandService.execute).mockClear();

        // matrix(6) + isGridEnabled(1) + gridData(24) + length(1) + commands(2)
        const data = new Float32Array(6 + 1 + 24 + 1 + 2);
        let idx = 0;
        // matrix
        data[idx++] = 2; data[idx++] = 0; data[idx++] = 0;
        data[idx++] = 2; data[idx++] = 5; data[idx++] = 10;
        // isGridEnabled = true
        data[idx++] = 1;
        // grid data (24 values)
        for (let i = 0; i < 24; i++) {
            data[idx++] = i;
        }
        // command length
        data[idx++] = 2;
        // commands
        data[idx++] = 9; data[idx++] = 12;

        const resultIndex = execute(data, 0);

        expect($context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 5, 10);
        expect($context.useGrid).toHaveBeenCalledTimes(1);
        const gridArg = vi.mocked($context.useGrid).mock.calls[0][0];
        expect(gridArg).not.toBeNull();
        expect(gridArg!.length).toBe(28);
        expect($context.clip).toHaveBeenCalledTimes(1);
        expect(resultIndex).toBe(idx);
    });
});
