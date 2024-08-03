import { Sound } from "../../Sound";
import { execute } from "./SoundLoadEndEventService";
import {
    IOErrorEvent,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";
import { describe, expect, it, vi } from "vitest";

describe("SoundLoadendEventService.js test", () =>
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
        const MockEvent = vi.fn().mockImplementation(() =>
        {
            return {
                "target": {
                    "status": 200,
                    "statusText": "OK"
                },
                "loaded": 1,
                "total": 10
            } as unknown as ProgressEvent;
        });

        execute(sound, new MockEvent());

        expect(openState).toBe(Next2DProgressEvent.PROGRESS);
    });

    it("execute test case2", () =>
    {
        const sound = new Sound();

        let openState = "";
        sound.addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void =>
        {
            openState = event.type;
        });

        expect(openState).toBe("");

        // mock event
        const MockEvent = vi.fn().mockImplementation(() =>
        {
            return {
                "target": {
                    "status": 404,
                    "statusText": "Not Found"
                },
                "loaded": 1,
                "total": 10
            } as unknown as ProgressEvent;
        });

        execute(sound, new MockEvent());

        expect(openState).toBe(IOErrorEvent.IO_ERROR);
    });
});