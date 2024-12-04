import { execute } from "./DisplayObjectContainerAdvanceFrameUseCase";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerAdvanceFrameUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        const movieClip = container.addChild(new MovieClip());

        movieClip.totalFrames = 10;
        movieClip.$canAction = false;
        movieClip.$hasTimelineHeadMoved = false;

        expect(movieClip.currentFrame).toBe(1);
        expect(movieClip.$canAction).toBe(false);
        expect(movieClip.$hasTimelineHeadMoved).toBe(false);

        execute(container);

        expect(movieClip.currentFrame).toBe(2);
        expect(movieClip.$canAction).toBe(true); 
        expect(movieClip.$hasTimelineHeadMoved).toBe(true);       
    });
});