import { MovieClip } from "../../MovieClip";
import { FrameLabel } from "../../FrameLabel";
import { Event } from "@next2d/events";
import { execute } from "./MovieClipDispatchFrameLabelEventService";
import { describe, expect, it, vi } from "vitest";

describe("MovieClipDispatchFrameLabelEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        const frameLabel = new FrameLabel("label", 1);

        movieClip.$labels = new Map();
        movieClip.$labels.set(1, frameLabel);

        frameLabel.willTrigger = vi.fn().mockReturnValue(true);

        let eventEnd = false;
        frameLabel.dispatchEvent = vi.fn((event: Event): boolean => {
            expect(event.type).toBe(Event.FRAME_LABEL);
            eventEnd = true;
            return eventEnd;
        });

        expect(eventEnd).toBe(false);
        execute(movieClip, movieClip.$labels);
        expect(eventEnd).toBe(true);
    });
});