import type { AnimationToolDataImpl } from "../../interface/AnimationToolDataImpl";
import { Loader } from "../../Loader";
import { Event } from "@next2d/events";
import { execute } from "./LoaderBuildService";
import { describe, expect, it, vi } from "vitest";

describe("LoaderBuildService.js test", () =>
{
    it("execute test case1", async () =>
    {
        const loader = new Loader();

        let openState = "";
        loader
            .contentLoaderInfo
            .addEventListener(Event.COMPLETE, (event: Event): void =>
            {
                openState = event.type;
            });

        expect(openState).toBe("");

        // mock save data
        const object: AnimationToolDataImpl = {
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

        await execute(loader, object);

        expect(openState).toBe(Event.COMPLETE);
    });
});