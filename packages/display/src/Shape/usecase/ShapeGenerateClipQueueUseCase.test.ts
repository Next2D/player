import { execute } from "./ShapeGenerateClipQueueUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";
import { renderQueue } from "@next2d/render-queue";
import { $RENDERER_SHAPE_TYPE } from "../../DisplayObjectUtil";

describe("ShapeGenerateClipQueueUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const shape = new Shape();
        shape.graphics.buffer = new Float32Array(8);
        shape.graphics.buffer[0] = 1;
        shape.graphics.buffer[1] = 0;
        shape.graphics.buffer[2] = 0;
        shape.graphics.buffer[3] = 1;
        shape.graphics.buffer[4] = 0;
        shape.graphics.buffer[5] = 0;
        shape.graphics.buffer[6] = 0;
        shape.graphics.buffer[7] = 0;

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(shape, matrix);

        expect(renderQueue.buffer[0]).toBe($RENDERER_SHAPE_TYPE);
        expect(renderQueue.buffer[1]).toBe(1);
        expect(renderQueue.buffer[2]).toBe(0);
        expect(renderQueue.buffer[3]).toBe(0);
        expect(renderQueue.buffer[4]).toBe(1);
        expect(renderQueue.buffer[5]).toBe(0);
        expect(renderQueue.buffer[6]).toBe(0);
        expect(renderQueue.buffer[7]).toBe(0);
        expect(renderQueue.buffer[8]).toBe(8);
        expect(renderQueue.buffer[9]).toBe(1);
        expect(renderQueue.buffer[10]).toBe(0);
        expect(renderQueue.buffer[11]).toBe(0);
        expect(renderQueue.buffer[12]).toBe(1);
        expect(renderQueue.buffer[13]).toBe(0);
        expect(renderQueue.buffer[14]).toBe(0);
        expect(renderQueue.buffer[15]).toBe(0);
        expect(renderQueue.buffer[16]).toBe(0);

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);
    });
});