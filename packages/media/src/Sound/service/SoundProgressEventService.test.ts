import { Sound } from "../../Sound";
import { execute } from "./SoundProgressEventService";
import { ProgressEvent as Next2DProgressEvent } from "@next2d/events";
import { describe, expect, it, vi } from "vitest";

describe("SoundProgressEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const sound = new Sound();

        let openState = "";
        let loaded = 0;
        let total = 0;
        sound.addEventListener(Next2DProgressEvent.PROGRESS, (event: Next2DProgressEvent): void =>
        {
            openState = event.type;
            loaded = event.bytesLoaded;
            total = event.bytesTotal;
        });

        expect(openState).toBe("");
        expect(loaded).toBe(0);
        expect(total).toBe(0);

        // mock event
        const MockEvent = vi.fn(function(this: any) {
            this.loaded = 1;
            this.total = 10;
        }) as any;

        execute(sound, new MockEvent());

        expect(openState).toBe(Next2DProgressEvent.PROGRESS);
        expect(loaded).toBe(1);
        expect(total).toBe(10);

    });
});