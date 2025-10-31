import { Loader } from "../../Loader";
import { execute } from "./LoaderLoadEndEventUseCase";
import {
    Event,
    IOErrorEvent,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";
import { describe, expect, it, vi } from "vitest";

describe("LoaderLoadEndEventUseCase.js test", () =>
{
    it("execute test case1", async () =>
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

        let completeState = "";
        loader
            .contentLoaderInfo
            .addEventListener(Event.COMPLETE, (event: Event): void =>
            {
                completeState = event.type;
            });

        expect(completeState).toBe("");
        expect(openState).toBe("");
        expect(loaded).toBe(0);
        expect(total).toBe(0);

        const object = {
            "type": "json",
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 60,
                "bgColor": "#ffffff"
            },
            "characters": [
                {
                    "controller": [1,2,3]
                }
            ],
            "symbols": []
        };

        // mock event
        const MockEvent = vi.fn(function(this: any) {
            this.target = {
                "status": 200,
                "statusText": "OK",
                "response": object
            };
            this.loaded = 1;
            this.total = 10;
        }) as any;

        await execute(loader, new MockEvent());

        expect(completeState).toBe(Event.COMPLETE);
        expect(openState).toBe(Next2DProgressEvent.PROGRESS);
    });

    it("execute test case2", () =>
    {
        const loader = new Loader();

        let openState = "";
        loader
            .contentLoaderInfo
            .addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void =>
            {
                openState = event.type;
            });

        expect(openState).toBe("");

        // mock event
        const MockEvent = vi.fn(function(this: any) {
            this.target = {
                "status": 404,
                "statusText": "Not Found"
            };
            this.loaded = 1;
            this.total = 10;
        }) as any;

        execute(loader, new MockEvent());

        expect(openState).toBe(IOErrorEvent.IO_ERROR);
    });
});