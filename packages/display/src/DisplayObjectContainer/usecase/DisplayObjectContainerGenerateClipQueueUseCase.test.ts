import { execute } from "./DisplayObjectContainerGenerateClipQueueUseCase";
import { describe, expect, it } from "vitest";
import { renderQueue } from "@next2d/render-queue";
import { MovieClip } from "../../MovieClip";
import { $RENDERER_CONTAINER_TYPE } from "../../DisplayObjectUtil";

describe("DisplayObjectContainerGenerateClipQueueUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        const matrix = new Float32Array(6);

        expect(renderQueue.buffer.length).toBe(256);
        execute(movieClip, matrix);
        expect(renderQueue.buffer[0]).toBe($RENDERER_CONTAINER_TYPE);
        expect(renderQueue.buffer[1]).toBe(movieClip.children.length);
    });
});