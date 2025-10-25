import type { Video } from "../../Video";
import { ProgressEvent as Next2DProgressEvent } from "@next2d/events";
import { execute } from "./VideoProgressEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoProgressEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let eventState = "";
        let loaded = 0;
        let total = 0;
        const MockVideo = vi.fn(function(this: any) {
            this.willTrigger = vi.fn(() => true);
            this.dispatchEvent = vi.fn((event: Next2DProgressEvent) =>
            {
                eventState = event.type;
                loaded = event.bytesLoaded;
                total = event.bytesTotal;
            });
        }) as any;

        const MockProgressEvent = vi.fn(function(this: any) {
            this.loaded = 10;
            this.total = 20;
        }) as any;

        expect(eventState).toBe("");
        expect(loaded).toBe(0);
        expect(total).toBe(0);

        execute(new MockVideo(), new MockProgressEvent());

        expect(eventState).toBe(Next2DProgressEvent.PROGRESS);
        expect(loaded).toBe(10);
        expect(total).toBe(20);
    });
});