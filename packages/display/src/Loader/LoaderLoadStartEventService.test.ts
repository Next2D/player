import { Loader } from "../Loader";
import { execute } from "./LoaderLoadStartEventService";
import {
    Event,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";
import { describe, expect, it, vi } from "vitest";

describe("SoundLoadStartEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const loader = new Loader();

        let openState = "";
        loader
            .contentLoaderInfo
            .addEventListener(Event.OPEN, (event: Event): void =>
            {
                openState = event.type;
            });

        expect(openState).toBe("");

        // mock event
        const MockEvent = vi.fn().mockImplementation(() =>
        {
            return {
                "loaded": 1,
                "total": 10
            } as unknown as ProgressEvent;
        });

        execute(loader.contentLoaderInfo, new MockEvent());

        expect(openState).toBe(Event.OPEN);
    });

    it("execute test case2", () =>
    {
        const loader = new Loader();

        let openState = "";
        let loaded = 0;
        let total = 0;
        loader
            .contentLoaderInfo
            .addEventListener(Next2DProgressEvent.PROGRESS, (event: Next2DProgressEvent): void =>
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
                "loaded": 1,
                "total": 10
            } as unknown as ProgressEvent;
        });

        execute(loader.contentLoaderInfo, new MockEvent());

        expect(openState).toBe(Next2DProgressEvent.PROGRESS);
        expect(loaded).toBe(1);
        expect(total).toBe(10);
    });
});