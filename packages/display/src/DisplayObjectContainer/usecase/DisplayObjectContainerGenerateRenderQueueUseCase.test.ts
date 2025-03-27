import { execute } from "./DisplayObjectContainerGenerateRenderQueueUseCase";
import { describe, expect, it } from "vitest";
import { renderQueue } from "@next2d/render-queue";
import { MovieClip } from "../../MovieClip";
import { $RENDERER_CONTAINER_TYPE } from "../../DisplayObjectUtil";

describe("DisplayObjectContainerGenerateRenderQueueUseCase.js test", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip();
        movieClip.addChild(new MovieClip());
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        renderQueue.offset = 0;
        expect(renderQueue.offset).toBe(0);

        renderQueue.buffer.fill(0);
        expect(renderQueue.buffer.length).toBe(256);

        execute(
            movieClip, [], matrix, colorTransform,
            0, 0, 0, 0
        );

        expect(renderQueue.buffer[0]).toBe(1);
        expect(renderQueue.buffer[1]).toBe($RENDERER_CONTAINER_TYPE);
        expect(renderQueue.buffer[2]).toBe(0);
        expect(renderQueue.buffer[3]).toBe(movieClip.children.length);
        expect(renderQueue.buffer[4]).toBe(-1);
        expect(renderQueue.buffer[5]).toBe(0);
        expect(renderQueue.buffer[6]).toBe(0);
        expect(renderQueue.offset).toBe(7);

        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });
});