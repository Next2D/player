import type { Video } from "../../Video";
import {
    VideoEvent,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";
import { execute } from "./VideoProgressEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoProgressEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let eventState = "";
        let loaded = 0;
        let total = 0;
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn((event: Next2DProgressEvent) =>
                {
                    eventState = event.type;
                    loaded = event.bytesLoaded;
                    total = event.bytesTotal;
                })
            } as unknown as Video;
        });

        const MockProgressEvent = vi.fn().mockImplementation(() =>
        {
            return {
                "loaded": 10,
                "total": 20
            } as unknown as ProgressEvent;
        });

        expect(eventState).toBe("");
        expect(loaded).toBe(0);
        expect(total).toBe(0);

        execute(new MockVideo(), new MockProgressEvent());

        expect(eventState).toBe(Next2DProgressEvent.PROGRESS);
        expect(loaded).toBe(10);
        expect(total).toBe(20);
    });
});