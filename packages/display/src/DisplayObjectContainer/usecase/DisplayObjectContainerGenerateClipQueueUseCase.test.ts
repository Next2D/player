import { execute } from "./DisplayObjectContainerGenerateClipQueueUseCase";
import { describe, expect, it } from "vitest";
import { renderQueue } from "@next2d/render-queue";
import { MovieClip } from "../../MovieClip";
import { $RENDERER_CONTAINER_TYPE } from "../../DisplayObjectUtil";

describe("DisplayObjectContainerGenerateClipQueueUseCase.js test", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip();
        const matrix = new Float32Array(6);

        renderQueue.offset = 0;
        expect(renderQueue.offset).toBe(0);
        renderQueue.buffer.fill(0);
        expect(renderQueue.buffer.length).toBe(256);

        execute(movieClip, matrix);

        expect(renderQueue.buffer[0]).toBe($RENDERER_CONTAINER_TYPE);
        expect(renderQueue.buffer[1]).toBe(movieClip.children.length);
        expect(renderQueue.offset).toBe(2);

        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });
});